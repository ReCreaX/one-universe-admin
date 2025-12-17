import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { Referral } from "@/types/Referral";

interface ReferralDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

const ReferralDetailModal: React.FC<ReferralDetailModalProps> = ({
  isOpen,
  onClose,
  referral,
}) => {
  if (!isOpen) return null;

  // Timeline events based on referral data
  const timelineEvents = [
    {
      date: referral.signDate,
      event: "User signed up via referral link",
    },
    {
      date: referral.signDate,
      event: `First transaction status: ${referral.firstTransaction}`,
    },
    {
      date: referral.signDate,
      event: `Referral reward calculated: ₦${(referral.rewardAmount || 0).toLocaleString()}`,
    },
    {
      date: referral.signDate,
      event: referral.rewardEarned 
        ? "Reward credited to referrer's wallet" 
        : "Reward pending or not earned",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return { bg: "bg-[#E0F5E6]", text: "text-[#1FC16B]", dot: "bg-[#1FC16B]" };
      case "Pending":
        return { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]", dot: "bg-[#9D7F04]" };
      case "Processing":
        return { bg: "bg-[#D3E1FF]", text: "text-[#007BFF]", dot: "bg-[#007BFF]" };
      default:
        return { bg: "bg-[#F5F5F5]", text: "text-[#454345]", dot: "bg-[#454345]" };
    }
  };

  const statusColor = getStatusColor(referral.status);

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
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden mb-8"
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
                Referral Details
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
            {/* Details Section */}
            <div className="space-y-5">
              {/* Referral ID */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Referral ID
                </span>
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  {referral.referralId}
                </span>
              </div>

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

              {/* First Transaction */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  First Transaction
                </span>
                <div className={`inline-flex items-center px-3 py-1 rounded-lg ${
                  referral.firstTransaction === "Completed"
                    ? "bg-[#E0F5E6] text-[#1FC16B]"
                    : "bg-[#FFF2B9] text-[#9D7F04]"
                }`}>
                  <span className="font-dm-sans text-sm font-medium">{referral.firstTransaction}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Status
                </span>
                <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${statusColor.bg}`}>
                  <div className={`w-4 h-4 rounded-full ${statusColor.dot}`} />
                  <span className={`font-dm-sans font-medium text-sm ${statusColor.text}`}>
                    {referral.status}
                  </span>
                </div>
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

              {/* Reward Earned */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Earned
                </span>
                <div className="flex items-center gap-1">
                  {referral.rewardEarned ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1FC16B]">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L5.5 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/>
                      </svg>
                      <span className="font-dm-sans text-sm font-medium text-[#1FC16B]">Yes</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D84040]">
                        <path d="M12.22 3.78a.75.75 0 010 1.06L9.06 8l3.16 3.16a.75.75 0 11-1.06 1.06L8 9.06l-3.16 3.16a.75.75 0 11-1.06-1.06L6.94 8 3.78 4.84a.75.75 0 111.06-1.06L8 6.94l3.16-3.16a.75.75 0 011.06 0z" fill="currentColor"/>
                      </svg>
                      <span className="font-dm-sans text-sm font-medium text-[#D84040]">No</span>
                    </>
                  )}
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

              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417]">
                  Payment Method
                </span>
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  Wallet Credit
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#B5B1B1]" />

            {/* Timeline Section */}
            <div className="space-y-4">
              <h3 className="font-dm-sans font-medium text-base text-[#171417]">
                Referral Timeline
              </h3>

              <div className="space-y-3">
                {timelineEvents.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#FFFCFC] rounded-xl p-4 border border-[#E8E3E3]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-dm-sans font-medium text-sm text-[#171417] whitespace-nowrap">
                        {item.date}:
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {item.event}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralDetailModal;