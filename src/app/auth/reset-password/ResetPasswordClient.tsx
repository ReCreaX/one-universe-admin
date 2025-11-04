// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Info } from "lucide-react";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/authService";
import useToastStore from "@/store/useToastStore";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const { showToast } = useToastStore();
  const router = useRouter();

  const isFormValid = password.trim() !== "" && confirmPassword.trim() !== "";

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Stop shaking as soon as user types
    if (isError) {
      // Only remove error when both passwords match
      if (value === password) {
        setIsError(false);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Update error state dynamically as well
    if (confirmPassword) {
      if (value === confirmPassword) {
        setIsError(false);
      } else {
        setIsError(true);
      }
    }
  };

  // Strong visible shake animation
  const shakeAnimation = {
    x: [0, -12, 12, -12, 12, -8, 8, -5, 5, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otpCode: code,
        newPassword: password,
        confirmPassword,
      });

      if (response.error) {
        return;
      }

      console.log("Password reset successful!");
      showToast(
        "success",
        "Your password has been reset successfully",
        "You can now log in with your new credentials."
      );
      router.push("/auth/sign-in");
    } catch (err) {
      console.error("Error resetting password:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8">
      <aside className="flex flex-col items-start md:max-w-[486px] w-full mb-[40px] gap-[32px]">
        <div className="flex flex-col gap-[16px] mb-[15px]">
          <h2 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left">
            Create a New Password
          </h2>
          <p className="text-[#454345] text-[1.25rem] md:max-w-[396px] leading-[140%] text-left">
            Set a strong password to secure your admin account.
          </p>
          <p className="text-[#454345] text-[1rem] leading-[140%] text-left">
            Make sure your new password is different from previous ones.
          </p>
        </div>

        <form
          className="flex flex-col gap-[24px] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Create Password */}
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                onChange={handlePasswordChange}
                value={password}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength indicators */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap gap-[12px] mt-[6px]"
              >
                <p
                  className={`text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                    password.length >= 8
                      ? "bg-[#1DD2AE] text-[#171417]"
                      : "border border-[#E8E3E3] text-[#6B6969]"
                  }`}
                >
                  <span>8 characters</span>
                  <Check />
                </p>

                <p
                  className={`text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                    /[A-Z]/.test(password)
                      ? "bg-[#1DD2AE] text-[#171417]"
                      : "border border-[#E8E3E3] text-[#6B6969]"
                  }`}
                >
                  <span>Uppercase</span>
                  <Check />
                </p>

                <p
                  className={`text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                    /[a-z]/.test(password)
                      ? "bg-[#1DD2AE] text-[#171417]"
                      : "border border-[#E8E3E3] text-[#6B6969]"
                  }`}
                >
                  <span>Lowercase</span>
                  <Check />
                </p>

                <p
                  className={`text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                    /[0-9]/.test(password)
                      ? "bg-[#1DD2AE] text-[#171417]"
                      : "border border-[#E8E3E3] text-[#6B6969]"
                  }`}
                >
                  <span>Numbers</span>
                  <Check />
                </p>

                <p
                  className={`text-[16px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                    /[^A-Za-z0-9]/.test(password)
                      ? "bg-[#1DD2AE] text-[#171417]"
                      : "border border-[#E8E3E3] text-[#6B6969]"
                  }`}
                >
                  <span>Special character</span>
                  <Check />
                </p>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <motion.input
                key={isError ? "shake" : "normal"}
                onChange={handleConfirmChange}
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                animate={isError ? shakeAnimation : {}}
                id="confirmPassword"
                placeholder="Re-enter your password"
                className={`border outline-none rounded-[12px] py-[12px] px-[16px] w-full transition-all duration-200 ${
                  isError
                    ? "border-[#D84040] focus:border-[#D84040]"
                    : "border-[#B2B2B4] focus:border-[#05060B]"
                }`}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-[8px] items-center text-[#D84040] text-[.875rem] leading-[140%] mt-[4px]"
                >
                  <Info size={15} />
                  <p className="text-[14px] leading-[140%]">
                    Passwords do not match.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <button
          disabled={isLoading || !isFormValid || isError}
          onClick={handleResetPassword}
          type="button"
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </aside>
    </section>
  );
};

export default ResetPasswordPage;
