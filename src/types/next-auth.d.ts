import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    // If you need accessToken/refreshToken on the client, add them here (inside user is safer)
    user: {
      id: string;
      permissions?: Array<{
        module: string;
        action: string;
      }>;
      roles?: string[];
    } & DefaultSession["user"];

    // Optional: top-level custom fields (only available server-side or if explicitly added in session callback)
    // These are NOT sent to the client unless nested under session.user
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }

  /**
   * Extend the built-in User type (returned from authorize, adapters, etc.)
   */
  interface User extends DefaultUser {
    permissions?: Array<{
      module: string;
      action: string;
    }>;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT type
   */
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    permissions?: Array<{
      module: string;
      action: string;
    }>;
    roles?: string[];
  }
}