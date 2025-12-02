"use client";

import { useState } from "react";
import { HiOutlineEye } from "react-icons/hi";
import { cn } from "@/lib/utils";
import PaymentDetailsModal from "./PaymentDetailsModal";

type Payment = {
  id: string;
  serviceTitle: string;
  buyer: string;
  seller: string;
  totalAmount: string;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED" | "FAILED";
  date: string;
};

interface PaymentTableProps {
  data: Payment[];
}

const statusConfig = {
  PAID: { label: "Paid", color: "bg-[#D7FFE9] text-[#1FC16B]" },
  PENDING: { label: "Pending", color: "bg-[#FFF4D6] text-[#F59E0B]" },
  DISPUTED: { label: "Disputed", color: "bg-[#FDEDED] text-[#D00416]" },
  "PENDING REFUND": { label: "Pending Refund", color: "bg-[#E5E5FF] text-[#6366F1]" },
  REFUNDED: { label: "Refunded", color: "bg-[#E0E0E0] text-[#525252]" },
  FAILED: { label: "Failed", color: "bg-[#FDEDED] text-[#D00416]" },
};

export default function PaymentTable({ data }: PaymentTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleOpenDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E3E3] text-[#646264] text-sm font-medium">
              <th className="py-4 px-6">Payment ID</th>
              <th className="py-4 px-6">Service Title</th>
              <th className="py-4 px-6">Buyer</th>
              <th className="py-4 px-6">Seller</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment) => {
              const status = statusConfig[payment.status];
              return (
                <tr
                  key={payment.id}
                  className="border-b border-[#E8E3E3] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  onClick={() => handleOpenDetails(payment)}
                >
                  <td className="py-5 px-6">
                    <span className="font-medium text-[#171417]">{payment.id}</span>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-[#303237] line-clamp-2 max-w-[200px]">
                      {payment.serviceTitle}
                    </p>
                  </td>
                  <td className="py-5 px-6 text-[#303237]">{payment.buyer}</td>
                  <td className="py-5 px-6 text-[#303237]">{payment.seller}</td>
                  <td className="py-5 px-6">
                    <span className="font-semibold text-[#171417]">
                      {payment.totalAmount}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
                        status.color
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-[#303237]">
                    {payment.date}
                  </td>
                  <td className="py-5 px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleOpenDetails(payment)}
                        className="p-2 hover:bg-[#E8E3E3] rounded-lg transition-colors group"
                      >
                        <HiOutlineEye
                          size={20}
                          className="text-[#646264] group-hover:text-[#04171F]"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 px-4 pb-6">
        {data.map((payment) => {
          const status = statusConfig[payment.status];
          return (
            <div
              key={payment.id}
              onClick={() => handleOpenDetails(payment)}
              className="bg-white border border-[#E8E3E3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-[#646264] font-medium">Payment ID</p>
                  <p className="font-semibold text-[#171417]">{payment.id}</p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    status.color
                  )}
                >
                  {status.label}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#646264]">Service</p>
                  <p className="font-medium text-[#303237] line-clamp-2">
                    {payment.serviceTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#646264]">Buyer</p>
                    <p className="text-[#303237]">{payment.buyer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#646264]">Seller</p>
                    <p className="text-[#303237]">{payment.seller}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-[#E8E3E3]">
                  <div>
                    <p className="text-xs text-[#646264]">Amount</p>
                    <p className="font-bold text-[#171417] text-lg">
                      {payment.totalAmount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#646264]">{payment.date}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(payment);
                      }}
                      className="p-2 hover:bg-[#F0F0F0] rounded-lg transition"
                    >
                      <HiOutlineEye size={20} className="text-[#646264]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          isOpen={true}
          onClose={handleCloseModal}
          payment={{
            id: selectedPayment.id,
            serviceTitle: selectedPayment.serviceTitle,
            buyer: {
              name: selectedPayment.buyer,
              email: "jane.adebayo@example.com",
              phone: "+234 801 234 5678",
            },
            seller: {
              name: selectedPayment.seller,
              email: "seller@example.com",
              phone: "+234 809 876 5432",
            },
            amount: selectedPayment.totalAmount,
            status: selectedPayment.status,
            bookingId: "#BKG-10219",
            bookingStatus: "Cancelled",
            jobStatus: "Cancelled",
            businessName: "Doe Cleaning Services",
            services: "Cleaning Services",
            location: "Lekki Phase 1, Lagos",
            date: "1/15/2024, 10:00:00 AM",
          }}
        />
      )}
    </>
  );
}