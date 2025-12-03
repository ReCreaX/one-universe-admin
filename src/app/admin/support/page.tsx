"use client";

import { useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SupportTicketsTable from "./Tabs/ReportTabs/SupportTicketsTable";
import AppRatingsTable from "./Tabs/RatingsTabs/AppRatingsTable";
import RatingsFilterDrawer from "./Filters/RatingsFilterDrawer";
import EmptyState from "./EmptyState";

const StatusFilterDropdown = ({
  isOpen,
  onClose,
  selectedStatuses,
  onStatusChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: string[];
  onStatusChange: (status: string) => void;
}) => {
  if (!isOpen) return null;

  const statuses = ["New", "In Progress", "Resolved"];

  return (
    <div className="relative">
      <div
        className="absolute top-10 right-0 w-[125px] bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-[#E5E5E5]"
        style={{
          boxShadow:
            "0px 8px 16px 0px #1A1A1A14, 0px 4px 6px 0px #1A1A1A14, 0px 1px 2px 0px #1A1A1A1F",
        }}
      >
        <div className="py-2">
          {statuses.map((status, index) => (
            <label
              key={status}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition text-[#3C3C3C] font-dm-sans text-base
                ${index !== statuses.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => onStatusChange(status)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                    ${
                      selectedStatuses.includes(status)
                        ? "border-[#154751] bg-[#154751]"
                        : "border-[#757575] bg-white"
                    }`}
                >
                  {selectedStatuses.includes(status) && (
                    <Check size={10} className="text-white stroke-[3]" />
                  )}
                </div>
              </div>
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="fixed inset-0 z-40" onClick={onClose} />
    </div>
  );
};

const AdminSupportPage = () => {
  const [activeTab, setActiveTab] = useState("reported-issues");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRatingsFilter, setShowRatingsFilter] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "New",
    "In Progress",
    "Resolved",
  ]);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const hasTickets = false; // Toggle this to test empty state

  return (
    <>
      <main className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-8">
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-dm-sans font-bold text-[24px] leading-[120%] text-[#171417]">
              Support & Feedback
            </h1>
            <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
              Manage all user concerns and app ratings in one place
            </p>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-[363px] h-[46px] bg-transparent border-b border-[#E8E3E3] rounded-none p-0 mb-8">
            <TabsTrigger
              value="reported-issues"
              className="h-[46px] px-4 py-3 rounded-none border-b-[1.5px] data-[state=active]:border-[#154751] data-[state=active]:bg-[#E6E8E9] font-dm-sans font-medium text-base"
            >
              Reported Issues
            </TabsTrigger>
            <TabsTrigger
              value="ratings-reviews"
              className="h-[46px] px-4 py-3 rounded-none border-b-[1.5px] data-[state=active]:border-[#154751] data-[state=active]:bg-[#E6E8E9] font-dm-sans font-medium text-base"
            >
              App Ratings & Reviews
            </TabsTrigger>
          </TabsList>

          {/* Reported Issues Tab */}
          <TabsContent value="reported-issues" className="mt-0">
            <div className="bg-white rounded-t-[30px] border border-[#E8E3E3] overflow-hidden">
              <div className="h-12 px-6 flex items-center justify-between border-b border-[#E8E3E3]">
                <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
                  Support Tickets
                </h2>
                <span className="font-dm-sans font-medium text-sm text-[#171417] bg-[#E6E8E9] px-2 py-0.5 rounded">
                  0
                </span>
              </div>

              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="relative w-full max-w-[532px]">
                  <input
                    type="text"
                    placeholder="Search by username, subject, or ticket ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 border border-[#B7B6B7] rounded-lg font-inter text-base placeholder:text-[#7B7B7B] focus:outline-none focus:border-[#04171F] transition"
                  />
                  <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B7B7B]" />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                    className="flex items-center gap-2 h-[38px] px-4 border border-[#B5B1B1] rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="font-dm-sans text-base text-[#171417]">Status</span>
                    <ChevronDown
                      size={16}
                      className={`text-[#171417] transition-transform ${showStatusFilter ? "rotate-180" : ""}`}
                    />
                  </button>

                  <StatusFilterDropdown
                    isOpen={showStatusFilter}
                    onClose={() => setShowStatusFilter(false)}
                    selectedStatuses={selectedStatuses}
                    onStatusChange={toggleStatus}
                  />
                </div>
              </div>

              {/* Table or Empty State */}
              <div className="min-h-[420px] overflow-x-auto bg-white">
                {hasTickets ? <SupportTicketsTable /> : <EmptyState type="support" />}
              </div>
            </div>
          </TabsContent>

          {/* Ratings & Reviews Tab */}
          <TabsContent value="ratings-reviews" className="mt-0">
            <div className="bg-white rounded-t-[30px] border border-[#E8E3E3] overflow-hidden">
              <div className="h-12 px-6 flex items-center justify-between border-b border-[#E8E3E3]">
                <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
                  App Ratings & Reviews
                </h2>
                <button
                  onClick={() => setShowRatingsFilter(true)}
                  className="flex items-center gap-2 h-[38px] px-4 border border-[#B5B1B1] rounded-lg hover:bg-gray-50 transition"
                >
                  Filter
                </button>
              </div>

              <div className="min-h-[420px] flex items-center justify-center bg-white">
                <AppRatingsTable />
                {/* Replace with empty state if no ratings */}
                {/* <EmptyState type="ratings" /> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <RatingsFilterDrawer
        isOpen={showRatingsFilter}
        onClose={() => setShowRatingsFilter(false)}
      />
    </>
  );
};

export default AdminSupportPage;
