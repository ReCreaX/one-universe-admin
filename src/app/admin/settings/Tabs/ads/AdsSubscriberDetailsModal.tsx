"use client";

import React from "react";
import { X, User, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface AdsSubscriberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: {
    id: string;
    sellerName: string;
    businessName: string;
    email: string;
    phone: string;
    planType: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Expired" | "Suspended";
    payments: Array<{
      date: string;
      amount: string;
      status: "Paid" | "Failed";
      transactionId: string;
    }>;
  };
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
      There are no ad payment records for this subscriber yet.
    </p>
  </div>
);

const AdsSubscriberDetailsModal: React.FC<AdsSubscriberDetailsModalProps> = ({
  isOpen,
  onClose,
  subscriber,
}) => {
  if (!isOpen) return null;

  const payments = subscriber.payments || [
    {
      date: "01/06/2025",
      amount: "₦15,000",
      status: "Paid" as const,
      transactionId: "TXN8877665544",
    },
    {
      date: "01/05/2025",
      amount: "₦15,000",
      status: "Failed" as const,
      transactionId: "TXN1122334455",
    },
    {
      date: "01/04/2025",
      amount: "₦15,000",
      status: "Paid" as const,
      transactionId: "TXN9988776655",
    },
  ];

  const getStatusBadge = (status: "Paid" | "Failed") => {
    if (status === "Paid") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F5E6] text-[#1FC16B] rounded-lg text-sm font-medium">
          <div className="w-4 h-4 rounded-full bg-[#1FC16B]" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE6E6] text-[#D84040] rounded-lg text-sm font-medium">
        <XCircle className="w-4 h-4" />
        Failed
      </span>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-6 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[390px] md:max-w-[841px] mx-auto">
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 md:px-8 py-5 md:py-6 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-dm-sans font-bold text-xl md:text-2xl text-[#171417]">
              Ads Subscriber Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-lg transition-colors ml-auto"
            >
              <X size={28} className="text-[#171417]" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* User + Ads Details */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                {/* Desktop Vertical Divider */}
                <div className="hidden md:block absolute inset-y-12 left-1/2 w-px bg-[#E8E3E3] -translate-x-1/2" />

                {/* Left: User Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#646264]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      Subscriber Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Name</span>
                      <span className="font-dm-sans font-medium text-base text-[#454345]">
                        {subscriber.sellerName}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Business Name</span>
                      <span className="font-dm-sans text-base text-[#454345]">
                        {subscriber.businessName}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Email</span>
                      <span className="font-dm-sans text-base text-[#454345] break-all">
                        {subscriber.email}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Phone</span>
                      <span className="font-dm-sans text-base text-[#454345]">{subscriber.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Ads Plan Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#646264]" />
                    <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                      Ads Plan Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Plan Type</span>
                      <span className="font-dm-sans text-base text-[#454345]">{subscriber.planType}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Start Date</span>
                      <span className="font-dm-sans text-base text-[#454345]">{subscriber.startDate}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">End Date</span>
                      <span className="font-dm-sans text-base text-[#454345]">{subscriber.endDate}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">Status</span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                        subscriber.status === "Active"
                          ? "bg-[#E0F5E6] text-[#1FC16B]"
                          : subscriber.status === "Expired"
                          ? "bg-[#FFE6E6] text-[#D84040]"
                          : "bg-[#FFF2B9] text-[#B76E00]"
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-current" />
                        {subscriber.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider - Mobile Only */}
              <div className="md:hidden -mx-6 h-px bg-[#E8E3E3]" />

              {/* Send Reminder Button */}
              <div className="flex justify-center md:justify-end">
                <button className="px-8 py-3 bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base rounded-full hover:shadow-xl transition-all active:scale-95">
                  Send Reminder
                </button>
              </div>
            </div>

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
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">Date</th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">Amount</th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">Status</th>
                        <th className="text-left py-3 px-6 font-dm-sans font-medium text-base text-[#646264]">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, i) => (
                        <tr key={i} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#FAFAFA]">
                          <td className="py-4 px-6 font-inter text-base text-[#303237]">{payment.date}</td>
                          <td className="py-4 px-6 font-inter text-base text-[#303237]">{payment.amount}</td>
                          <td className="py-4 px-6">{getStatusBadge(payment.status)}</td>
                          <td className="py-4 px-6 font-inter text-[#303237] break-all">
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

export default AdsSubscriberDetailsModal;