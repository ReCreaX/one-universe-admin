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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
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
            return null;
          }

          if (!res.ok || !data.user?.id || !data.accessToken || !data.refreshToken) {
            return null;
          }

          // ✅ DO NOT include image/base64 in returned user
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
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        const userWithTokens = user as any;
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: userWithTokens.accessToken,
          refreshToken: userWithTokens.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      }

      // Missing tokens
      if (!token.accessToken || !token.refreshToken) {
        return { ...token, error: "MissingTokens" };
      }

      // Still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Refresh
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      // ✅ No image passed to session
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error;

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