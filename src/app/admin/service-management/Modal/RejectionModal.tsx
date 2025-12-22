// components/Modal/RejectionModal.tsx
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { BulkOperationError } from "@/services/serviceManagement";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  serviceName: string;
  providerName: string;
  isBulk?: boolean;
  bulkCount?: number;
  onError?: (error: string, details?: string) => void;
}

export default function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  providerName,
  isBulk = false,
  bulkCount = 0,
  onError,
}: RejectionModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onConfirm(reason.trim());
      // Only close and reset if successful
      setReason("");
      setIsSubmitting(false);
    } catch (error) {
      // Always handle errors here, don't re-throw
      let displayError = "An error occurred. Please try again.";
      let errorDetails = "";

      if (error instanceof BulkOperationError) {
        // Handle bulk operation partial failure
        const { result } = error;
        displayError = error.message;
        errorDetails = `${result.summary.successCount}/${result.summary.total} services rejected. Failures: ${result.failed.map(f => `${f.id}: ${f.error}`).join("; ")}`;
      } else if (error instanceof Error) {
        // Handle regular errors - show the actual backend error
        displayError = error.message;
      }

      setErrorMessage(displayError);
      setIsSubmitting(false);
      
      if (onError) {
        onError(displayError, errorDetails);
      }

      // console.error("❌ Error during rejection:", error);
      // Don't re-throw - stay in the modal so user can see the error
    }
  };

  const handleClose = () => {
    setReason("");
    setErrorMessage(null);
    onClose();
  };

  const buttonText = isBulk ? `Reject All (${bulkCount})` : "Reject Service";
  const title = isBulk ? "Reject Multiple Services" : "Reject Service Suggestion";
  const description = isBulk
    ? `Are you sure you want to reject these ${bulkCount} services?`
    : `Are you sure you want to reject the service "${serviceName}" submitted by ${providerName}?`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[633px] bg-white rounded-lg border border-[#EBEBEB] shadow-[0px_20px_20px_0px_rgba(0,0,0,0.08),_0px_0px_2px_0px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block p-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#FFD5D0] p-2 flex items-center justify-center">
                  <X className="w-8 h-8 text-[#D84040]" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                  {title}
                </h2>
                <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                  {description}
                </p>
                <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                  You can optionally add a reason for this rejection.
                </p>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="bg-[#FEE] border border-[#D84040] rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#D84040] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#D84040] font-['DM_Sans']">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#05060D] font-['DM_Sans']">
                Reason for rejection (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type your message here"
                rows={4}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-base text-[#171417] placeholder:text-[#B2B2B4] bg-white border border-[#B2B2B4] rounded-xl focus:outline-none focus:border-[#154751] resize-none font-['DM_Sans'] disabled:opacity-50"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-8">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-[20px] bg-white text-[#154751] font-medium text-base font-['DM_Sans'] hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed border border-[#154751]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-[20px] bg-[#D84040] text-white font-medium text-base font-['DM_Sans'] hover:bg-[#c73838] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Rejecting..." : buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden px-5 pt-6 pb-8">
          <div className="flex flex-col gap-6">
            {/* Centered Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FFD5D0] p-2 flex items-center justify-center">
                <X className="w-8 h-8 text-[#D84040]" strokeWidth={3} />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                {title}
              </h2>
              <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                {description}
              </p>
              <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                You can optionally add a reason for this rejection.
              </p>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="bg-[#FEE] border border-[#D84040] rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#D84040] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#D84040] font-['DM_Sans']">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div className="space-y-2">
              <label className="text-base font-medium text-[#05060D] font-['DM_Sans']">
                Reason for rejection (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type your message here"
                rows={4}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-base text-[#171417] placeholder:text-[#B2B2B4] bg-white border border-[#B2B2B4] rounded-xl focus:outline-none focus:border-[#154751] resize-none font-['DM_Sans'] disabled:opacity-50"
              />
            </div>

            {/* Buttons - Stacked, Reject first */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full h-12 rounded-[20px] bg-[#D84040] text-white font-medium text-base font-['DM_Sans'] hover:bg-[#c73838] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Rejecting..." : buttonText}
              </button>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full h-12 rounded-[20px] bg-white text-[#154751] font-medium text-base font-['DM_Sans'] hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed border border-[#154751]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}