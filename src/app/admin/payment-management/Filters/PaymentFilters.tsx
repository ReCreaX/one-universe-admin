"use client";
import { ChevronUp, X, Check } from "lucide-react";
import React, { useState } from "react";
import { PaymentFilterState } from "@/store/paymentManagementStore";

interface PaymentFiltersProps {
  onApplyFilter: (filters: PaymentFilterState) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ onApplyFilter }) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState<PaymentFilterState["status"]>(undefined);
  const [selectedUserType, setSelectedUserType] = useState<PaymentFilterState["userType"]>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const statusOptions = [
    { label: "Paid", value: "PAID" as const },
    { label: "Pending", value: "PENDING" as const },
    { label: "Disputed", value: "DISPUTED" as const },
    { label: "Pending Refund", value: "PENDING REFUND" as const },
    { label: "Refunded", value: "REFUNDED" as const },
    { label: "Failed", value: "FAILED" as const },
  ];

  const userTypeOptions = [
    { label: "Buyer", value: "BUYER" as const },
    { label: "Seller", value: "SELLER" as const },
  ];

  const handleStatusSelect = (optionValue: typeof selectedStatus) => {
    setSelectedStatus(selectedStatus === optionValue ? undefined : optionValue);
    setStatusOpen(false);
  };

  const handleUserTypeSelect = (optionValue: typeof selectedUserType) => {
    setSelectedUserType(selectedUserType === optionValue ? undefined : optionValue);
    setUserTypeOpen(false);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setFromDate(date);
    if (toDate && date && toDate < date) {
      setToDate(undefined);
    }
  };

  const handleClearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedStatus(undefined);
    setSelectedUserType(undefined);
    setMinAmount("");
    setMaxAmount("");
  };

  const handleApplyFilter = () => {
    onApplyFilter({
      status: selectedStatus,
      userType: selectedUserType,
      fromDate,
      toDate,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    });
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isButtonDisabled = !selectedStatus && !selectedUserType && !fromDate && !toDate && !minAmount && !maxAmount;

  return (
    <section className="w-[476px] bg-white px-6 py-8 rounded-2xl flex flex-col gap-6 absolute right-0 top-[calc(100%+8px)] z-50 shadow-lg border border-[#E8E3E3] max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-[#E8E3E3] pb-3">
        <h3 className="text-[#171417] text-[1.25rem] font-bold">Filter</h3>
        <button
          className="flex items-center gap-2 text-[#FB3748] hover:text-[#d32f3e] transition"
          type="button"
          onClick={handleClearFilter}
        >
          <X className="w-5 h-5" />
          <span>Clear Filter</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Payment Status */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">
            Payment Status
          </h3>
          <div className="relative w-full">
            <button
              onClick={() => {
                setStatusOpen(!statusOpen);
                setUserTypeOpen(false);
              }}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              type="button"
            >
              <span className={selectedStatus ? "text-[#3C3C3C]" : "text-[#757575]"}>
                {selectedStatus
                  ? statusOptions.find((o) => o.value === selectedStatus)?.label
                  : "Select Status"}
              </span>
              <ChevronUp
                className={`w-5 h-5 transition-transform duration-200 ${
                  statusOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-[60] max-h-[240px] overflow-y-auto">
                {statusOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== statusOptions.length - 1
                        ? "border-b border-[#E5E5E5]"
                        : ""
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded-[4px] transition-colors ${
                        selectedStatus === option.value
                          ? "bg-[#04171F] border-[#04171F]"
                          : "border-[#757575] bg-white"
                      }`}
                    >
                      {selectedStatus === option.value && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Type */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">
            User Type
          </h3>
          <div className="relative w-full">
            <button
              onClick={() => {
                setUserTypeOpen(!userTypeOpen);
                setStatusOpen(false);
              }}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              type="button"
            >
              <span className={selectedUserType ? "text-[#3C3C3C]" : "text-[#757575]"}>
                {selectedUserType
                  ? userTypeOptions.find((o) => o.value === selectedUserType)?.label
                  : "Select User Type"}
              </span>
              <ChevronUp
                className={`w-5 h-5 transition-transform duration-200 ${
                  userTypeOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {userTypeOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-[60]">
                {userTypeOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleUserTypeSelect(option.value)}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== userTypeOptions.length - 1
                        ? "border-b border-[#E5E5E5]"
                        : ""
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded-[4px] transition-colors ${
                        selectedUserType === option.value
                          ? "bg-[#04171F] border-[#04171F]"
                          : "border-[#757575] bg-white"
                      }`}
                    >
                      {selectedUserType === option.value && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount Range */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">
            Amount Range (₦)
          </h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-1/2 p-2 bg-white border border-[#B5B1B1] rounded-[8px] text-sm font-normal hover:border-gray-400 transition-colors focus:outline-none focus:border-[#04171F]"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-1/2 p-2 bg-white border border-[#B5B1B1] rounded-[8px] text-sm font-normal hover:border-gray-400 transition-colors focus:outline-none focus:border-[#04171F]"
            />
          </div>
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">From</h3>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(fromDate)}
              onChange={handleFromDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] text-sm font-normal hover:border-gray-400 transition-colors focus:outline-none focus:border-[#04171F]"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">To</h3>
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(toDate)}
              onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : undefined)}
              min={formatDateForInput(fromDate)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] text-sm font-normal hover:border-gray-400 transition-colors focus:outline-none focus:border-[#04171F]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className={`cursor-pointer bg-gradient-to-r from-[#154751] to-[#04171F] text-[#FDFDFD] font-medium px-6 py-4 rounded-[20px] transition ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          }`}
          type="button"
          disabled={isButtonDisabled}
          onClick={handleApplyFilter}
        >
          Apply Filter
        </button>
      </div>
    </section>
  );
};

export default PaymentFilters;