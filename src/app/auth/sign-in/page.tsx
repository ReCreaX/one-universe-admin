"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useEffect, useRef, useState, Suspense } from "react";
import useToastStore from "@/store/useToastStore";

// Separate component that uses useSearchParams
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToastStore();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any broken sessions on mount
  useEffect(() => {
    if (session?.error) {
      console.log("🔄 Clearing broken session...");
      signOut({ redirect: false });
    }
  }, [session]);

  // Redirect immediately if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user && !session?.error) {
      const callbackUrl = searchParams.get("callbackUrl") || "/admin";
      router.replace(callbackUrl);
    }
  }, [session, status, router, searchParams]);

  // Load lock state from localStorage
  useEffect(() => {
    const savedLock = localStorage.getItem("admin-login-lock");
    if (savedLock) {
      const lockTime = parseInt(savedLock, 10);
      if (lockTime > Date.now()) {
        setLockUntil(lockTime);
        setLoginAttempts(5);
      }
    }
  }, []);

  // Timer for lock countdown
  useEffect(() => {
    if (!lockUntil) return;
    const interval = setInterval(() => {
      const diff = Math.floor((lockUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setLockUntil(null);
        setLoginAttempts(0);
        localStorage.removeItem("admin-login-lock");
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockUntil]);

  // Reset login attempts after 2 minutes
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const startResetTimer = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      resetLoginAttempts();
      showToast(
        "warning",
        "Login Attempts Reset",
        "You can try logging in again now.",
        4000
      );
    }, 2 * 60 * 1000);
  };

  // Form submission
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    if (loginAttempts >= 5) {
      showToast(
        "error",
        "Too many login attempts",
        "Please try again later",
        7000
      );
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing session first
      await signOut({ redirect: false });
      
      // Wait a bit for the session to clear
      await new Promise((resolve) => setTimeout(resolve, 200));

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("🔍 Sign-in result:", result);

      if (result?.error) {
        // Login failed
        showToast(
          "error",
          "Invalid email or password",
          result.error || "Please try again",
          5000
        );

        setLoginAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            const lockTime = Date.now() + 5 * 60 * 1000; // 5 min
            setLockUntil(lockTime);
            localStorage.setItem("admin-login-lock", lockTime.toString());
          }
          return newAttempts;
        });

        startResetTimer();
      } else if (result?.ok) {
        // Login successful
        showToast("success", "Login Successful", "Redirecting...", 3000);
        resetLoginAttempts();

        // Wait for session to be established
        await new Promise((resolve) => setTimeout(resolve, 500));

        const callbackUrl = searchParams.get("callbackUrl") || "/admin";
        router.replace(callbackUrl);
      }
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      startResetTimer();
      console.error("🔍 Login error:", error);
      showToast(
        "error",
        "Login Failed",
        "An unexpected error occurred. Please try again.",
        5000
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    email.trim() !== "" && isValidEmail && password.length >= 6;

  // Cleanup
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <section className="flex items-center justify-center h-full">
        <div>Loading...</div>
      </section>
    );
  }

  // If user is already logged in and has valid session, render nothing
  if (status === "authenticated" && !session?.error) return null;

  return (
    <section className="flex items-center justify-center h-full md:px-6 px-1 py-8">
      <aside className="flex flex-col items-start md:max-w-[487px] w-full mb-[40px] gap-[32px]">
        <Image src="/logo/auth-logo.svg" alt="Auth Logo" width={68} height={54} />
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[#171417] font-bold text-[1.625rem] leading-[120%]">
            Welcome Back
          </h3>
          <p className="text-[#454345] text-[1rem] leading-[140%] mt-[12px]">
            Enter your account credentials to login as an admin
          </p>
        </div>

        <form className="flex flex-col gap-[16px] w-full" onSubmit={handleAdminLogin}>
          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] px-[16px] w-full"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label
              className="text-[#05060B] font-medium text-[1rem] leading-[140%]"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                id="password"
                className="border border-[#B2B2B4] outline-none rounded-[12px] py-[12px] pl-[16px] pr-[40px] w-full"
                disabled={isLoading}
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
            <p className="text-right">
              <Link
                className="[color:var(--primary-radial)] text-[.875rem] font-medium leading-[140%]"
                href="/auth/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>
          </div>

          <button
            disabled={isLoading || !isFormValid || loginAttempts >= 5}
            type="submit"
            className="[background:var(--primary-radial)] text-white font-medium leading-[140%] rounded-[20px] w-full py-[16px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Logging in..."
              : loginAttempts >= 5
              ? "Try again in 5 minutes"
              : "Log In"}
          </button>
        </form>
      </aside>

      {loginAttempts >= 5 && lockUntil && (
        <section className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <aside className="flex items-center justify-center flex-col gap-6 shadow-lg md:w-[223px] w-[65%] bg-white md:rounded-2xl p-6">
            <p className="text-center text-[#646264] font-normal text-[1rem]">
              Too many failed attempts. Please try again in 5 minutes.
            </p>
            <h5 className="flex items-center gap-1 text-[#091E22] font-bold text-[1.625rem]">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}
              <span>:</span>
              {String(timeLeft % 60).padStart(2, "0")}
            </h5>
          </aside>
        </section>
      )}
    </section>
  );
}

// Main component with Suspense wrapper
export default function SignInPage() {
  return (
    <Suspense fallback={
      <section className="flex items-center justify-center h-full">
        <div>Loading...</div>
      </section>
    }>
      <SignInForm />
    </Suspense>
  );
}