import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/services/baseUrl";

const baseUrl = getBaseUrl("live");

// --- Refresh token helper ---
async function refreshAccessToken(token: any): Promise<any> {
  try {
    if (!token.refreshToken) {
      console.error("❌ No refresh token available in token object");
      throw new Error("No refresh token");
    }

    console.log("🔄 Attempting to refresh token...");
    console.log("🔑 Refresh token:", token.refreshToken.substring(0, 20) + "...");

    // Your backend expects the refresh token in a cookie named 'refresh_token'
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${token.refreshToken}` // Send as cookie
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      console.error("❌ Failed to parse refresh response:", parseError);
      throw new Error("Invalid response from refresh endpoint");
    }

    if (!res.ok) {
      console.error("❌ Refresh failed with status:", res.status);
      console.error("❌ Response data:", data);
      throw new Error(data.message || `Refresh failed with status ${res.status}`);
    }

    console.log("✅ Token refreshed successfully");

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 min
      error: undefined,
    };
  } catch (error: any) {
    console.error("❌ Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// --- NextAuth options ---
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
     async authorize(credentials) {
  if (!credentials?.email || !credentials.password) {
    console.error("❌ Missing credentials");
    return null;
  }

  try {
    console.log("🔐 Attempting login for:", credentials.email);

    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      console.error("❌ Backend did not return JSON");
      return null;
    }

    // console.log("📥 Login API response:", data);

    if (!res.ok) {
      console.error("❌ Backend rejected login:", data.message);
      return null;
    }

    if (!data.user?.id) {
      console.error("❌ Backend missing user.id");
      return null;
    }

    if (!data.accessToken || !data.refreshToken) {
      console.error("❌ Backend missing tokens");
      return null;
    }

    console.log("✅ Login successful:", data.user.email);

    return {
      id: data.user.id.toString(),
      email: data.user.email,
      name: data.user.fullName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (err) {
    console.error("❌ Authorization error:", err);
    return null;
  }
}

    }),
  ],

  callbacks: {
    // --- JWT callback ---
    async jwt({ token, user, trigger }) {
      console.log("🎫 JWT Callback triggered:", { trigger, hasUser: !!user });
      
      // Initial sign-in
      if (user) {
        console.log("🆕 Initial sign-in - setting up token");
        
        const userWithTokens = user as any;
        
        if (!userWithTokens.accessToken || !userWithTokens.refreshToken) {
          console.error("❌ User object missing tokens!");
          return {
            ...token,
            error: "MissingTokensFromAuthorize",
          };
        }

        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: userWithTokens.accessToken,
          refreshToken: userWithTokens.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min (matches your JWT expiry)
          error: undefined,
        };
      }

      // Check if tokens exist
      if (!token.accessToken || !token.refreshToken) {
        console.error("❌ Missing tokens in JWT callback");
        return {
          ...token,
          error: "MissingTokens",
        };
      }

      // Token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        console.log("✅ Token still valid, expires in:", 
          Math.floor((token.accessTokenExpires - Date.now()) / 1000), "seconds"
        );
        return token;
      }

      // Token expired → refresh
      console.log("⚠️ Token expired, refreshing...");
      return refreshAccessToken(token);
    },

    // --- Session callback ---
    async session({ session, token }) {
      console.log("📋 Session callback:", {
        hasAccessToken: !!token.accessToken,
        hasRefreshToken: !!token.refreshToken,
        hasError: !!token.error,
      });

      session.user = session.user || {};
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error;

      if (token.error) {
        console.warn("⚠️ Session has error:", token.error);
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === "development",
};

// --- Export handler for Next.js API routes ---
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };