"use client";
import { Check, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SetUpContent() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  // Password validation requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChar;
  const isFormValid = isPasswordValid && passwordsMatch;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async () => {

    if (!email) {
      setErrorMessage("Email not found. Please use the invitation link again.");
      return;
    }

    if (!isFormValid) {
      setErrorMessage("Please ensure all password requirements are met.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://one-universe-de5673cf0d65.herokuapp.com/api/v1"}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword: password,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Failed to set password. Please try again."
        );
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Password set successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      console.error("Password setup error:", error);
      setErrorMessage("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        <div className="flex flex-col gap-[16px] mb-[15px]">
          <h2 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
            Set Up Your Admin Account
          </h2>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
            Create a secure password to protect your account.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-[24px] w-full">
          {/* Password Input */}
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full focus:border-[#154751] focus:ring-2 focus:ring-[#154751]"
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

            {/* Password Requirements */}
            <div className="flex flex-wrap gap-[12px]">
              <div
                className={`text-[14px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                  hasMinLength
                    ? "bg-[#1DD2AE] text-[#171417]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span>8 characters</span>
                <Check size={16} />
              </div>
              <div
                className={`text-[14px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                  hasUppercase
                    ? "bg-[#1DD2AE] text-[#171417]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span>Uppercase</span>
                <Check size={16} />
              </div>
              <div
                className={`text-[14px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                  hasLowercase
                    ? "bg-[#1DD2AE] text-[#171417]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span>Lowercase</span>
                <Check size={16} />
              </div>
              <div
                className={`text-[14px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                  hasNumbers
                    ? "bg-[#1DD2AE] text-[#171417]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span>Numbers</span>
                <Check size={16} />
              </div>
              <div
                className={`text-[14px] font-medium py-[4px] px-[8px] rounded-[16px] flex items-center gap-[8px] leading-[140%] ${
                  hasSpecialChar
                    ? "bg-[#1DD2AE] text-[#171417]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <span>Special character</span>
                <Check size={16} />
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full focus:border-[#154751] focus:ring-2 focus:ring-[#154751]"
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

            {/* Password Match Indicator */}
            {confirmPassword && (
              <p
                className={`text-sm ${
                  passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || !passwordsMatch || isLoading}
          className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Setting Up...
            </>
          ) : (
            "Finish Setup"
          )}
        </button>
      </aside>
    </section>
  );
}

const SetUpPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetUpContent />
    </Suspense>
  );
};

export default SetUpPage;