"use client";
import React, { useState, useEffect, Suspense } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, CheckCircle } from "lucide-react";

// Separate component that uses useSearchParams
function InviteAdminContent() {
  const [otp, setOtp] = useState<string>("");
  const [isLinkValid, setIsLinkValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setIsLinkValid(false);
    }
    // Optionally verify token validity with backend
    // verifyTokenValidity(token);
  }, [token]);

  const handleChange = (value: string) => {
    // Only allow digits and alphanumeric characters, max 6 characters
    if (value.length <= 6) {
      setOtp(value);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code");
      return;
    }

    if (!token) {
      setErrorMessage("Invalid invitation token");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Call backend to verify OTP and accept invitation
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://one-universe-de5673cf0d65.herokuapp.com/api/v1"}/auth/verify-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Failed to verify invitation. Please try again."
        );
        return;
      }

      setSuccessMessage("Invitation verified successfully! Redirecting...");
      
      // Redirect to setup password or login page
      setTimeout(() => {
        router.push(`/auth/setup-password?token=${token}`);
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8 overflow-x-hidden">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        {isLinkValid && (
          <>
            <div className="flex flex-col gap-[16px] mb-[15px]">
              <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
                You&apos;re Almost In!
              </h3>
              <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
                Welcome! You've been invited to join the Admin Portal. To
                continue, please verify your invitation using the passcode sent
                to your email.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full gap-6"
            >
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

              {/* OTP Input - 6 digits */}
              <div className="w-full">
                <InputOTP maxLength={6} value={otp} onChange={handleChange}>
                  <InputOTPGroup className="flex gap-3 justify-center w-full">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-[48px] h-[64px] border border-[#B2B2B4] rounded-lg text-center text-lg font-semibold focus:border-[#154751] focus:ring-2 focus:ring-[#154751] focus:outline-none transition"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* OTP Counter */}
              <p className="text-sm text-[#949394]">
                {otp.length} of 6 characters entered
              </p>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Invitation"
                )}
              </button>

              <p className="text-xs text-[#949394] text-center">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  className="text-[#154751] font-medium hover:underline"
                  onClick={() => {
                    // TODO: Implement resend OTP logic
                    setErrorMessage("");
                    alert("Resend OTP functionality coming soon");
                  }}
                >
                  Resend
                </button>
              </p>
            </form>
          </>
        )}

        {!isLinkValid && (
          <>
            <Image
              src="/logo/auth-logo.svg"
              alt="Auth Logo"
              width={68}
              height={54}
              className="block md:hidden"
            />
            <div className="flex flex-col justify-center items-center gap-[32px] w-full">
              <Image
                src="/images/error.png"
                alt="Error"
                width={120}
                height={120}
                className=""
              />
              <div className="flex flex-col gap-[15px] mb-[15px]">
                <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-center md:text-left">
                  Invitation Link Expired
                </h3>
                <div className="">
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    This invitation link is no longer valid.
                  </p>
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    Please contact the Super Admin to request a new invitation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </section>
  );
}

// Main page component with Suspense boundary
const InviteAdminPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InviteAdminContent />
    </Suspense>
  );
};

export default InviteAdminPage;