"use client";

import { ListFilter, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import UserTabSelector from "./UserTabSelector";
import BuyersTable from "./Tabs/BuyerTabs/BuyersTable";
import SellersTable from "./Tabs/SellersTabs/SellersTable";
import AdminTable from "./Tabs/AdminTabs/AdminTable";
import BuyerDetails from "./Tabs/BuyerTabs/BuyerDetails";
import SellerDetails from "./Tabs/SellersTabs/SellerDetails";
import AdminDetails from "./Tabs/AdminTabs/AdminDetails";
import BuyerFilters from "./Filters/BuyerFilters";
import SellerFilters from "./Filters/SellerFilters";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { userManagementStore } from "@/store/userManagementStore";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Reusable Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-[#E8E3E3]">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 h-11 px-6 rounded-[36px] border-[#E8E3E3] text-[#171417] font-bold text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
        Previous
      </Button>

      <div className="text-sm">
        <span className="font-bold text-[#171417]">Page {currentPage}</span>
        <span className="text-[#6B6969] mx-1">of</span>
        <span className="text-[#6B6969] font-medium">{totalPages}</span>
      </div>

      <Button
        variant="default"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 h-11 px-6 rounded-[36px] bg-[#171417] text-white font-bold text-sm hover:bg-[#171417]/90"
      >
        Next
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

const UsersManagement = () => {
  const { modalType, setRefetchUsers } = userManagementStore();
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<"Buyers" | "Sellers" | "Admin Users">("Buyers");

  // Pagination state per tab
  const [pagination, setPagination] = useState({
    Buyers: { current: 1, total: 1 },
    Sellers: { current: 1, total: 1 },
    "Admin Users": { current: 1, total: 1 },
  });

  const currentPage = pagination[activeTab].current;
  const totalPages = pagination[activeTab].total;

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current: newPage }
    }));
  };

  const filterRef = useRef<HTMLDivElement>(null);

  // THIS IS THE MAGIC: Give the store a way to refresh all tables instantly
  useEffect(() => {
    const refreshCurrentTable = () => {
      setPagination(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab] } // triggers re-render
      }));
    };

    setRefetchUsers(() => refreshCurrentTable);
  }, [activeTab, setRefetchUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val as typeof activeTab);
      }}
      className="flex flex-col gap-[16px]"
    >
      {/* Header */}
      <section className="flex flex-col justify-between md:flex-row gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-[#171417] font-bold text-2xl leading-tight">
            User Management
          </h3>
          <p className="text-[#6B6969] text-sm md:text-base">
            Monitor, filter, and manage platform users effectively.
          </p>
        </div>

        {activeTab === "Admin Users" && (
          <button className="[background:var(--primary-radial)] px-6 flex items-center justify-center gap-3 text-white h-11 rounded-[20px] font-medium">
            <Plus size={16} />
            Invite Admin
          </button>
        )}
      </section>

      {/* Search + Filter Bar */}
      <div className="my-8 md:px-4">
        <div className="flex flex-col gap-6">
          <h3 className="text-[#171417] font-medium text-xl px-6">
            All {activeTab === "Admin Users" ? "Admins" : activeTab}
          </h3>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6">
            <UserTabSelector />

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <input
                  type="text"
                  placeholder="Search by name, email, service, or phone..."
                  className="w-full md:w-96 h-11 pl-12 pr-4 rounded-lg border border-[#B7B6B7] outline-none text-sm placeholder:text-[#6B6969]"
                />
                <Search size={18} className="absolute left-4 top-3.5 text-[#6B6969]" />
              </div>

              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 h-11 px-4 border border-[#B7B6B7] rounded-lg hover:bg-gray-50 transition"
              >
                <ListFilter size={18} />
                <span className="hidden md:inline text-[#171417] font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {activeTab === "Buyers" && showFilter && (
          <div ref={filterRef} className="mt-6 px-6">
            <BuyerFilters onApplyFilter={() => console.log("Applied")} />
          </div>
        )}

        {activeTab === "Sellers" && showFilter && (
          <div ref={filterRef} className="mt-6 px-6">
            <SellerFilters onApplyFilter={() => console.log("Applied")} />
          </div>
        )}
      </div>

      {/* Tables with Real Server-Side Pagination */}
      <div className="px-4 md:px-6">
        <TabsContent value="Buyers" className="mt-0">
          <div className="bg-white rounded-2xl border border-[#E8E3E3] overflow-hidden shadow-sm">
            <BuyersTable
              currentPage={currentPage}
              onTotalPagesChange={(total) =>
                setPagination(prev => ({
                  ...prev,
                  Buyers: { ...prev.Buyers, total }
                }))
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="Sellers" className="mt-0">
          <div className="bg-white rounded-2xl border border-[#E8E3E3] overflow-hidden shadow-sm">
            <SellersTable
              currentPage={currentPage}
              onTotalPagesChange={(total) =>
                setPagination(prev => ({
                  ...prev,
                  Sellers: { ...prev.Sellers, total }
                }))
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="Admin Users" className="mt-0">
          <div className="bg-white rounded-2xl border border-[#E8E3E3] overflow-hidden shadow-sm">
            <AdminTable
              currentPage={currentPage}
              onTotalPagesChange={(total) =>
                setPagination(prev => ({
                  ...prev,
                  "Admin Users": { ...prev["Admin Users"], total }
                }))
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>
      </div>

      {/* Modals */}
      {modalType === "openBuyer" && <BuyerDetails />}
      {modalType === "openSeller" && <SellerDetails />}
      {modalType === "openAdmin" && <AdminDetails />}
    </Tabs>
  );
};

export default UsersManagement;