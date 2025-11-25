import { signIn, signOut, getSession } from "next-auth/react";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  url?: string;
  error?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface SignOutResponse {
  success: boolean;
  message?: string;
}

const authService = {
  async signin(credentials: { email: string; password: string }): Promise<SignInResponse> {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        return {
          success: false,
          error: true,
          message: result.error,
        };
      }

      if (result?.ok) {
        // Fetch the session to get tokens
        const session = await getSession();
        
        return {
          success: true,
          url: result.url || "/admin",
          accessToken: session?.accessToken,
          refreshToken: session?.refreshToken,
        };
      }

      return {
        success: false,
        error: true,
        message: "Login failed",
      };
    } catch (error: any) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: true,
        message: error.message || "An error occurred during sign in",
      };
    }
  },

  async signout(): Promise<SignOutResponse> {
    try {
      await signOut({ redirect: false });
      
      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error: any) {
      console.error("Sign out error:", error);
      return {
        success: false,
        message: error.message || "An error occurred during sign out",
      };
    }
  },
};

export default authService;