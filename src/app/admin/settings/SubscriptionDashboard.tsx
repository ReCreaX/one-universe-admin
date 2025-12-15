"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Check, Loader, Edit2 } from "lucide-react";
import SubscriptionTable from "./Tabs/subscription/SubscriptionTable";
import SettingsEmptyState from "./SettingsEmptyState";
import UpdatePlanPricingModal from "./Tabs/pricing/UpdatePricingModal";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { usePlanStore } from "@/store/planStore";
import { Plan } from "@/services/planService";

const SubscriptionDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    subscriptions,
    metrics,
    pagination,
    loading,
    error,
    selectedFilters,
    searchTerm,
    fetchSubscriptions,
    setSelectedFilters,
    setSearchTerm,
  } = useSubscriptionStore();

  const { plans, fetchPlans, groupedPlans } = usePlanStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchSubscriptions(pagination?.page || 1, pagination?.limit || 10);
  }, []);

  const handlePageChange = (page: number) => {
    fetchSubscriptions(page, pagination?.limit || 10);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = metrics?.activeSubscriptions || 0;
  const monthlyRevenue = metrics?.totalRevenue || 0;
  const pendingRenewals = metrics?.yetToRenew || 0;

  const previousActive = Math.max(1, activeCount - Math.floor(activeCount * 0.21));
  const activePercentChange = activeCount > 0 ? Math.round(((activeCount - previousActive) / previousActive) * 100) : 0;
  const revenuePercentChange = 21;

  const premiumMonthly = groupedPlans['Premium Plan']?.['MONTHLY'];
  const premiumYearly = groupedPlans['Premium Plan']?.['YEARLY'];

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
                Active Subscriptions
              </span>
            </div>
            <TrendingUp size={16} className="text-[#00AB47]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? <Loader size={20} className="animate-spin" /> : activeCount}
            </p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#D7FFE9] rounded-sm flex items-center justify-center">
                <TrendingUp size={10} className="text-[#1FC16B]" />
              </div>
              <span>+{activePercentChange}% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-dm-sans text-base font-medium text-[#171417]">
              Monthly Revenue
            </span>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                `₦${monthlyRevenue.toLocaleString()}`
              )}
            </p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#D7FFE9] rounded-sm flex items-center justify-center">
                <TrendingUp size={10} className="text-[#1FC16B]" />
              </div>
              <span>+{revenuePercentChange}% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-dm-sans text-base font-medium text-[#171417]">
              Pending Renewals
            </span>
            <TrendingDown size={16} className={pendingRenewals > 0 ? "text-[#D84040]" : "text-[#1FC16B]"} />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">
              {loading ? <Loader size={20} className="animate-spin" /> : pendingRenewals}
            </p>
            <div className={`font-dm-sans text-xs mt-1 flex items-center gap-1 ${pendingRenewals > 0 ? 'text-[#D84040]' : 'text-[#1FC16B]'}`}>
              <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${pendingRenewals > 0 ? 'bg-[#E9BCB7]' : 'bg-[#D7FFE9]'}`}>
                <TrendingDown size={10} className={pendingRenewals > 0 ? "text-[#D84040]" : "text-[#1FC16B]"} />
              </div>
              <span>{pendingRenewals > 0 ? '-' : '+'}21% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* === PRICING CARDS === */}
      <div className="bg-white rounded-2xl border border-[#E8E3E3] p-6 space-y-4">
        <div>
          <h3 className="font-dm-sans font-bold text-lg text-[#171417] mb-2">
            Premium Ranking Subscription Pricing
          </h3>
          <p className="font-dm-sans text-sm text-[#6B6969]">
            Manage monthly and yearly subscription prices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Card */}
          {premiumMonthly ? (
            <div className="border border-[#E8E3E3] rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-dm-sans font-medium text-white bg-[#154751]">
                    MONTHLY
                  </span>
                </div>
                <p className="font-dm-sans text-2xl font-bold text-[#171417]">
                  ₦{(premiumMonthly.price || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleOpenModal(premiumMonthly)}
                className="p-2 rounded-lg border border-[#E8E3E3] hover:bg-white hover:border-[#154751] transition-colors"
                title="Edit monthly price"
              >
                <Edit2 size={18} className="text-[#154751]" />
              </button>
            </div>
          ) : null}

          {/* Yearly Card */}
          {premiumYearly ? (
            <div className="border border-[#E8E3E3] rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-dm-sans font-medium text-white bg-[#1FC16B]">
                    YEARLY
                  </span>
                </div>
                <p className="font-dm-sans text-2xl font-bold text-[#171417]">
                  ₦{(premiumYearly.price || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleOpenModal(premiumYearly)}
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
        Premium Ranking Subscribers
      </h2>

      {/* === MAIN CONTAINER === */}
      <div className="bg-white rounded-t-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B6B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-[#B5B1B1] rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              <span className="font-dm-sans text-base text-[#171417]">
                Filter {selectedFilters.length > 1 ? `(${selectedFilters.length - 1})` : ""}
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-[#E5E5E5] overflow-hidden z-50">
                <div className="py-2">
                  {["All", "ACTIVE", "EXPIRED", "SUSPENDED"].map((filter) => {
                    const isSelected = selectedFilters.includes(filter);
                    return (
                      <label
                        key={filter}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#F9F9F9] cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (filter === "All") {
                              setSelectedFilters(["All"]);
                            } else {
                              setSelectedFilters(
                                selectedFilters.includes(filter)
                                  ? selectedFilters.filter((f) => f !== filter && f !== "All")
                                  : [...selectedFilters.filter((f) => f !== "All"), filter]
                              );
                            }
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "border-[#154751] bg-[#154751]"
                              : "border-[#757575] bg-white"
                          }`}
                        >
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="font-dm-sans text-base text-[#3C3C3C] select-none">
                          {filter === "ACTIVE" ? "Active" : filter === "EXPIRED" ? "Expired" : filter === "SUSPENDED" ? "Suspended" : filter}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg m-6">
            <p className="text-red-800 font-dm-sans text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-[#154751]" />
          </div>
        ) : subscriptions.length > 0 ? (
          <div className="p-0">
            <SubscriptionTable 
              subscriptions={subscriptions}
              pagination={pagination}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="py-20">
            <SettingsEmptyState />
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

export default SubscriptionDashboard;