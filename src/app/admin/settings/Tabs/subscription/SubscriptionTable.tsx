"use client";

import React, { useState, useMemo } from "react";
import SubscriptionDetailsModal from "./SubscriptionDetailsModal";
import { Subscription, Pagination } from "@/store/subscriptionStore";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  pagination?: Pagination | null;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ 
  subscriptions,
  pagination = null,
  loading = false,
  onPageChange = () => {},
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // Format subscription data for display
  const formattedSubscriptions = useMemo(() => {
    return subscriptions.map((sub) => {
      const isSeller = sub.user.role === "SELLER" || 
        sub.user.userRoles.some(ur => ur.role.name === "SELLER");
      
      return {
        ...sub,
        sellerName: sub.user.fullName,
        email: sub.user.email,
        phone: sub.user.phone,
        endDate: new Date(sub.endDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        startDate: new Date(sub.startDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        planType: sub.plan.name,
        statusLabel: sub.status === 'ACTIVE' ? 'Active' : 
                    sub.status === 'EXPIRED' ? 'Expired' : 
                    sub.status === 'SUSPENDED' ? 'Suspended' : sub.status,
        isSeller,
      };
    });
  }, [subscriptions]);

  const handleViewDetails = (sub: typeof formattedSubscriptions[0]) => {
    // Map transaction data from backend if available, otherwise empty array
    const payments = sub.transaction ? 
      Array.isArray(sub.transaction) ? 
        sub.transaction.map((txn: any) => ({
          date: new Date(txn.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: `₦${txn.amount.toLocaleString()}`,
          status: txn.status === 'PAID' ? 'Paid' : txn.status === 'PENDING' ? 'Pending' : txn.status,
          transactionId: txn.reference || txn.id,
        }))
      : [
        // Single transaction object
        {
          date: new Date(sub.transaction.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: `₦${sub.transaction.amount.toLocaleString()}`,
          status: sub.transaction.status === 'PAID' ? 'Paid' : sub.transaction.status === 'PENDING' ? 'Pending' : sub.transaction.status,
          transactionId: sub.transaction.reference || sub.transaction.id,
        }
      ]
    : [];

    // Determine overall payment status from transactions
    const paymentStatus = payments.length > 0 
      ? payments.some((p: any) => p.status === 'Paid') ? 'Paid' : 'Pending'
      : 'Pending';

    setSelectedSubscription({
      id: sub.id,
      sellerName: sub.sellerName,
      email: sub.email,
      phone: sub.phone,
      planType: sub.planType,
      startDate: sub.startDate,
      endDate: sub.endDate,
      paymentStatus: paymentStatus,
      status: sub.statusLabel,
      payments: payments,
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired":
        return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended":
        return "bg-[#FFF2B9] text-[#B76E00]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (formattedSubscriptions.length === 0) {
    return <div className="py-20 text-center text-gray-500">No subscriptions found</div>;
  }

  // Props for Pagination
  const paginationProps = {
    currentPage: pagination?.page || 1,
    totalPages: pagination?.page || 1,
    onPageChange: (page: number) => {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Trigger fetch with new page
      if (onPageChange) onPageChange(page);
    },
    isLoading: loading,
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] whitespace-nowrap">
                Seller Name
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] whitespace-nowrap">
                Email Address
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] whitespace-nowrap">
                End Date
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] whitespace-nowrap">
                Plan Type
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264] whitespace-nowrap">
                Status
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#7B7B7B] whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {formattedSubscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] whitespace-nowrap">
                  {sub.sellerName}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] whitespace-nowrap">
                  {sub.email}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] whitespace-nowrap">
                  {sub.endDate}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] whitespace-nowrap">
                  {sub.planType}
                </td>
                <td className="py-[18px] px-[25px]">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusStyles(
                      sub.statusLabel
                    )}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current flex-shrink-0" />
                    {sub.statusLabel}
                  </span>
                </td>
                <td className="py-[18px] px-[25px]">
                  <button
                    onClick={() => handleViewDetails(sub)}
                    className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline transition-colors whitespace-nowrap"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {formattedSubscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white border border-[#E8E3E3] rounded-lg p-4 sm:p-5 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="min-w-0">
                <h4 className="font-dm-sans font-medium text-base text-[#171417] truncate">
                  {sub.sellerName}
                </h4>
                <p className="font-dm-sans text-sm text-[#6B6969] mt-1 truncate">{sub.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="min-w-0">
                <p className="text-[#6B6969] truncate">End Date</p>
                <p className="font-medium text-[#171417] mt-1 truncate">{sub.endDate}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[#6B6969] truncate">Plan</p>
                <p className="font-medium text-[#171417] mt-1 truncate">{sub.planType}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusStyles(
                  sub.statusLabel
                )}`}
              >
                <div className="w-2 h-2 rounded-full bg-current flex-shrink-0" />
                {sub.statusLabel}
              </span>

              <button
                onClick={() => handleViewDetails(sub)}
                className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline whitespace-nowrap"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.page > 1 && (
        <div className="flex justify-center items-center gap-3 px-6 py-6 border-t border-[#E5E5E5] bg-white">
          <button
            onClick={() => {
              if (pagination.page > 1 && !loading) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onPageChange(pagination.page - 1);
              }
            }}
            disabled={pagination.page === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#171417] font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-[#646264] font-dm-sans font-medium">
            Page {pagination.page} of {pagination.page}
          </span>

          <button
            onClick={() => {
              if (pagination.page < pagination.page && !loading) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onPageChange(pagination.page + 1);
              }
            }}
            disabled={pagination.page === pagination.page || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#171417] font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Beautiful Modal */}
      <SubscriptionDetailsModal
        isOpen={!!selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        subscription={selectedSubscription}
      />
    </>
  );
};

export default SubscriptionTable;