"use client";

import { useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import PaymentTable from "./Details/PaymentTable";
import EmptyPaymentManagement from "./EmptyPaymentManagement";
import NoPaymentManagement from "./NoPaymentManagement";
import PaymentFilters from "./Filters/PaymentFilters";
import Pagination from "@/components/ui/Pagination";
import { paymentManagementStore } from "@/store/paymentManagementStore";
import { filterPayments, formatCurrency, formatDate } from "../utils/paymentUtils";

type Payment = {
  id: string;
  serviceTitle: string;
  buyer: string;
  seller: string;
  totalAmount: string;
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED" | "FAILED";
  date: string;
};

const PaymentManagementPage = () => {
  const {
    allPayments,
    allPaymentsLoading,
    allPaymentsError,
    allPaymentsMeta,
    searchQuery,
    filters,
    fetchAllPayments,
    setSearchQuery,
    setFilters,
  } = paymentManagementStore();

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllPayments(currentPage, itemsPerPage);
  }, [fetchAllPayments, currentPage]);

  // Apply filters and search to payments
  const filteredPayments = filterPayments(allPayments, filters, searchQuery);

  // Transform data for PaymentTable component
  const transformedPayments: Payment[] = filteredPayments.map((payment) => ({
    id: payment.reference,
    serviceTitle: payment.serviceTitle || "N/A",
    buyer: payment.buyerName || "N/A",
    seller: payment.sellerName || "N/A",
    totalAmount: formatCurrency(payment.amount),
    status: payment.status,
    date: formatDate(payment.createdAt),
  }));

  const hasPayments = allPayments.length > 0;
  const hasResults = transformedPayments.length > 0;
  const totalPages = allPaymentsMeta?.lastPage || 1;

  const handleApplyFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-[1120px] mx-auto px-10 pt-6 pb-8">
      {/* TOP HEADER: Title + Export Button (same line) */}
      <header className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-dm-sans font-bold text-[24px] leading-[120%] text-[#171417]">
            Payment Management
          </h1>
          <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] max-w-[429px]">
            Oversee all payouts and refunds to ensure sellers are paid
          </p>
        </div>

        {/* Export Button - Aligned to the right */}
        <button className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-dm-sans font-medium text-base rounded-[20px] hover:opacity-90 transition">
          <HiOutlineDownload size={16} />
          Export
        </button>
      </header>

      {/* PAYMENT RECORDS SECTION */}
      <section className="bg-white rounded-t-3xl border border-[#E8E3E3] overflow-hidden">
        {/* "Payment Records" Tab Header */}
        <div className="bg-white px-6 py-5 border-b border-[#E8E3E3]">
          <h2 className="font-dm-sans font-medium text-xl leading-[140%] text-[#171417]">
            Payment Records
          </h2>
        </div>

        {/* Search + Filter Row */}
        <div className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between relative">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[532px]">
            <input
              type="text"
              placeholder="Search by Payment ID, Buyer/Seller Name, or Service Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 border border-[#B7B6B7] rounded-lg text-base font-inter placeholder-[#7B7B7B] focus:outline-none focus:border-[#04171F] transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B7B7B]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 h-12 px-6 border border-[#B5B1B1] rounded-lg text-[#171417] font-dm-sans font-medium text-base hover:bg-gray-50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.22222 13.3333H9.77778V11.5556H6.22222V13.3333ZM0 2.66667V4.44444H16V2.66667H0ZM2.66667 8.88889H13.3333V7.11111H2.66667V8.88889Z"
                fill="currentColor"
              />
            </svg>
            Filter
          </button>

          {/* Filter Dropdown */}
          {showFilter && <PaymentFilters onApplyFilter={handleApplyFilter} />}
        </div>

        {/* Error Message */}
        {allPaymentsError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {allPaymentsError}
            </p>
          </div>
        )}

        {/* Table Content */}
        <div className="min-h-[480px]">
          {allPaymentsLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : allPaymentsError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Failed to load payments</h3>
                <p className="mt-1 text-sm text-gray-500">Please try refreshing the page</p>
                <button
                  onClick={() => fetchAllPayments(currentPage, itemsPerPage)}
                  className="mt-4 px-4 py-2 bg-[#04171F] text-white rounded-lg hover:bg-[#04171F]/90 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !hasPayments ? (
            <EmptyPaymentManagement />
          ) : !hasResults ? (
            <NoPaymentManagement />
          ) : (
            <PaymentTable data={transformedPayments} />
          )}
        </div>

        {/* Pagination */}
        {hasResults && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </main>
  );
};

export default PaymentManagementPage;