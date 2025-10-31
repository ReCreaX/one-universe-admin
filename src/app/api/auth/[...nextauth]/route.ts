// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/services/baseUrl";

const baseUrl = getBaseUrl("live");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }
        console.log("Authorizing user:", credentials.email);

        try {
          const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Authentication failed");
            // return null to satisfy the expected return type (unreachable because of throw)
            return null;
          }

          const data = await response.json();
          console.log("Auth response data:", data);

          // Return user object with tokens; cast to any to satisfy NextAuth User type
          return {
            id: data.user?.id || data.id,
            email: data.user?.email || credentials.email,
            name: data.user?.name,
            accessToken: data.tokens?.accessToken || data.accessToken,
            refreshToken: data.tokens?.refreshToken || data.refreshToken,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken;
      }

      // Check if token needs refresh (optional: add expiry check)
      return token;
    },
    async session({ session, token }) {
      // Add tokens to session
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
