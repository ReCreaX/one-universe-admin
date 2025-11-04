// services/authService.ts
import { HttpService } from "./httpService";
import { signIn, signOut } from "next-auth/react";

class AuthService {
  private request = new HttpService();
  /**
   * Sign in with NextAuth
   * @returns Promise with result or error
   */
  async signin(data: { email: string; password: string }) {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        return { error: true, message: result.error };
      }

      return { success: true, message: "Login successful" };
    } catch (error) {
      return {
        error: true,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  /**
   * Sign out
   */
  async signout() {
    try {
      await signOut({ redirect: false });
      return { success: true };
    } catch (error) {
      return { error: true, message: "Sign out failed" };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOtp(data: { email: string; otp: string }) {
    return this.request.post("/auth/verify-otp", {
      email: data.email,
      otp: data.otp,
    });
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: { email: string }) {
    return this.request.post("/auth/admin-forgot-password", {
      email: data.email,
    });
  }

  async resetPassword(data: {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return this.request.post("/auth/admin-change-password", {
      email: data.email,
      otpCode: data.otpCode,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  }
}

const authService = new AuthService();
export default authService;
