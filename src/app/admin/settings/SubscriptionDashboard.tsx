// components/subscription/SubscriptionDashboard.tsx
"use client";

import React from "react";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import SubscriptionTable from "./Tabs/subscription/SubscriptionTable"; // Same folder
import SettingsEmptyState from "./SettingsEmptyState";

const SubscriptionDashboard = () => {
  // Simulate data state — replace with real API later
  const hasSubscriptions = true; // Set to false to see empty state

  return (
    <div className="w-full space-y-8 px-5 md:px-0">

      {/* === 3 STAT CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Subscriptions */}
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
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">4</p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#D7FFE9] rounded-sm flex items-center justify-center">
                <TrendingUp size={10} className="text-[#1FC16B]" />
              </div>
              <span>+21% from last month</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-dm-sans text-base font-medium text-[#171417]">
              Monthly Revenue
            </span>
            <TrendingUp size={16} className="text-[#1FC16B]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">₦248,000</p>
            <div className="font-dm-sans text-xs text-[#171417] mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#D7FFE9] rounded-sm flex items-center justify-center">
                <TrendingUp size={10} className="text-[#1FC16B]" />
              </div>
              <span>+21% from last month</span>
            </div>
          </div>
        </div>

        {/* Pending Renewals */}
        <div className="bg-white border border-[#E8E3E3] rounded-lg px-4 pt-3 pb-4 h-[123px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-dm-sans text-base font-medium text-[#171417]">
              Pending Renewals
            </span>
            <TrendingDown size={16} className="text-[#D84040]" />
          </div>
          <div>
            <p className="font-dm-sans font-bold text-2xl text-[#171417]">1</p>
            <div className="font-dm-sans text-xs text-[#D84040] mt-1 flex items-center gap-1">
              <div className="w-3 h-3 bg-[#E9BCB7] rounded-sm flex items-center justify-center">
                <TrendingDown size={10} className="text-[#D84040]" />
              </div>
              <span>-21% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* === TITLE === */}
      <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
        Premium Ranking Subscribers
      </h2>

      {/* === MAIN CONTAINER WITH SEARCH + CONTENT === */}
      <div className="bg-white rounded-t-3xl overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-4 pb-5 border-b border-[#D0D0D0]">
          <div className="flex items-center gap-3 border border-[#B7B6B7] rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-[#7B7B7B]" />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              className="flex-1 outline-none font-inter text-base text-[#7B7B7B] placeholder-[#7B7B7B]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-[#B5B1B1] rounded-lg bg-white hover:bg-gray-50 transition">
            <Filter size={16} />
            <span className="font-dm-sans text-base text-[#171417]">Filter</span>
          </button>
        </div>

        {/* === TABLE OR EMPTY STATE === */}
        {hasSubscriptions ? (
          <div className="p-0">
            <SubscriptionTable />
          </div>
        ) : (
          <div className="py-20">
            <SettingsEmptyState />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;