"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, TrendingUp, Loader, Edit2 } from "lucide-react";
import SponsorAdsTable from "./Tabs/ads/SponsorAdsTable";
import SettingsEmptyState from "./SettingsEmptyState";
import UpdatePlanPricingModal from "./Tabs/pricing/UpdatePricingModal";
import { useSponsorAdsStore } from "@/store/sponsorAdsStore";
import { usePlanStore } from "@/store/planStore";
import SponsorAdsFilter, { SponsorAdsFilterState } from "./components/filters/SponsorAdsFilter";
import { Plan } from "@/services/planService";

const SponsorAdsDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<SponsorAdsFilterState>({
    paymentStatus: null,
    planType: null,
    subscriptionStatus: null,
    fromDate: null,
    toDate: null,
  });

  const {
    ads,
    metrics,
    pagination,
    loading,
    error,
    searchTerm,
    fetchAds,
    setSearchTerm,
  } = useSponsorAdsStore();

  const { plans, fetchPlans, groupedPlans } = usePlanStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchAds(pagination?.page || 1, pagination?.limit || 10);
  }, []);

  const handlePageChange = (page: number) => {
    fetchAds(page, pagination?.limit || 10);
  };

  const handleOpenModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const totalAds = metrics?.totalSubscriptions || 0;
  const activeCount = metrics?.activeSubscriptions || 0;
  const totalRevenue = metrics?.totalRevenue || 0;

  const sponsorMonthly = groupedPlans['Sponsor Ads']?.['MONTHLY'];
  const sponsorYearly = groupedPlans['Sponsor Ads']?.['YEARLY'];

  return (
    <div className="w-full space-y-8 px-5 md:px-0">
      {/* === 3 STAT CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#00AB47] rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Total Sponsor Ads
              </span>
            </div>
            <TrendingUp size={16} className="text-[#00AB47]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? <Loader size={20} className="animate-spin" /> : totalAds}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#1FC16B] rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="font-dm-sans text-base font-medium text-[#171417]">
                Active Ads
              </span>
            </div>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? <Loader size={20} className="animate-spin" /> : activeCount}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-dm-sans text-base font-medium text-[#171417]">
              Total Monthly Revenue
            </span>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                `₦${totalRevenue.toLocaleString()}`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* === PRICING CARDS === */}
      <div className="bg-white rounded-2xl border border-[#E8E3E3] p-6 space-y-4">
        <div>
          <h3 className="font-dm-sans font-bold text-lg text-[#171417] mb-2">
            Sponsor Ads Pricing
          </h3>
          <p className="font-dm-sans text-sm text-[#6B6969]">
            Manage monthly and yearly pricing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Card */}
          {sponsorMonthly ? (
            <div className="border border-[#E8E3E3] rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-dm-sans font-medium text-white bg-[#154751]">
                    MONTHLY
                  </span>
                </div>
                <p className="font-dm-sans text-2xl font-bold text-[#171417]">
                  ₦{(sponsorMonthly.price || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleOpenModal(sponsorMonthly)}
                className="p-2 rounded-lg border border-[#E8E3E3] hover:bg-white hover:border-[#154751] transition-colors"
                title="Edit monthly price"
              >
                <Edit2 size={18} className="text-[#154751]" />
              </button>
            </div>
          ) : null}

          {/* Yearly Card */}
          {sponsorYearly ? (
            <div className="border border-[#E8E3E3] rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-dm-sans font-medium text-white bg-[#1FC16B]">
                    YEARLY
                  </span>
                </div>
                <p className="font-dm-sans text-2xl font-bold text-[#171417]">
                  ₦{(sponsorYearly.price || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleOpenModal(sponsorYearly)}
                className="p-2 rounded-lg border border-[#E8E3E3] hover:bg-white hover:border-[#154751] transition-colors"
                title="Edit yearly price"
              >
                <Edit2 size={18} className="text-[#154751]" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* === TITLE === */}
      <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
        Sponsored Ad Subscribers
      </h2>

      {/* === MAIN CONTENT === */}
      <div className="bg-white rounded-t-3xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B7B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
            />
          </div>

          <div ref={filterRef} className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-[#B7B7B7] rounded-lg text-[#7B7B7B] hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              <span className="font-dm-sans text-base">Filter</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 z-20">
                <SponsorAdsFilter
                  onApply={(newFilters) => {
                    setFilters(newFilters);
                    setIsFilterOpen(false);
                  }}
                  onClear={() => {
                    setFilters({
                      paymentStatus: null,
                      planType: null,
                      subscriptionStatus: null,
                      fromDate: null,
                      toDate: null,
                    });
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {ads.length > 0 ? (
          <div className="overflow-x-auto">
            <SponsorAdsTable 
              ads={ads} 
              filters={filters}
              pagination={pagination}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="py-20">
            {error ? (
              <div className="text-center">
                <p className="text-red-500 font-dm-sans text-lg">{error}</p>
              </div>
            ) : (
              <SettingsEmptyState />
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPlan && (
        <UpdatePlanPricingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          plan={selectedPlan}
          allPlans={plans}
          onUpdate={() => {
            handleCloseModal();
            fetchPlans();
          }}
        />
      )}
    </div>
  );
};

export default SponsorAdsDashboard;