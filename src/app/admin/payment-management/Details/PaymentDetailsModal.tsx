"use client";

import { X } from "lucide-react";
import { User, Mail, Phone, Calendar, Briefcase, MapPin, Building } from "lucide-react";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
    serviceTitle: string;
    buyer: { name: string; email: string; phone: string };
    seller: { name: string; email: string; phone: string };
    amount: string;
    status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED" | "FAILED";
    bookingId: string;
    bookingStatus: "Cancelled" | "Completed" | "In Progress";
    jobStatus: "Pending" | "In Progress" | "Completed" | "Cancelled";
    businessName: string;
    services: string;
    location: string;
    date: string;
  };
}

const statusConfig = {
  PAID: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]", label: "Paid" },
  PENDING: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]", label: "Pending" },
  DISPUTED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Disputed" },
  "PENDING REFUND": { bg: "bg-[#E5E5FF]", text: "text-[#6366F1]", label: "Refund Pending" },
  REFUNDED: { bg: "bg-[#E0E0E0]", text: "text-[#525252]", label: "Refunded" },
  FAILED: { bg: "bg-[#FDEDED]", text: "text-[#D00416]", label: "Failed" },
};

const badgeConfig = {
  Cancelled: { bg: "bg-[#FFF2B9]", text: "text-[#9D7F04]" },
  Completed: { bg: "bg-[#D7FFE9]", text: "text-[#1FC16B]" },
  "In Progress": { bg: "bg-[#E5F3FF]", text: "text-[#0066CC]" },
  Pending: { bg: "bg-[#FFF4D6]", text: "text-[#F59E0B]" },
};

export default function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
}: PaymentDetailsModalProps) {
  if (!isOpen) return null;

  const statusStyle = statusConfig[payment.status];
  const bookingBadge = badgeConfig[payment.bookingStatus];
  const jobBadge = badgeConfig[payment.jobStatus as keyof typeof badgeConfig] || badgeConfig.Pending;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Centered, Fixed Size */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-[775px] h-[660px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Green Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 pt-8 pb-4 flex justify-between items-center">
            <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition"
            >
              <X size={24} className="text-[#171417]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Buyer & Seller Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buyer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#454345]" />
                  <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                    Buyer Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-8">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Name</p>
                    <p className="font-dm-sans font-medium text-base text-[#171417]">
                      {payment.buyer.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Email Address</p>
                    <Mail size={20} className="text-[#454345]" />
                    <p className="text-base text-[#454345]">{payment.buyer.email}</p>
                  </div>
                </div>
              </div>

              {/* Seller */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#454345]" />
                  <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                    Seller Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-8">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Name</p>
                    <p className="font-dm-sans font-medium text-base text-[#454345]">
                      {payment.seller.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-dm-sans font-medium text-base text-[#171417] w-16">Email Address</p>
                    <Mail size={20} className="text-[#454345]" />
                    <p className="text-base text-[#454345]">{payment.seller.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4 px-6">
              <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-[#454345]" />
                <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                  Job Details
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Booking ID</p>
                  <p className="font-dm-sans font-medium text-base text-[#171417]">{payment.bookingId}</p>
                </div>
                
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Booking Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${bookingBadge.bg} ${bookingBadge.text}`}
                  >
                    {payment.bookingStatus}
                  </span>
                </div>

                <div>
                  <p className="font-dm-sans font-normal text-base text-[#454345]">
                    <span className="font-medium text-[#171417]">Business Name:</span> {payment.businessName}, <span className="font-medium text-[#171417]">Services:</span> {payment.services}, <span className="font-medium text-[#171417]">Location:</span> {payment.location}
                  </p>
                </div>
                
                <div className="flex items-center gap-8">
                  <p className="font-dm-sans font-medium text-base text-[#171417] w-32">Job Status</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg text-sm font-normal ${jobBadge.bg} ${jobBadge.text}`}
                  >
                    {payment.jobStatus}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#D00416]" />
                  <p className="font-dm-sans font-normal text-base text-[#454345]">
                    <span className="font-medium text-[#171417]">Date:</span> {payment.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="border-t pt-4 px-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={20} className="text-[#454345]" />
                <h3 className="font-dm-sans font-bold text-base text-[#646264]">
                  Payment Breakdown
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-dm-sans font-medium text-base text-[#171417]">
                  Service Fee Amount
                </p>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-normal ${
                      payment.status === "PENDING REFUND"
                        ? "bg-[#E5E5E5] text-[#272727]"
                        : statusStyle.bg + " " + statusStyle.text
                    }`}
                  >
                    {payment.status === "PENDING REFUND" ? "Refund Pending" : statusStyle.label}
                  </span>
                  <p className="font-normal text-base text-right text-[#454345]">
                    {payment.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}