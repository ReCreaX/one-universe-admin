// app/admin/settings/PromotionalDashboard.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import SettingsEmptyState from "./PromotionalEmptyState";
import PromotionalOffersTable from "./PromotionalTable";
import CreatePromoOfferModal from "./modal/CreatePromoOfferModal";
import PromotionalFilter from "../Filters/PromotionalFilter";
import { PromotionalOffer } from "@/types/PromotionalOffer";
import { usePromotionalStore } from "@/store/promotionalStore";

const PromotionalDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  // This is the ONLY filter state — from your dedicated store
  const { PromotionalFilter: filters } = usePromotionalStore();

  // Sample data
  const [offers] = useState<PromotionalOffer[]>([
    { id: "1", offerId: "#OFF001", title: "Summer Sale 2025", type: "Discount", eligibleUser: "All Users", endDate: "31 Aug 2025", redemptions: 1250, status: "Active" },
    { id: "2", offerId: "#OFF002", title: "Free Shipping", type: "Free Shipping", eligibleUser: "Premium Members", endDate: "30 Jun 2025", redemptions: 856, status: "Active" },
    { id: "3", offerId: "#OFF003", title: "Buy One Get One", type: "Bundle", eligibleUser: "First-time Buyers", endDate: "15 May 2025", redemptions: 342, status: "Completed" },
    { id: "4", offerId: "#OFF004", title: "Cashback Bonanza", type: "Cashback", eligibleUser: "All Users", endDate: "20 Jun 2025", redemptions: 2103, status: "Active" },
  ]);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Combined filtering: search + store filters
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        !searchQuery ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.offerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filters.status || offer.status === filters.status;
      const matchesType = !filters.type?.length || filters.type.includes(offer.type);
      const matchesEligible = !filters.eligibleUser?.length || filters.eligibleUser.includes(offer.eligibleUser);

      let matchesDate = true;
      if (filters.fromDate || filters.toDate) {
        const [day, month, year] = offer.endDate.split(" ");
        const offerDate = new Date(`${year}-${month}-${day.padStart(2, "0")}`);
        if (filters.fromDate) matchesDate = matchesDate && offerDate >= filters.fromDate;
        if (filters.toDate) matchesDate = matchesDate && offerDate <= filters.toDate;
      }

      return matchesSearch && matchesStatus && matchesType && matchesEligible && matchesDate;
    });
  }, [offers, searchQuery, filters]);

  const activeFilterCount =
    (filters.status ? 1 : 0) +
    (filters.type?.length || 0) +
    (filters.eligibleUser?.length || 0) +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0);

  return (
    <div className="w-full space-y-8 px-5 md:px-0">
      {isModalOpen && <CreatePromoOfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-dm-sans font-bold text-2xl leading-[120%] text-[#171417]">Promotional Offers</h1>
          <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
            Create and manage incentives to boost platform activity
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-[48px] rounded-[20px] px-6 py-4 whitespace-nowrap"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667M3.33333 8H12.6667" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-dm-sans font-medium text-base leading-[140%]" style={{ color: '#FDFDFD' }}>
            Create New Offer
          </span>
        </button>
      </div>

      {/* Stats Cards — unchanged */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... your 4 cards ... */}
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-t-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          {/* Search */}
          <div className="flex items-center gap-3 border border-[#B7B6B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by offer title, ID, or type"
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* THIS IS THE ONLY FILTER BUTTON IN THE ENTIRE FILE */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-6 py-3 border border-[#B5B1B1] rounded-[20px] bg-white hover:bg-gray-50 transition font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 12H9.33333V10.6667H6.66667V12ZM2.66667 4V5.33333H13.3333V4H2.66667ZM4.66667 8.66667H11.3333V7.33333H4.66667V8.66667Z" fill="#171417"/>
              </svg>
              <span className="text-[#171417]">
                Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </button>

            {/* YOUR FULL PROMOTIONAL FILTER — ONLY ONE */}
            {isFilterOpen && (
              <div 
                className="fixed inset-0 z-50" 
                onClick={() => setIsFilterOpen(false)}
              >
                <div 
                  className="flex justify-end p-6 pt-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PromotionalFilter onApplyFilter={() => setIsFilterOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {filteredOffers.length > 0 ? (
          <PromotionalOffersTable offers={filteredOffers} />
        ) : (
          <div className="py-20">
            <SettingsEmptyState />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalDashboard;