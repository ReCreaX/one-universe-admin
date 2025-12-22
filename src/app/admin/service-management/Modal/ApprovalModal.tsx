// components/Modal/ApprovalModal.tsx
import React, { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { BulkOperationError } from "@/services/serviceManagement";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  providerName: string;
  isBulk?: boolean;
  bulkCount?: number;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  providerName,
  isBulk = false,
  bulkCount = 0,
  isLoading = false,
  onError,
}: ApprovalModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLocalLoading(true);
    setErrorMessage(null);
    try {
      await onConfirm();
      // Only close and reset if successful
      setIsLocalLoading(false);
    } catch (error) {
      // Always handle errors here, don't re-throw
      let displayError = "An error occurred. Please try again.";

      if (error instanceof BulkOperationError) {
        // Handle bulk operation partial failure
        displayError = error.message;
      } else if (error instanceof Error) {
        // Handle regular errors - show the actual backend error
        displayError = error.message;
      }

      setErrorMessage(displayError);
      setIsLocalLoading(false);
      
      if (onError) {
        onError(displayError);
      }

      // console.error("❌ Error during approval:", error);
      // Don't re-throw - stay in the modal so user can see the error
    }
  };

  const isProcessing = isLoading || isLocalLoading;
  const buttonText = isBulk ? `Approve All (${bulkCount})` : "Approve Service";
  const title = isBulk ? "Approve Multiple Services" : "Approve Service Suggestion";
  const description = isBulk
    ? `Are you sure you want to approve these ${bulkCount} services?`
    : `Are you sure you want to approve the service "${serviceName}" submitted by ${providerName}?`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[633px] bg-white rounded-lg border border-[#EBEBEB] shadow-[0px_20px_20px_0px_rgba(0,0,0,0.08),_0px_0px_2px_0px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block p-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex gap-2 items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#C0F8DA] flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#1FC16B]" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                  {title}
                </h2>
                <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                  {description}
                </p>
                <div className="flex gap-2 items-start mt-2">
                  <AlertCircle className="w-5 h-5 text-[#BA8D07] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%]">
                    {isBulk
                      ? "These services will be added to the public services list and made available to all users."
                      : "This service will be added to the public services list and made available to all users."}
                  </p>
                </div>
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

            {/* Buttons */}
            <div className="flex gap-8">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 h-12 rounded-[20px] border border-[#154751] bg-white text-[#154751] font-medium font-['DM_Sans'] text-base leading-[140%] hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 h-12 rounded-[20px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium font-['DM_Sans'] text-base leading-[140%] hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                }}
              >
                {isProcessing ? "Approving..." : buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout (below md) */}
        <div className="md:hidden px-5 pt-6 pb-5">
          <div className="flex flex-col gap-6">
            {/* Centered Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#C0F8DA] p-2 flex items-center justify-center">
                <Check className="w-7 h-7 text-[#1FC16B]" strokeWidth={3} />
              </div>
            </div>

            {/* Text Content - Centered */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-[#171417] font-['DM_Sans'] leading-[140%]">
                {title}
              </h2>
              <p className="text-base text-[#171417] font-['DM_Sans'] leading-[140%]">
                {description}
              </p>
              <div className="flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-[#BA8D07] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#454345] font-['DM_Sans'] leading-[140%] text-left">
                  {isBulk
                    ? "These services will be added to the public services list and made available to all users."
                    : "This service will be added to the public services list and made available to all users."}
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

            {/* Buttons - Stacked, Approve first */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full h-12 rounded-[20px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium font-['DM_Sans'] text-base leading-[140%] hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                }}
              >
                {isProcessing ? "Approving..." : buttonText}
              </button>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full h-12 rounded-[20px] border border-[#154751] bg-white text-[#154751] font-medium font-['DM_Sans'] text-base leading-[140%] hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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