import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Referral } from "@/types/Referral";
import MarkIneligibleModal from "./IneligibleRewardModal";
import MarkAsPaidModal from "./MarkAsPaidModal";
import { referralService } from "@/services/referralService";

interface ResolveRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
  onActionComplete?: () => void;
}

const ResolveRewardModal: React.FC<ResolveRewardModalProps> = ({
  isOpen,
  onClose,
  referral,
  onActionComplete,
}) => {
  const [showIneligibleModal, setShowIneligibleModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateError, setRecalculateError] = useState<string | null>(null);
  const [recalculateSuccess, setRecalculateSuccess] = useState(false);

  const handleRecalculateAndRetry = async () => {
    setIsRecalculating(true);
    setRecalculateError(null);
    setRecalculateSuccess(false);

    try {
      console.log("Recalculating and retrying payout...");
      await referralService.recalculateAndRetry(referral.id);
      
      console.log("✅ Successfully recalculated and retried");
      setRecalculateSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        if (onActionComplete) onActionComplete();
      }, 2000);
    } catch (err: any) {
      console.error("❌ Failed to recalculate:", err);
      setRecalculateError(err.message || "Failed to recalculate and retry payout");
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleMarkAsPaidComplete = () => {
    console.log("Marked as paid successfully");
    onClose();
    if (onActionComplete) onActionComplete();
  };

  const handleMarkAsIneligibleComplete = () => {
    console.log("Marked as ineligible successfully");
    onClose();
    if (onActionComplete) onActionComplete();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Detail Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center pt-20 md:pt-32 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden mb-4"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/30 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Resolve Reward Issue
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-lg transition"
            >
              <X className="w-6 h-6 text-[#171417]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8 flex flex-col gap-6">
            {/* Success Alert */}
            {recalculateSuccess && (
              <div className="bg-[#E0F5E6] border border-[#1FC16B] rounded-lg px-4 py-3">
                <p className="font-dm-sans text-base text-[#1FC16B]">
                  ✅ Payout recalculated and retry initiated successfully
                </p>
              </div>
            )}

            {/* Error Alert */}
            {recalculateError && (
              <div className="bg-[#FFE5E5] border border-[#FFB3B3] rounded-lg px-4 py-3">
                <p className="font-dm-sans text-base text-[#D84040]">
                  {recalculateError}
                </p>
              </div>
            )}

            {/* Details Section */}
            <div className="space-y-5">
              {/* Referral Name */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referral Name
                </span>
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  {referral.referrerName}
                </span>
              </div>

              {/* Referred Name */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referred Name
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  {referral.referredName}
                </span>
              </div>

              {/* Referral ID */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referral ID
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  {referral.referralId}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Status
                </span>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                    referral.status === "Paid"
                      ? "bg-[#E0F5E6]"
                      : referral.status === "Pending"
                        ? "bg-[#FFF2B9]"
                        : "bg-[#D3E1FF]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      referral.status === "Paid"
                        ? "bg-[#1FC16B]"
                        : referral.status === "Pending"
                          ? "bg-[#9D7F04]"
                          : "bg-[#007BFF]"
                    }`}
                  />
                  <span
                    className={`font-dm-sans font-medium text-sm ${
                      referral.status === "Paid"
                        ? "text-[#1FC16B]"
                        : referral.status === "Pending"
                          ? "text-[#9D7F04]"
                          : "text-[#007BFF]"
                    }`}
                  >
                    {referral.status}
                  </span>
                </div>
              </div>

              {/* Reward Amount */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Amount
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  ₦{(referral.rewardAmount || 0).toLocaleString()}
                </span>
              </div>

              {/* Sign Up Date */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Sign Up Date
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  {referral.signDate}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#B5B1B1]" />

            {/* Actions Section */}
            <div className="space-y-4">
              <p className="font-dm-sans font-regular text-base text-[#454345]">
                Choose an action to resolve this referral reward issue:
              </p>

              <div className="space-y-5">
                {/* Mark as Paid Button */}
                <button
                  onClick={() => setShowPaidModal(true)}
                  disabled={isRecalculating}
                  className="w-full px-6 py-4 rounded-full text-white font-dm-sans font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  }}
                >
                  Mark as Paid
                </button>

                {/* Recalculate and Retry Payout Button */}
                <button
                  onClick={handleRecalculateAndRetry}
                  disabled={isRecalculating}
                  className="w-full px-6 py-4 rounded-full font-dm-sans font-medium text-base border transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderImage:
                      "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%) 1",
                    color: "#154751",
                  }}
                >
                  {isRecalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#154751] border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Recalculate and Retry Payout"
                  )}
                </button>

                {/* Mark as Ineligible Button */}
                <button
                  onClick={() => setShowIneligibleModal(true)}
                  disabled={isRecalculating}
                  className="w-full px-6 py-4 rounded-full bg-[#D84040] text-white font-dm-sans font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Ineligible
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark as Paid Modal */}
      <MarkAsPaidModal
        isOpen={showPaidModal}
        onClose={() => setShowPaidModal(false)}
        referralId={referral.id}
        onConfirm={handleMarkAsPaidComplete}
      />

      {/* Mark as Ineligible Modal */}
      <MarkIneligibleModal
        isOpen={showIneligibleModal}
        onClose={() => setShowIneligibleModal(false)}
        referralId={referral.id}
        onConfirm={handleMarkAsIneligibleComplete}
      />
    </>
  );
};

export default ResolveRewardModal;