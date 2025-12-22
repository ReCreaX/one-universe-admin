import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/services/baseUrl";

const baseUrl = getBaseUrl("live");

async function refreshAccessToken(token: any): Promise<any> {
  try {
    if (!token.refreshToken) {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Refresh failed");
    }

    console.log("✅ Token refreshed successfully");

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
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

          const data = await res.json();

          if (!res.ok || !data.user?.id || !data.accessToken || !data.refreshToken) {
            return null;
          }

          let permissions: Array<{module: string, action: string}> = [];
          let roles: string[] = [];

          try {
            const base64Url = data.accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const payload = JSON.parse(jsonPayload);

            permissions = payload.permissions || [];
            roles = payload.roles || [];
          } catch (err) {
            console.error("❌ Failed to decode JWT:", err);
            roles = data.user.roles || [];
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.fullName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            permissions,
            roles,
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
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          permissions: u.permissions || [],
          roles: u.roles || [],
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      }

      if (!token.accessToken || !token.accessTokenExpires || Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      console.log("📋 Session Callback - Building session");
      console.log("   Token permissions count:", (token as any).permissions?.length || 0);

      session.user = session.user || {};
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;

      // ✅ CRITICAL: Expose permissions & roles to client via session.user
      (session.user as any).permissions = (token as any).permissions || [];
      (session.user as any).roles = (token as any).roles || [];

      // Keep top-level for server-side use if needed
      (session as any).accessToken = token.accessToken;
      (session as any).permissions = (token as any).permissions || [];
      (session as any).roles = (token as any).roles || [];

      console.log("✅ Session built with user.permissions count:", (session.user as any).permissions.length);

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