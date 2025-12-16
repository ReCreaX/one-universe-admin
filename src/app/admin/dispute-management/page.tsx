"use client";

import { ListFilter, LogOut, Search } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import EmptyDispute from "./EmptyDispute";
import NoResultDispute from "./NoResultDispute";
import DisputeTable from "./DisputeTable";
import Pagination from "@/shared/Pagination/Pagination";
import DisputeDetailsModal from "./DisputeDetails";
import DisputeFilters, { DisputeFilterState } from "./Filters/Disputefilters";
import { disputeModalStore } from "@/store/disputeManagementStore";

const ITEMS_PER_PAGE = 10;

const DisputeManagementPage = () => {
  const { disputes, disputesLoading, fetchDisputes } = disputeModalStore();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DisputeFilterState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch disputes on mount
  useEffect(() => {
    fetchDisputes(1, 50);
  }, [fetchDisputes]);

  const handleApplyFilter = (filters: DisputeFilterState) => {
    setActiveFilters(filters);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleExport = async () => {
    try {
      // Export filtered data as CSV
      const headers = [
        "Dispute ID",
        "Service",
        "Buyer",
        "Seller",
        "Status",
        "Date Raised",
        "Description",
      ];

      const rows = filteredDisputes.map((dispute) => [
        dispute.id.slice(0, 8).toUpperCase(),
        dispute.booking.serviceTitle,
        dispute.buyer.fullName,
        dispute.seller?.fullName || "N/A",
        dispute.status,
        new Date(dispute.createdAt).toLocaleDateString(),
        dispute.reason,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${cell}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `disputes-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export disputes");
    }
  };

  // Combine filtering and searching
  const filteredDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      // Filter by dispute status
      if (activeFilters.disputeStatus) {
        const filterStatus = activeFilters.disputeStatus.toUpperCase();
        if (dispute.status !== filterStatus) {
          return false;
        }
      }

      // Filter by date range
      if (activeFilters.fromDate || activeFilters.toDate) {
        const disputeDate = new Date(dispute.createdAt);
        if (activeFilters.fromDate && disputeDate < activeFilters.fromDate) {
          return false;
        }
        if (activeFilters.toDate) {
          const toDateEndOfDay = new Date(activeFilters.toDate);
          toDateEndOfDay.setHours(23, 59, 59, 999);
          if (disputeDate > toDateEndOfDay) {
            return false;
          }
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          dispute.id.toLowerCase(),
          dispute.booking.serviceTitle.toLowerCase(),
          dispute.buyer.fullName.toLowerCase(),
          dispute.seller?.fullName?.toLowerCase() || "",
          dispute.reason.toLowerCase(),
          dispute.description.toLowerCase(),
        ];

        return searchableFields.some((field) => field.includes(query));
      }

      return true;
    });
  }, [disputes, activeFilters, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredDisputes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

  return (
    <main className="flex flex-col gap-[8px] md:gap-[16px]">
      <section className="flex flex-col justify-between md:flex-row gap-[16px]">
        <section className="flex flex-col gap-2">
          <h3 className="text-[#171417] font-bold text-[1.5rem] sm:text-[1.25rem] leading-[120%]">
            Dispute Management
          </h3>
          <p className="text-[#6B6969] text-[1rem] sm:text-[.875rem] leading-[140%]">
            Monitor and resolve disputes raised by buyers or sellers.
          </p>
        </section>
        <button
          onClick={handleExport}
          disabled={filteredDisputes.length === 0 || disputesLoading}
          className="[background:var(--primary-radial)] px-[24px] w-full md:w-fit flex items-center justify-center gap-[16px] text-[#FDFDFD] h-[46px] rounded-[20px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <p className="">Export</p>
          <LogOut size={16} />
        </button>
      </section>

      <section className="my-[30px] md:px-[15px] relative">
        <section className="pb-3">
          <h3 className="text-[#171417] font-medium text-[1.25rem] leading-[140%] mb-[20px]">
            Disputes
          </h3>
          <aside className="flex items-center justify-between gap-[24px]">
            <div className="border border-[#B7B6B7] relative flex-1 rounded-[8px]">
              <input
                type="text"
                placeholder="Search by Dispute ID, Buyer/Seller Name, or Service Title..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={disputesLoading}
                className="w-full h-[46px] pl-[40px] pr-[16px] rounded-[8px] outline-none text-[#7B7B7B] placeholder:text-[#6B6969] placeholder:text-[.75rem] text-[.75rem] md:text-[1rem] leading-[140%] font-normal disabled:bg-gray-100"
              />
              <Search
                size={16}
                className="text-[#6B6969] absolute left-4 top-4"
              />
            </div>
            <div className="">
              <button
                onClick={() => setShowFilters(!showFilters)}
                disabled={disputesLoading}
                className="border border-[#B7B6B7] flex items-center h-[46px] md:h-[38px] px-[8px] rounded-[8px] gap-2 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <ListFilter size={16} />
                <span className="md:block hidden text-[#171417] text-[1rem] leading-[140%]">
                  Filter
                </span>
              </button>
            </div>
          </aside>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <DisputeFilters onApplyFilter={handleApplyFilter} />
          </div>
        )}

        <hr />

        <section className="mt-4 py-10">
          {disputesLoading ? (
            <div className="text-center py-10 text-[#6B6969]">
              <p className="font-medium">Loading disputes...</p>
            </div>
          ) : disputes.length === 0 ? (
            <EmptyDispute />
          ) : filteredDisputes.length === 0 ? (
            <NoResultDispute />
          ) : (
            <>
              <DisputeTable
                disputes={paginatedDisputes}
                activeFilters={activeFilters}
              />
              {totalPages > 1 && (
                <div className="mt-8 mb-[50px] w-full flex items-center justify-center">
                  <Pagination 
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </section>
      <DisputeDetailsModal />
    </main>
  );
};

export default DisputeManagementPage;