"use client";

import React, { useState } from "react";
import { X, User, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    id: string;
    userId?: string;
    sellerName: string;
    email: string;
    phone: string;
    planType: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Expired" | "Suspended";
    paymentStatus: "Paid" | "Pending";
    payments: Array<{
      date: string;
      amount: string;
      status: "Paid" | "Pending";
      transactionId: string;
    }>;
  } | null;
  onReminderSent?: () => void;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-40 h-40 mb-6">
      <Image
        src="/empty/no-result.png"
        alt="No payment history"
        width={160}
        height={160}
        className="object-contain"
        priority
      />
    </div>
    <h3 className="font-dm-sans font-bold text-lg text-[#171417] mb-2">
      No Payment History
    </h3>
    <p className="font-dm-sans text-sm text-[#6B6969] max-w-[280px]">
      There are no payment records for this subscription yet.
    </p>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-[#E0F5E6] text-[#1FC16B]";
    case "Expired":
      return "bg-[#FFE6E6] text-[#D84040]";
    case "Suspended":
      return "bg-[#FFF2B9] text-[#B76E00]";
    default:
      return "bg-[#E0F5E6] text-[#1FC16B]";
  }
};

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onReminderSent,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !subscription) return null;

  const payments = subscription.payments || [];

  const handleSendReminder = async () => {
    if (!subscription.userId) {
      setError("User ID not found");
      return;
    }

    if (!session?.accessToken) {
      setError("You are not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://one-universe-de5673cf0d65.herokuapp.com/api/v1/subscription/${subscription.userId}/notify-expired`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reminder");
      }

      const data = await response.json();
      console.log("✅ Reminder sent successfully:", data);

      setSuccess(true);
      onReminderSent?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reminder";
      setError(errorMessage);
      console.error("❌ Error sending reminder:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-6 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[390px] md:max-w-[841px] mx-auto">
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 md:px-8 py-5 md:py-6 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-dm-sans font-bold text-xl md:text-2xl text-[#171417]">
              Subscription Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={28} className="text-[#171417]" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* User Information + Subscription Details */}
            <div className="space-y-8">
              {/* Mobile: Stacked with horizontal divider | Desktop: Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                {/* Desktop Vertical Divider */}
                <div className="hidden md:block absolute inset-y-12 left-1/2 w-px bg-[#E8E3E3] -translate-x-1/2" />

                {/* User Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#646264]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      User Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Name
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-dm-sans font-medium text-base text-[#454345]">
                          {subscription.sellerName}
                        </span>
                        <span className="px-3 py-1 bg-[#1DD2AE] text-[#171417] text-sm rounded-lg font-dm-sans font-medium">
                          Seller
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Email Address
                      </span>
                      <span className="font-dm-sans text-base text-[#454345] break-all">
                        {subscription.email}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Phone Number
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {subscription.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#646264]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      Subscription Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Plan Type
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {subscription.planType}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Start Date
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {subscription.startDate}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        End Date
                      </span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {subscription.endDate}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Payment Status
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F5E6] text-[#1FC16B] rounded-lg text-sm font-dm-sans font-medium">
                        <div className="w-4 h-4 rounded-full bg-[#1FC16B]" />
                        {subscription.paymentStatus}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-dm-sans font-medium ${getStatusColor(
                          subscription.status
                        )}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-current" />
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider - Mobile Only */}
              <div className="md:hidden -mx-6 h-px bg-[#E8E3E3]" />

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-700 text-sm font-dm-sans">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <p className="text-green-700 text-sm font-dm-sans">Reminder sent successfully!</p>
                </div>
              )}

              {/* Send Reminder Button */}
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={handleSendReminder}
                  disabled={loading}
                  className={`px-8 py-3 text-white font-dm-sans font-medium text-base rounded-full hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                    loading ? "opacity-75" : ""
                  }`}
                  style={{
                    background: loading
                      ? "linear-gradient(0deg, #ACC5CF, #ACC5CF)"
                      : "linear-gradient(to right, #154751, #04171F)",
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending..." : "Send Reminder"}
                </button>
              </div>
            </div>

            {/* Divider Line */}
            <hr className="border-t border-[#E8E3E3] -mx-6 md:mx-0" />

            {/* Payment History */}
            <div>
              <h3 className="font-dm-sans font-bold text-base text-[#646264] mb-5 flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                Payment History
              </h3>

              {payments.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-x-auto -mx-6 md:mx-0 rounded-lg border border-[#E8E3E3]">
                  <table className="w-full min-w-[640px] md:min-w-0">
                    <thead>
                      <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">
                          Date
                        </th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">
                          Amount
                        </th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">
                          Status
                        </th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">
                          Transaction ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#FAFAFA]"
                        >
                          <td className="py-4 px-6 font-inter text-base text-[#303237]">
                            {payment.date}
                          </td>
                          <td className="py-4 px-6 font-inter text-base text-[#303237]">
                            {payment.amount}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F5E6] text-[#1FC16B] rounded-lg text-sm font-dm-sans font-medium">
                              <div className="w-4 h-4 rounded-full bg-[#1FC16B]" />
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-inter text-base text-[#303237] break-all">
                            {payment.transactionId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetailsModal;