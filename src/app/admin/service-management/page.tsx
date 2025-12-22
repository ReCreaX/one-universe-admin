"use client";
import React, { useState, useEffect } from "react";
import { MoveUp, Search, Check, X } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import EmptyApprovedService from "../components/empty-service/EmptyApprovedService";
import EmptyRejectedService from "../components/empty-service/EmptyRejectedService";
import EmptyPendingService from "../components/empty-service/EmptyPendingService";
import PendingTable from "./Tabs/PendingTabs/PendingTable";
import ApprovedTable from "./Tabs/ApprovalTabs/ApprovedTable";
import RejectedTable from "./Tabs/RejectedTabs/RejectedTable";
import DateRangePicker from "./Modal/DateRangePicker";
import Pagination from "../../../components/ui/Pagination";
import RejectionModal from "./Modal/RejectionModal";
import ApprovalModal from "./Modal/ApprovalModal";
import Toast from "./Toast";
import { useServiceStore } from "../../../store/useServiceStore";
import { approveService, rejectService, bulkApprove, bulkReject } from "@/services/serviceManagement";
import type { ServiceStatus, Service } from "@/services/serviceManagement";

interface ToastNotification {
  id: string;
  type: "success" | "error";
  message: string;
}

const ITEMS_PER_PAGE = 10;

export default function ServiceManagementPage() {
  const {
    services,
    activeTab,
    selectedServices,
    searchQuery,
    dateRange,
    loading,
    error,
    fetchServices,
    setActiveTab,
    toggleService,
    toggleAllServices,
    setSearchQuery,
    setDateRange,
    clearSelection,
    setLoading,
    getFilteredServices,
  } = useServiceStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Rejection modal state
  const [rejectModalState, setRejectModalState] = useState<{
    isOpen: boolean;
    serviceIds: string[];
    serviceName: string;
    providerName: string;
  }>({
    isOpen: false,
    serviceIds: [],
    serviceName: "",
    providerName: "",
  });

  // Approval modal state
  const [approvalModalState, setApprovalModalState] = useState<{
    isOpen: boolean;
    serviceIds: string[];
    serviceName: string;
    providerName: string;
  }>({
    isOpen: false,
    serviceIds: [],
    serviceName: "",
    providerName: "",
  });

  // Load services on mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showToast = (type: "success" | "error", message: string): void => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Get filtered services
  const filteredServices: Service[] = getFilteredServices();

  // Pagination logic
  const totalItems: number = filteredServices.length;
  const totalPages: number = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex: number = startIndex + ITEMS_PER_PAGE;
  const paginatedServices: Service[] = filteredServices.slice(startIndex, endIndex);

  const handleTabChange = (tab: ServiceStatus): void => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string): void => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null): void => {
    setDateRange({ start, end });
    setCurrentPage(1);
  };

  // Single approve - opens modal
  const handleOpenApprovalModal = (service: Service): void => {
    const sellerUser = service.sellerProfiles[0]?.user;
    const providerName = sellerUser?.fullName || "Unknown Seller";

    setApprovalModalState({
      isOpen: true,
      serviceIds: [service.id],
      serviceName: service.title,
      providerName,
    });
  };

  // Bulk approve - opens modal
  const handleOpenBulkApprovalModal = (): void => {
    if (selectedServices.length === 0) return;

    const firstService = paginatedServices.find((s: Service) => selectedServices.includes(s.id));
    if (!firstService) return;

    const sellerUser = firstService.sellerProfiles[0]?.user;
    const providerName = sellerUser?.fullName || "Unknown Seller";

    setApprovalModalState({
      isOpen: true,
      serviceIds: selectedServices,
      serviceName: firstService.title,
      providerName,
    });
  };

  // Handle approval confirm from modal
  // NOTE: Error handling is done in the ApprovalModal component
  // This function should NOT have try-catch, so errors bubble up to the modal
  const handleApprovalConfirm = async (): Promise<void> => {
    if (approvalModalState.serviceIds.length === 0) return;

    if (approvalModalState.serviceIds.length === 1) {
      // Single approve
      await approveService(approvalModalState.serviceIds[0]);
      showToast("success", "Service approved successfully");
    } else {
      // Bulk approve
      await bulkApprove(approvalModalState.serviceIds);
      showToast("success", `${approvalModalState.serviceIds.length} services approved successfully`);
    }

    // Re-fetch to ensure consistency
    await fetchServices();
    clearSelection();

    // Close modal
    setApprovalModalState({
      isOpen: false,
      serviceIds: [],
      serviceName: "",
      providerName: "",
    });
  };

  // Close approval modal
  const handleCloseApprovalModal = (): void => {
    setApprovalModalState({
      isOpen: false,
      serviceIds: [],
      serviceName: "",
      providerName: "",
    });
  };

  // Open reject modal - for bulk or single
  const handleOpenRejectModal = (serviceIds?: string[]): void => {
    const ids = serviceIds || selectedServices;
    if (ids.length === 0) return;

    const firstService = paginatedServices.find((s: Service) => ids.includes(s.id));
    if (!firstService) return;

    const sellerUser = firstService.sellerProfiles[0]?.user;
    const providerName = sellerUser?.fullName || "Unknown Seller";

    setRejectModalState({
      isOpen: true,
      serviceIds: ids,
      serviceName: firstService.title,
      providerName,
    });
  };

  // Handle reject confirm from modal
  // NOTE: Error handling is done in the RejectionModal component
  // This function should NOT have try-catch, so errors bubble up to the modal
  const handleRejectConfirm = async (reason: string): Promise<void> => {
    if (rejectModalState.serviceIds.length === 0) return;

    if (rejectModalState.serviceIds.length === 1) {
      // Single reject
      await rejectService(rejectModalState.serviceIds[0], reason);
      showToast("success", "Service rejected successfully");
    } else {
      // Bulk reject
      await bulkReject(rejectModalState.serviceIds, reason);
      showToast("success", `${rejectModalState.serviceIds.length} services rejected successfully`);
    }

    // Re-fetch to ensure consistency
    await fetchServices();
    clearSelection();

    // Close modal
    setRejectModalState({
      isOpen: false,
      serviceIds: [],
      serviceName: "",
      providerName: "",
    });
  };

  // Close reject modal
  const handleCloseRejectModal = (): void => {
    setRejectModalState({
      isOpen: false,
      serviceIds: [],
      serviceName: "",
      providerName: "",
    });
  };

  const getServiceCount = (status: ServiceStatus): number => {
    const statusMap: Record<ServiceStatus, string> = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };
    return services.filter((s: Service) => s.status === statusMap[status]).length;
  };

  const stats = [
    {
      label: "Pending Requests",
      color: "bg-gradient-to-br from-purple-500 to-blue-600",
      total: getServiceCount("Pending"),
      growth: 12,
      growthType: "positive" as const,
    },
    {
      label: "Approved Services",
      color: "bg-[#67A344]",
      total: getServiceCount("Approved"),
      growth: 8,
      growthType: "positive" as const,
    },
    {
      label: "Rejected Services",
      color: "bg-[#D84040]",
      total: getServiceCount("Rejected"),
      growth: 3,
      growthType: "neutral" as const,
    },
  ];

  const hasSelection: boolean = selectedServices.length > 0;

  return (
    <main className="flex flex-col flex-1 gap-2 md:gap-4">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h3 className="text-[#171417] font-bold text-[1.5rem] leading-[120%]">
          Service Management
        </h3>
        <p className="text-[#6B6969] hidden md:block text-[1rem] leading-[140%]">
          Overview and management of all service requests
        </p>
      </section>

      {/* Stats Cards - Dashboard Style */}
      <section className="grid grid-cols-1 min-[410px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-4 my-6">
        {stats.map(({ label, color, total, growth, growthType }) => {
          const isPositive = growthType === "positive";
          return (
            <aside
              key={label}
              className="h-auto min-h-[123px] border border-[#E8E3E3] rounded-[8px] py-3 px-4 flex flex-col gap-2 bg-white"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className={`${color} size-[20px] p-1 rounded-[4px] flex items-center justify-center flex-shrink-0`}>
                    <Image
                      src="/logo/logo-vector.svg"
                      alt="Logo"
                      width={12}
                      height={11}
                    />
                  </div>
                  <h3 className="text-[#171417] font-medium leading-[140%] text-[0.875rem]">
                    {label}
                  </h3>
                </div>
                <h3 className="font-bold text-[#171417] text-[1.25rem] leading-[140%]">
                  {total.toLocaleString()}
                </h3>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <div
                  className={`p-0.5 rounded-[2px] ${
                    isPositive ? "bg-[#D7FFE9]" : "bg-[#E9BCB7]"
                  }`}
                >
                  <MoveUp
                    size={8}
                    className={`${
                      isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
                    }`}
                  />
                </div>
                <p className="text-[#171417] text-[0.75rem] font-normal leading-[140%]">
                  <span
                    className={
                      isPositive ? "text-[#1FC16B]" : "text-[#D00416]"
                    }
                  >
                    {isPositive ? "+" : "-"}
                    {growth}%
                  </span>{" "}
                  from last month
                </p>
              </div>
            </aside>
          );
        })}
      </section>

      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-40 space-y-3 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Service Requests</h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 -mx-8 px-8 mb-8 overflow-x-auto">
            {(["Pending", "Approved", "Rejected"] as ServiceStatus[]).map((tab) => {
              const count = getServiceCount(tab);
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab} Requests ({count})
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#154751] to-[#04171F] rounded-t-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, email, service, or phone..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-12 pl-12 pr-6 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#154751] focus:ring-4 focus:ring-[#154751]/10 transition"
                />
              </div>

              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>

            {hasSelection && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleOpenBulkApprovalModal}
                  disabled={loading}
                  className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  }}
                >
                  <Check size={16} />
                  Approve Selected ({selectedServices.length})
                </button>

                <button
                  onClick={() => handleOpenRejectModal()}
                  disabled={loading}
                  className="flex items-center gap-2 h-[38px] px-6 rounded-[20px] bg-[#D84040] text-white font-medium text-sm shadow-md hover:bg-[#c73838] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  Reject Selected ({selectedServices.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table + Pagination */}
        <div>
          {paginatedServices.length === 0 ? (
            <div className="py-20">
              {activeTab === "Pending" && <EmptyPendingService />}
              {activeTab === "Approved" && <EmptyApprovedService />}
              {activeTab === "Rejected" && <EmptyRejectedService />}
            </div>
          ) : (
            <>
              {activeTab === "Pending" && (
                <PendingTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAllServices}
                  onApprove={handleOpenApprovalModal}
                  onReject={handleOpenRejectModal}
                />
              )}
              {activeTab === "Approved" && (
                <ApprovedTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAllServices}
                />
              )}
              {activeTab === "Rejected" && (
                <RejectedTable
                  services={paginatedServices}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  onToggleAll={toggleAllServices}
                />
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isLoading={loading}
            />
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectModalState.isOpen}
        onClose={handleCloseRejectModal}
        onConfirm={handleRejectConfirm}
        serviceName={rejectModalState.serviceName}
        providerName={rejectModalState.providerName}
        isBulk={rejectModalState.serviceIds.length > 1}
        bulkCount={rejectModalState.serviceIds.length}
      />

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={approvalModalState.isOpen}
        onClose={handleCloseApprovalModal}
        onConfirm={handleApprovalConfirm}
        serviceName={approvalModalState.serviceName}
        providerName={approvalModalState.providerName}
        isBulk={approvalModalState.serviceIds.length > 1}
        bulkCount={approvalModalState.serviceIds.length}
      />
    </main>
  );
}