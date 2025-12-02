"use client";
import { ChevronUp, X, Calendar, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { paymentManagementStore, PaymentFilterState, PaymentStatus } from "@/store/paymentManagementStore";

interface PaymentFiltersProps {
  onApplyFilter: (filters: PaymentFilterState) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ onApplyFilter }) => {
  const { filters, clearFilters } = paymentManagementStore();
  
  const [statusOpen, setStatusOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | undefined>(filters.status);
  const [selectedUserType, setSelectedUserType] = useState<"BUYER" | "SELLER" | undefined>(filters.userType);
  const [fromDate, setFromDate] = useState<Date | undefined>(filters.fromDate);
  const [toDate, setToDate] = useState<Date | undefined>(filters.toDate);
  const [minAmount, setMinAmount] = useState<string>(filters.minAmount?.toString() || "");
  const [maxAmount, setMaxAmount] = useState<string>(filters.maxAmount?.toString() || "");

  // Sync with store when filters change externally
  useEffect(() => {
    setSelectedStatus(filters.status);
    setSelectedUserType(filters.userType);
    setFromDate(filters.fromDate);
    setToDate(filters.toDate);
    setMinAmount(filters.minAmount?.toString() || "");
    setMaxAmount(filters.maxAmount?.toString() || "");
  }, [filters]);

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

  const handleStatusSelect = (optionValue: PaymentStatus) => {
    setSelectedStatus(selectedStatus === optionValue ? undefined : optionValue);
    setStatusOpen(false);
  };

  const handleUserTypeSelect = (optionValue: "BUYER" | "SELLER") => {
    setSelectedUserType(selectedUserType === optionValue ? undefined : optionValue);
    setUserTypeOpen(false);
  };

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date ?? undefined);
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
    clearFilters();
  };

  const CustomInput = React.forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void; placeholder?: string }
  >(({ value, onClick, placeholder }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
      type="button"
    >
      <span className={value ? "text-[#3C3C3C]" : "text-[#757575]"}>
        {value || placeholder}
      </span>
      <Calendar className="w-5 h-5 text-[#757575]" />
    </button>
  ));

  CustomInput.displayName = "CustomInput";

  const isButtonDisabled = !selectedStatus && !selectedUserType && !fromDate && !toDate && !minAmount && !maxAmount;

  return (
    <>
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #e5e5e5;
          border-radius: 12px 12px 0 0;
          padding-top: 12px;
        }
        .react-datepicker__current-month {
          font-size: 0.875rem;
          font-weight: 600;
          color: #05060d;
          margin-bottom: 8px;
        }
        .react-datepicker__day-name {
          color: #757575;
          font-size: 0.75rem;
          font-weight: 500;
          width: 2rem;
          line-height: 2rem;
          margin: 0.166rem;
        }
        .react-datepicker__day {
          width: 2rem;
          line-height: 2rem;
          margin: 0.166rem;
          color: #3c3c3c;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        .react-datepicker__day:hover {
          background-color: #f3f4f6;
          border-radius: 6px;
        }
        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-weight: 500;
        }
        .react-datepicker__day--selected:hover {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          opacity: 0.9;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: transparent;
        }
        .react-datepicker__day--today {
          border: 1px solid #04171f;
          font-weight: 500;
          background-color: white;
        }
        .react-datepicker__day--today:hover {
          background-color: #f3f4f6;
        }
        .react-datepicker__day--disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        .react-datepicker__day--disabled:hover {
          background-color: transparent;
        }
        .react-datepicker__navigation {
          top: 14px;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #3c3c3c;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: #05060d;
        }
        .react-datepicker__month {
          margin: 0.8rem;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
      <section className="w-[476px] bg-white px-6 py-8 rounded-2xl flex flex-col gap-6 absolute right-0 z-50 shadow-lg border border-[#E8E3E3]">
        <div className="flex items-center justify-between border-b border-[#E8E3E3] pb-3">
          <h3 className="text-[#171417] text-[1.25rem] font-bold">Filter</h3>
          <button
            className="flex items-center gap-2 text-[#FB3748] hover:text-[#d32f3e] transition"
            type="button"
            onClick={handleClearFilter}
          >
            <X />
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
                onClick={() => setStatusOpen(!statusOpen)}
                className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
                type="button"
              >
                <span className={selectedStatus ? "" : "text-[#757575]"}>
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-10 max-h-[240px] overflow-y-auto">
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
                onClick={() => setUserTypeOpen(!userTypeOpen)}
                className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
                type="button"
              >
                <span className={selectedUserType ? "" : "text-[#757575]"}>
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-10">
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
            <DatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              maxDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Select date"
              customInput={<CustomInput />}
              popperPlacement="bottom-start"
              wrapperClassName="w-full"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[#05060D] font-medium text-[1rem]">To</h3>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date ?? undefined)}
              minDate={fromDate}
              maxDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Select date"
              customInput={<CustomInput />}
              popperPlacement="bottom-start"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className={`cursor-pointer [background:var(--primary-radial)] text-[#FDFDFD] font-medium px-6 py-4 rounded-[20px] ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            disabled={isButtonDisabled}
            onClick={() =>
              onApplyFilter({
                status: selectedStatus,
                userType: selectedUserType,
                fromDate,
                toDate,
                minAmount: minAmount ? parseFloat(minAmount) : undefined,
                maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
              })
            }
          >
            Apply Filter
          </button>
        </div>
      </section>
    </>
  );
};

export default PaymentFilters;