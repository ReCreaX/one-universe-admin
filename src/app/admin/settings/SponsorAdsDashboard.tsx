// components/ads/SponsorAdsDashboard.tsx
"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import SettingsEmptyState from "./SettingsEmptyState";

// Reuse your existing table — just import it
import SponsorAdsTable from "./Tabs/ads/SponsorAdsTable"; // We'll create this next

const SponsorAdsDashboard = () => {
  const hasAds = true; // Set to false to see empty state

  return (
    <div className="w-full space-y-8 px-5 md:px-0">

      {/* === HEADER: Title + Update Price Button === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
          Sponsored Ad Subscribers
        </h2>

        <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-3xl bg-gradient-to-r from-[#154751] to-[#04171F] hover:opacity-90 transition-opacity">
          <span className="font-dm-sans font-medium text-base text-white">
            Update Sponsor Price
          </span>
        </button>
      </div>

      {/* === MAIN CARD WITH SEARCH + TABLE === */}
      <div className="bg-white rounded-t-3xl overflow-hidden shadow-sm">
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
        {hasAds ? (
          <div className="overflow-x-auto">
            <SponsorAdsTable />
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

export default SponsorAdsDashboard;