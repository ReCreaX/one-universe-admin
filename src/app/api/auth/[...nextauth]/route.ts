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

    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${token.refreshToken}`
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
      accessTokenExpires: Date.now() + 5 * 60 * 1000,
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
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
      // ✅ FIXED: Proper authorize function with correct image handling
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
          console.log("✅ Profile picture received (first 50 chars):", data.user.profilePicture?.substring(0, 50));
          console.log("📏 Profile picture length:", data.user.profilePicture?.length);

          // ✅ CRITICAL: Return user with 'image' field for NextAuth
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.fullName,
            image: data.user.profilePicture || "/images/user.png", // ✅ This is what NextAuth uses
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
    // ✅ FIXED: JWT callback - preserve image across token refresh
    async jwt({ token, user, trigger }) {
      console.log("🎫 JWT Callback triggered:", { 
        trigger, 
        hasUser: !!user,
        hasTokenImage: !!token.image,
        tokenImageStart: token.image?.toString().substring(0, 50)
      });
      
      // Initial sign-in
      if (user) {
        console.log("🆕 Initial sign-in - setting up token");
        console.log("👤 User image (first 50 chars):", user.image?.substring(0, 50));
        
        const userWithTokens = user as any;
        
        if (!userWithTokens.accessToken || !userWithTokens.refreshToken) {
          console.error("❌ User object missing tokens!");
          return {
            ...token,
            error: "MissingTokensFromAuthorize",
          };
        }

        // ✅ CRITICAL: Store the image in the token
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          image: userWithTokens.image, // ✅ Keep the base64 image here
          accessToken: userWithTokens.accessToken,
          refreshToken: userWithTokens.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
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
        return token; // ✅ Return token as-is to preserve image
      }

      // Token expired → refresh
      console.log("⚠️ Token expired, refreshing...");
      return refreshAccessToken(token);
    },

    // ✅ FIXED: Session callback - pass image correctly to session
    async session({ session, token }) {
      console.log("📋 Session callback:", {
        hasAccessToken: !!token.accessToken,
        hasRefreshToken: !!token.refreshToken,
        hasImage: !!token.image,
        imageStart: token.image?.toString().substring(0, 50),
        hasError: !!token.error,
      });

      session.user = session.user || {};
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.image as string; // ✅ Pass the base64 image
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error;

      if (token.error) {
        console.warn("⚠️ Session has error:", token.error);
      }

      console.log("✅ Session image set (first 50 chars):", session.user.image?.substring(0, 50));

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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };