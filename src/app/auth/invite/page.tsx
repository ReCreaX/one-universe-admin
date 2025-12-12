"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, CheckCircle } from "lucide-react";

function InviteAdminContent() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const purpose = searchParams.get("purpose");

  // Auto-verify on mount
  useEffect(() => {
    const verifyInvite = async () => {
      setIsLoading(true);

      // Check if all required parameters are present
      if (!email || !code || !purpose) {
        setErrorMessage("Invalid invitation link. Missing required parameters.");
        setIsLinkValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://one-universe-de5673cf0d65.herokuapp.com/api/v1"}/auth/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              code,
              purpose,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(
            data.message || "Failed to verify invitation. Please try again."
          );
          setIsLinkValid(false);
          setIsLoading(false);
          return;
        }

        setIsLinkValid(true);
        setSuccessMessage("Invitation verified successfully! Redirecting...");

        // Redirect to change password page after 1.5 seconds
        setTimeout(() => {
          router.push(`/auth/setup?email=${email}&code=${code}`);
        }, 1500);
      } catch (error) {
        console.error("Verification error:", error);
        setErrorMessage("An error occurred while verifying your invitation.");
        setIsLinkValid(false);
        setIsLoading(false);
      }
    };

    verifyInvite();
  }, [email, code, purpose, router]);

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8 overflow-x-hidden">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#454345] text-center">Verifying your invitation...</p>
          </div>
        ) : isLinkValid ? (
          <>
            <div className="flex flex-col gap-[16px] mb-[15px]">
              <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-left md:text-center">
                You're Almost In!
              </h3>
              <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px] text-left md:text-center">
                Welcome! Your invitation has been verified successfully. You'll be redirected to set up your password.
              </p>
            </div>

            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
            </div>
          </>
        ) : (
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
              />
              <div className="flex flex-col gap-[15px] mb-[15px]">
                <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%] text-center md:text-left">
                  Invitation Link Invalid
                </h3>
                <div className="">
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    {errorMessage || "This invitation link is no longer valid."}
                  </p>
                  <p className="text-[#454345] text-[1rem] leading-[140%] text-center md:text-left">
                    Please contact the Super Admin to request a new invitation.
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
              </div>
            )}
          </>
        )}
      </aside>
    </section>
  );
}

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