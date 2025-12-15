// app/admin/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/store/profileStore";
import authService from "@/services/authService";

// Import all dashboards and notification tab
import SubscriptionDashboard from "./SubscriptionDashboard";
import SponsorAdsDashboard from "./SponsorAdsDashboard";
import PlatformChargesDashboard from "./PlatformChargesDashboard";
import NotificationTab from "./Tabs/NotificationTab";

// ============================================================================
// TOAST NOTIFICATION COMPONENT
// ============================================================================
interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<Toast & { onClose: () => void }> = ({
  id,
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // Auto-dismiss after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 animate-slide-in max-w-md`}
      style={{
        background:
          type === "success"
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={24} className="text-white flex-shrink-0" />
      ) : (
        <XCircle size={24} className="text-white flex-shrink-0" />
      )}
      <p className="text-white font-dm-sans font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Toast Container to hold multiple toasts
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="p-6 space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};


// ============================================================================
// OTP MODAL COMPONENT - Request and verify OTP
// ============================================================================
const OTPModal: React.FC<{
  onClose: () => void;
  onOTPReceived: () => void;
  email: string;
  isLoading: boolean;
  error: string | null;
  token: string;
  showToast: (message: string, type: "success" | "error") => void;
}> = ({ onClose, onOTPReceived, email, isLoading, error, token, showToast }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleChange = (i: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[i] = value;
      setOtp(newOtp);
      if (value && i < 5) {
        document.getElementById(`otp-${i + 1}`)?.focus();
      }
    }
  };

  const isComplete = otp.every((d) => d !== "");
  const otpCode = otp.join("");

  const handleVerifyOTP = async () => {
    if (!isComplete) {
      setVerifyError("Please enter all 6 digits");
      return;
    }

    setVerifying(true);
    setVerifyError(null);

    try {
      console.log("🔐 Verifying OTP in modal...");
      // Verify the OTP immediately
      await authService.verifyPasswordResetOTP(email, otpCode, token);
      console.log("✅ OTP verified successfully in modal");

      // Show success toast
      showToast("OTP verified successfully! ✓", "success");

      // OTP is valid, proceed to password change
      setTimeout(() => onOTPReceived(), 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setVerifyError(errorMessage);
      console.error("OTP verification error:", errorMessage);

      // Show error toast
      showToast(`OTP verification failed: ${errorMessage}`, "error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <h2 className="font-dm-sans font-bold text-2xl text-[#171417]">
            Verify Your Identity
          </h2>
          <p className="text-[#6B6969] text-sm">
            We sent a 6-digit code to <br /> <strong>{email}</strong>
          </p>
        </div>

        {/* OTP Request Error */}
        {error && !verifyError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* OTP Verification Error */}
        {verifyError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={18} />
            <p className="text-red-700 text-sm">{verifyError}</p>
          </div>
        )}

        <div className="flex justify-center gap-2">
          {otp.map((_, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              disabled={isLoading || verifying}
              className="w-11 h-11 text-center text-xl font-bold border-2 border-[#E3E5E5] rounded-lg focus:border-[#154751] outline-none disabled:opacity-50"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={!isComplete || isLoading || verifying}
          className="w-full h-12 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background:
              isComplete && !isLoading && !verifying
                ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                : "#ACC5CF",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting OTP...
            </>
          ) : verifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// PASSWORD CHANGE MODAL COMPONENT - With current password (OTP pre-verified)
// ============================================================================
const PasswordChangeModal: React.FC<{
  onClose: () => void;
  email: string;
  token: string;
  showToast: (message: string, type: "success" | "error") => void;
}> = ({ onClose, email, token, showToast }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasMin = newPass.length >= 8;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasLower = /[a-z]/.test(newPass);
  const hasNumber = /\d/.test(newPass);
  const hasSpecial = /[!@#$%^&*]/.test(newPass);
  const match = newPass === confirm && confirm !== "";

  const canSubmit =
    currentPassword &&
    hasMin &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    match;

  const handleChangePassword = async () => {
    if (!canSubmit) {
      setError("Please fill all requirements");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Changing password (OTP already verified)...");

      // OTP was already verified in the OTPModal
      // Now just change the password
      const result = await authService.changePassword(
        currentPassword,
        newPass,
        confirm,
        token
      );

      console.log("✅ Password changed successfully:", result);

      // Show success toast
      showToast("Password changed successfully! ✓", "success");

      // Close after toast animation
      setTimeout(() => onClose(), 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      console.error("Password change error:", errorMessage);

      // Show error toast
      showToast(`Password change failed: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-dm-sans font-bold text-2xl text-[#171417]">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={28} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2">
              Current Password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-10"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2">
              New Password
            </label>
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-10"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block font-dm-sans font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-10"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Validation */}
          <div className="flex flex-wrap gap-2">
            {[
              { valid: hasMin, text: "8+ characters" },
              { valid: hasUpper, text: "Uppercase" },
              { valid: hasLower, text: "Lowercase" },
              { valid: hasNumber, text: "Number" },
              { valid: hasSpecial, text: "Special char" },
              { valid: match, text: "Passwords match" },
            ].map((item) => (
              <div
                key={item.text}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  item.valid
                    ? "bg-[#154751] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Check size={14} />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={!canSubmit || loading}
          className="w-full h-12 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background:
              canSubmit && !loading
                ? "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                : "#ACC5CF",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Changing Password...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================
const SettingsPage = () => {
  const { data: session, status } = useSession();
  const {
    profile,
    loading,
    error,
    updating,
    updateError,
    uploadingImage,
    uploadError,
    fetchProfile,
    updateProfile,
    uploadProfilePicture,
    clearError,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Password flow
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

  // Toast management
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add toast notification
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Debug session info
  useEffect(() => {
    console.log("🔐 Session Status:", {
      status,
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      hasUserId: !!session?.user?.id,
      user: session?.user?.email,
      accessTokenLength: session?.accessToken
        ? session.accessToken.length
        : 0,
    });
  }, [session, status]);

  // Fetch profile on mount with better error handling
  useEffect(() => {
    if (status === "loading") {
      console.log("⏳ Session loading...");
      return;
    }

    if (status === "unauthenticated") {
      setSessionError("You are not authenticated. Please log in.");
      console.error("❌ User is not authenticated");
      return;
    }

    if (!session?.accessToken) {
      setSessionError("No access token found. Please log in again.");
      console.error("❌ Missing access token");
      return;
    }

    if (!session?.user?.id) {
      setSessionError("User ID not found. Please log in again.");
      console.error("❌ Missing user ID");
      return;
    }

    console.log("✅ Fetching profile with valid session");
    setSessionError(null);
    fetchProfile(session.user.id, session.accessToken);
  }, [session, status, fetchProfile]);

  // Update local state when profile is loaded or updated
  useEffect(() => {
    if (profile) {
      console.log("🔄 Syncing local state with updated profile");
      setFullName(profile.fullName);
      setEmail(profile.email);
      console.log("✅ Local state synced:", {
        fullName: profile.fullName,
        email: profile.email,
      });
    }
  }, [profile]);

  // Request OTP for password reset
  const startPasswordChange = async () => {
    if (!session?.accessToken || !email) {
      alert("Please log in to change password");
      return;
    }

    setIsRequestingOTP(true);
    setOtpError(null);

    try {
      console.log("📧 Requesting OTP for password change...");
      await authService.requestPasswordResetOTP(email, session.accessToken);
      console.log("✅ OTP requested successfully");
      setShowOtpModal(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request OTP";
      setOtpError(errorMessage);
      console.error("OTP request error:", errorMessage);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  // Verify OTP and open password change modal
  const verifyOtp = () => {
    console.log("✅ OTP verified in modal, opening password change modal");
    setShowOtpModal(false);
    setShowPasswordModal(true);
  };

  const handleSaveChanges = async () => {
    if (!session?.accessToken) {
      alert("You must be logged in to update your profile");
      return;
    }

    if (!fullName || !fullName.trim()) {
      alert("Full name cannot be empty");
      return;
    }

    if (!email || !email.trim()) {
      alert("Email is required");
      return;
    }

    const success = await updateProfile(
      {
        fullName: fullName.trim(),
        email: email.trim(),
      },
      session.accessToken
    );

    if (success) {
      // Refresh the full profile to get all updated data including picture
      console.log("🔄 Refreshing full profile after update...");
      await fetchProfile(session.user.id, session.accessToken);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(updateError || "Failed to update profile");
    }
  };

  // Get role name from profile
  const getRoleName = () => {
    if (!profile?.userRoles || profile.userRoles.length === 0) return "Admin";
    return profile.userRoles[0].role.name.replace("_", " ");
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 2MB - will be larger after base64 encoding)
    // We compress it, but base64 is still larger than binary
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB. The image will be automatically compressed.");
      return;
    }

    if (!session?.accessToken) {
      alert("You must be logged in to upload profile picture");
      return;
    }

    if (!email || !email.trim()) {
      alert("Email is required for profile picture upload");
      return;
    }

    const imageUrl = await uploadProfilePicture(
      file,
      session.accessToken,
      email
    );
    if (imageUrl) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert(uploadError || "Failed to upload profile picture");
    }
  };

  // Trigger file input click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Show loading state while session is being checked
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="font-bold text-red-700">
              Authentication Required
            </h2>
          </div>
          <p className="text-red-600 text-sm">
            Please log in to access your settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* DESKTOP */}
        <div className="hidden md:block w-full max-w-[1200px] mx-auto px-6 py-8">
          <div className="bg-white rounded-[32px] p-10">
            <div className="mb-8">
              <h1 className="font-dm-sans font-bold text-2xl text-[#171417] mb-2">
                Settings
              </h1>
              <p className="font-dm-sans text-base text-[#6B6969]">
                Assign and manage what each admin can access, view, and
                control.
              </p>
            </div>

            {/* Session Error Alert */}
            {sessionError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700 text-sm">{sessionError}</p>
              </div>
            )}

            <div className="flex gap-16">
              <div className="w-[140px] flex-shrink-0 space-y-5">
                {["account", "notifications", "subscription", "ads", "charges"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left font-dm-sans text-base capitalize transition-colors ${
                        activeTab === tab
                          ? "font-medium bg-gradient-to-br from-[#154751] to-[#04171F] bg-clip-text text-transparent"
                          : "text-[#B5B1B1]"
                      }`}
                    >
                      {tab === "account"
                        ? "My account"
                        : tab === "ads"
                        ? "Sponsor ads"
                        : tab === "charges"
                        ? "Platform charges"
                        : tab}
                    </button>
                  )
                )}
              </div>

              <div className="flex-1 min-w-0 overflow-x-hidden">
                {activeTab === "account" && (
                  <div className="space-y-12">
                    {/* Loading State */}
                    {loading && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
                      </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Success Message */}
                    {showSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <Check className="text-green-500" size={20} />
                        <p className="text-green-700 text-sm">
                          Profile updated successfully!
                        </p>
                      </div>
                    )}

                    {/* Profile Content */}
                    {!loading && profile && (
                      <>
                        <div className="text-center">
                          <div className="relative inline-block">
                            {uploadingImage && (
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 animate-spin text-white" />
                              </div>
                            )}
                            {profile.profilePicture ? (
                              <img
                                src={profile.profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                                <User size={48} className="text-white" />
                              </div>
                            )}
                            <button
                              onClick={handleCameraClick}
                              disabled={uploadingImage}
                              className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              <Camera size={18} className="text-[#154751]" />
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              className="hidden"
                            />
                          </div>
                          <h2 className="mt-4 font-dm-sans font-bold text-2xl">
                            {profile.fullName}
                          </h2>
                          <p className="text-[#6B6969]">{getRoleName()}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block font-dm-sans font-medium mb-2 text-left">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={fullName || ""}
                                onChange={(e) =>
                                  setFullName(e.target.value)
                                }
                                className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                                disabled={updating}
                              />
                            </div>
                            <div>
                              <label className="block font-dm-sans font-medium mb-2 text-left">
                                Email
                              </label>
                              <input
                                type="email"
                                value={email || ""}
                                disabled
                                className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Update Error */}
                          {updateError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                              <AlertCircle
                                className="text-red-500"
                                size={18}
                              />
                              <p className="text-red-700 text-sm">
                                {updateError}
                              </p>
                            </div>
                          )}

                          {/* Upload Error */}
                          {uploadError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                              <AlertCircle
                                className="text-red-500"
                                size={18}
                              />
                              <p className="text-red-700 text-sm">
                                {uploadError}
                              </p>
                            </div>
                          )}

                          {/* Save Changes Button */}
                          <button
                            onClick={handleSaveChanges}
                            disabled={
                              updating ||
                              !fullName ||
                              !fullName.trim() ||
                              !email ||
                              !email.trim()
                            }
                            className="px-8 py-3 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            style={{
                              background:
                                "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                            }}
                          >
                            {updating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>

                        {/* Password Section */}
                        <div className="pt-8 border-t border-[#E3E5E5]">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-dm-sans font-bold text-xl text-[#171417]">
                                Password
                              </h3>
                              <p className="font-dm-sans text-base text-[#6B6969]">
                                Keep your account secure
                              </p>
                            </div>
                            <button
                              onClick={startPasswordChange}
                              disabled={isRequestingOTP}
                              className="px-6 py-3 rounded-2xl text-white font-dm-sans font-medium disabled:opacity-50 flex items-center gap-2"
                              style={{
                                background:
                                  "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                              }}
                            >
                              {isRequestingOTP ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Requesting OTP...
                                </>
                              ) : (
                                "Change Password"
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "notifications" && <NotificationTab />}
                {activeTab === "subscription" && (
                  <SubscriptionDashboard />
                )}
                {activeTab === "ads" && <SponsorAdsDashboard />}
                {activeTab === "charges" && <PlatformChargesDashboard />}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-5 py-4">
            <h1 className="font-dm-sans font-bold text-xl text-[#171417]">
              Settings
            </h1>
          </div>

          {/* Session Error Alert */}
          {sessionError && (
            <div className="mx-5 mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 text-sm">{sessionError}</p>
            </div>
          )}

          <div className="px-5 py-4 space-y-3 bg-white">
            {["account", "notifications", "subscription", "ads", "charges"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#154751] to-[#04171F] text-white shadow-lg"
                      : "bg-gray-100 text-[#171417]"
                  }`}
                >
                  {tab === "account"
                    ? "My Account"
                    : tab === "ads"
                    ? "Sponsor ads"
                    : tab === "charges"
                    ? "Platform charges"
                    : tab}
                </button>
              )
            )}
          </div>

          <div className="bg-gray-50 min-h-screen">
            {activeTab === "account" && (
              <div className="bg-white px-5 py-8 space-y-8">
                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#154751]" />
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <Check className="text-green-500" size={20} />
                    <p className="text-green-700 text-sm">
                      Profile updated successfully!
                    </p>
                  </div>
                )}

                {/* Profile Content */}
                {!loading && profile && (
                  <>
                    <div className="text-center">
                      <div className="relative inline-block">
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                          </div>
                        )}
                        {profile.profilePicture ? (
                          <img
                            src={profile.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                            <User size={48} className="text-white" />
                          </div>
                        )}
                        <button
                          onClick={handleCameraClick}
                          disabled={uploadingImage}
                          className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Camera
                            size={18}
                            className="text-[#154751]"
                          />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={
                            handleProfilePictureChange
                          }
                          className="hidden"
                        />
                      </div>
                      <h2 className="mt-4 font-dm-sans font-bold text-xl">
                        {profile.fullName}
                      </h2>
                      <p className="text-[#6B6969] text-sm">
                        {getRoleName()}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block font-dm-sans font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName || ""}
                          onChange={(e) =>
                            setFullName(e.target.value)
                          }
                          className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                          disabled={updating}
                        />
                      </div>
                      <div>
                        <label className="block font-dm-sans font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email || ""}
                          disabled
                          className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                        />
                      </div>

                      {/* Update Error */}
                      {updateError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                          <AlertCircle
                            className="text-red-500"
                            size={18}
                          />
                          <p className="text-red-700 text-sm">
                            {updateError}
                          </p>
                        </div>
                      )}

                      {/* Upload Error */}
                      {uploadError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                          <AlertCircle
                            className="text-red-500"
                            size={18}
                          />
                          <p className="text-red-700 text-sm">
                            {uploadError}
                          </p>
                        </div>
                      )}

                      {/* Save Changes Button - Mobile */}
                      <button
                        onClick={handleSaveChanges}
                        disabled={
                          updating ||
                          !fullName ||
                          !fullName.trim() ||
                          !email ||
                          !email.trim()
                        }
                        className="w-full h-12 rounded-[20px] text-white font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                          background:
                            "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                        }}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>

                      {/* Mobile Password Button */}
                      <button
                        onClick={startPasswordChange}
                        disabled={isRequestingOTP}
                        className="w-full h-12 rounded-[20px] text-white font-dm-sans font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{
                          background:
                            "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
                        }}
                      >
                        {isRequestingOTP ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Requesting OTP...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "notifications" && <NotificationTab />}
            {activeTab === "subscription" && (
              <SubscriptionDashboard />
            )}
            {activeTab === "ads" && <SponsorAdsDashboard />}
            {activeTab === "charges" && <PlatformChargesDashboard />}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOtpModal && (
        <OTPModal
          onClose={() => setShowOtpModal(false)}
          onOTPReceived={verifyOtp}
          email={email}
          isLoading={isRequestingOTP}
          error={otpError}
          token={session?.accessToken || ""}
          showToast={showToast}
        />
      )}
      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => {
            setShowPasswordModal(false);
            setShowOtpModal(false);
          }}
          email={email}
          token={session?.accessToken || ""}
          showToast={showToast}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default SettingsPage;