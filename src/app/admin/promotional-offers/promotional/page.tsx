// app/admin/settings/PromotionalDashboard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import PromotionalEmptyState from "./PromotionalEmptyState";
import PromotionalOffersTable from "./PromotionalTable";
import CreatePromoOfferModal from "./modal/CreatePromoOfferModal";
// ✅ CORRECT IMPORT - Import renamed component to avoid naming conflict
import PromotionalFilterPanel from "./Filters/PromotionalFilterPanel";
import Pagination from "../../../../shared/Pagination/Pagination";
import { usePromotionalStore } from "@/store/promotionalStore";

const ITEMS_PER_PAGE = 10;

const PromotionalDashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Zustand store hooks
  const {
    allPromotions,
    allPromotionsLoading,
    allPromotionsError,
    stats,
    fetchAllPromotions,
    fetchStats,
    PromotionalFilter, // ✅ Get filter state from store
  } = usePromotionalStore();

  // Load data on mount with proper parameter validation
  useEffect(() => {
    const loadData = async () => {
      try {
        const validPage = Math.max(1, Math.floor(1));
        const validPageSize = Math.max(1, Math.floor(100));
        
        console.log(`🔄 Loading promotions with page=${validPage}, pageSize=${validPageSize}`);
        
        await Promise.all([
          fetchAllPromotions(validPage, validPageSize),
          fetchStats(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, [fetchAllPromotions, fetchStats]);

  // ✅ HELPER: Convert string date to Date object safely
  const toDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Transform API promotions to UI format
  const transformedPromotions = allPromotions.map((promo) => ({
    id: promo.id,
    offerTitle: promo.offerTitle,
    eligibleUser: promo.eligibleUser,
    type: promo.type,
    activationTrigger: promo.activationTrigger,
    rewardValue: promo.rewardValue,
    rewardUnit: promo.rewardUnit,
    maxRedemptionPerUser: promo.maxRedemptionPerUser,
    maxTotalRedemption: promo.maxTotalRedemption,
    offerId: `#${promo.id.substring(0, 8).toUpperCase()}`,
    title: promo.offerTitle,
    endDate: new Date(promo.endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    startDate: promo.startDate,
    status:
      promo.status === "ACTIVE"
        ? "Active"
        : promo.status === "DRAFT"
          ? "Draft"
          : "Expired",
    redemptions: promo.redemptions || 0,
    // ✅ FIXED: Store as Date object for filtering
    createdAt: toDate(promo.createdAt) || new Date(0),
  }));

  // ✅ FIXED: Apply filters from PromotionalFilter store with proper type handling
  const filteredPromotions = transformedPromotions.filter((promo) => {
    // Search filter
    const matchesSearch =
      searchQuery.length === 0 ||
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.offerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.type.toLowerCase().includes(searchQuery.toLowerCase());

    // ✅ Advanced filters from PromotionalFilter panel
    
    // 1. Status filter (from advanced panel)
    const matchesStatus = !PromotionalFilter.status || 
      promo.status.toLowerCase() === PromotionalFilter.status.toLowerCase();

    // 2. Type filter (from advanced panel)
    const matchesType = !PromotionalFilter.type || 
      PromotionalFilter.type.length === 0 ||
      PromotionalFilter.type.some((t: string) => 
        promo.type.toLowerCase().includes(t.toLowerCase())
      );

    // 3. Eligible Users filter (from advanced panel)
    const matchesEligible = !PromotionalFilter.eligibleUser || 
      PromotionalFilter.eligibleUser.length === 0 ||
      PromotionalFilter.eligibleUser.some((e: string) => 
        promo.eligibleUser.toLowerCase().includes(e.toLowerCase())
      );

    // ✅ 4. Date range filter (from advanced panel) - FIXED: Proper Date comparison
    const matchesDateRange = 
      (!PromotionalFilter.fromDate || (promo.createdAt && promo.createdAt >= PromotionalFilter.fromDate)) &&
      (!PromotionalFilter.toDate || (promo.createdAt && promo.createdAt <= PromotionalFilter.toDate));

    return matchesSearch && matchesStatus && matchesType && matchesEligible && matchesDateRange;
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, PromotionalFilter]);

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    const tableElement = document.getElementById("promotional-table");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ✅ FIXED: Close filter when clicking outside - but not immediately on open
  useEffect(() => {
    if (!isAdvancedFilterOpen) return; // Don't add listener if filter not open

    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsAdvancedFilterOpen(false);
      }
    };

    // Use a small delay to avoid closing immediately on open
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdvancedFilterOpen]);

  if (allPromotionsLoading && allPromotions.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154751] mx-auto mb-4"></div>
          <p className="text-[#171417] font-dm-sans">Loading promotional data...</p>
        </div>
      </div>
    );
  }

  if (allPromotionsError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-[#D84040] font-dm-sans font-bold text-lg mb-2">
            Error Loading Data
          </p>
          <p className="text-[#454345] font-dm-sans mb-4">{allPromotionsError}</p>
          <button
            onClick={() => {
              fetchAllPromotions(1, 100);
              fetchStats();
            }}
            className="px-6 py-2 bg-[#154751] text-white rounded-lg font-dm-sans font-medium hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-5 md:px-0">
      {/* === HEADER SECTION === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-dm-sans font-bold text-2xl leading-[120%] text-[#171417]">
            Promotional Offers
          </h1>
          <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
            Create and manage incentives to boost platform activity
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 h-[48px] rounded-[20px] px-6 py-4 whitespace-nowrap"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M8 3.33334V12.6667M3.33333 8H12.6667"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span
            className="font-dm-sans font-medium text-base leading-[140%]"
            style={{ color: "#FDFDFD" }}
          >
            Create New Offer
          </span>
        </button>
      </div>

      {/* === 4 STAT CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Promotions */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#3621EE] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Active Promotions
              </span>
            </div>
            <TrendingUp size={16} className="text-[#00AB47]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {stats?.activePromotions || 0}
            </p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#1FC16B]" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FE4B01] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Total Redemptions
              </span>
            </div>
            <TrendingDown size={16} className="text-[#D84040]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {(stats?.totalRedemptions || 0).toLocaleString()}
            </p>
            <div className="font-dm-sans text-xs text-[#D84040] mt-1 flex items-center gap-1">
              <TrendingDown size={10} className="text-[#D84040]" />
              <span>-8% from last month</span>
            </div>
          </div>
        </div>

        {/* Reward Given */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#67A344] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Reward Given
              </span>
            </div>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              ₦{(stats?.rewardGiven || 0).toLocaleString()}
            </p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#1FC16B]" />
              <span>+18% from last month</span>
            </div>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#CE1474] rounded flex items-center justify-center p-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0L7.854 4.146L12 6L7.854 7.854L6 12L4.146 7.854L0 6L4.146 4.146L6 0Z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                New Users
              </span>
            </div>
            <TrendingUp size={16} className="text-[#00AB47]" />
          </div>
          <div className="border-t border-[#E8E3E3] pt-2">
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {stats?.newUsers || 0}
            </p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#1FC16B]" />
              <span>+24% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN CONTAINER WITH SEARCH + FILTER === */}
      <div className="bg-white rounded-t-3xl overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B6B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by title, type, or ID"
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ✅ Advanced Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-[#B5B1B1] rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              <span className="font-dm-sans text-base text-[#171417]">
                Advanced Filter
              </span>
            </button>
          </div>
        </div>

        {/* TABLE OR EMPTY STATE */}
        {filteredPromotions.length > 0 ? (
          <>
            <div id="promotional-table" className="p-0">
              <PromotionalOffersTable promotions={paginatedPromotions} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-[#D0D0D0]">
                <Pagination
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Results Info */}
            <div className="px-6 py-4 bg-gray-50 border-t border-[#D0D0D0] text-sm font-dm-sans text-[#454345]">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPromotions.length)} of{" "}
              {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? "s" : ""}
            </div>
          </>
        ) : (
          <div className="py-20">
            <PromotionalEmptyState />
          </div>
        )}
      </div>

      {/* ✅ Advanced Filter Panel - FIXED NAMING */}
      {isAdvancedFilterOpen && (
        <div ref={filterRef}>
          <PromotionalFilterPanel
            onApplyFilter={() => setIsAdvancedFilterOpen(false)}
          />
        </div>
      )}

      {/* Create Promotion Modal */}
      <CreatePromoOfferModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default PromotionalDashboard;