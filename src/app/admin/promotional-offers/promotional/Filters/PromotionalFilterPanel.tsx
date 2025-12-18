// app/admin/settings/Filters/PromotionalFilterPanel.tsx
"use client";

import { ChevronUp, X, Calendar, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePromotionalStore } from "@/store/promotionalStore";

interface PromotionalFilterPanelProps {
  onApplyFilter: () => void;
}

// ✅ DEFINE EXACT TYPES FOR STRICT TYPE CHECKING
type StatusType = "Active" | "Draft" | "Expired";
type TypeValue = "Discount" | "Free Shipping" | "Bundle" | "Cashback";
type EligibleUserType = "All Users" | "Premium Members" | "First-time Buyers" | "Existing Users";

const PromotionalFilterPanel: React.FC<PromotionalFilterPanelProps> = ({ onApplyFilter }) => {
  // ✅ FIXED: Use different name to avoid conflict with PromotionalFilter state
  const { PromotionalFilter: filterState, setPromotionalFilter, clearPromotionalFilter } = usePromotionalStore();

  // Local state — fully typed with exact literal types
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | undefined>(
    (filterState.status as StatusType) ?? undefined
  );

  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<TypeValue[]>(
    (filterState.type as TypeValue[]) ?? []
  );

  const [eligibleOpen, setEligibleOpen] = useState(false);
  const [selectedEligible, setSelectedEligible] = useState<EligibleUserType[]>(
    (filterState.eligibleUser as EligibleUserType[]) ?? []
  );

  const [fromDate, setFromDate] = useState<Date | undefined>(filterState.fromDate ?? undefined);
  const [toDate, setToDate] = useState<Date | undefined>(filterState.toDate ?? undefined);

  // Sync store → local state
  useEffect(() => {
    setSelectedStatus((filterState.status as StatusType) ?? undefined);
    setSelectedTypes((filterState.type as TypeValue[]) ?? []);
    setSelectedEligible((filterState.eligibleUser as EligibleUserType[]) ?? []);
    setFromDate(filterState.fromDate ?? undefined);
    setToDate(filterState.toDate ?? undefined);
  }, [filterState]);

  // Options - with exact literal types
  const statusOptions: { label: string; value: StatusType }[] = [
    { label: "Active", value: "Active" },
    { label: "Draft", value: "Draft" },
    { label: "Expired", value: "Expired" },
  ];

  const typeOptions: { label: string; value: TypeValue }[] = [
    { label: "Discount", value: "Discount" },
    { label: "Free Shipping", value: "Free Shipping" },
    { label: "Bundle", value: "Bundle" },
    { label: "Cashback", value: "Cashback" },
  ];

  const eligibleOptions: { label: string; value: EligibleUserType }[] = [
    { label: "All Users", value: "All Users" },
    { label: "Premium Members", value: "Premium Members" },
    { label: "First-time Buyers", value: "First-time Buyers" },
    { label: "Existing Users", value: "Existing Users" },
  ];

  // Handlers with type safety
  const toggleType = (val: TypeValue) => {
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const toggleEligible = (val: EligibleUserType) => {
    setSelectedEligible((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date ?? undefined);
    if (toDate && date && toDate < date) setToDate(undefined);
  };

  const handleClearFilter = () => {
    setSelectedStatus(undefined);
    setSelectedTypes([]);
    setSelectedEligible([]);
    setFromDate(undefined);
    setToDate(undefined);
    clearPromotionalFilter();
  };

  const handleApplyFilter = () => {
    setPromotionalFilter({
      status: selectedStatus,
      type: selectedTypes.length ? selectedTypes : undefined,
      eligibleUser: selectedEligible.length ? selectedEligible : undefined,
      fromDate,
      toDate,
    });
    onApplyFilter(); // Close the panel
  };

  // Fixed CustomInput
  const CustomInput = React.forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void; placeholder?: string }>(
    ({ value, onClick, placeholder }, ref) => (
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
    )
  );
  CustomInput.displayName = "CustomInput";

  const hasFilter =
    !!selectedStatus ||
    selectedTypes.length > 0 ||
    selectedEligible.length > 0 ||
    !!fromDate ||
    !!toDate;

  return (
    <>
      <style jsx global>{`
        /* Your original datepicker styles — untouched */
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

      <section className="w-[476px] bg-white px-6 py-8 rounded-2xl flex flex-col gap-6 fixed top-20 right-6 z-50 shadow-lg border border-[#E8E3E3] max-h-[calc(100vh-10rem)] overflow-y-auto">
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

        {/* Status */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">Status</h3>
          <div className="relative w-full">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              type="button"
            >
              <span className={selectedStatus ? "" : "text-[#757575]"}>
                {selectedStatus || "Select Status"}
              </span>
              <ChevronUp className={`w-5 h-5 transition-transform duration-200 ${statusOpen ? "" : "rotate-180"}`} />
            </button>

            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-10">
                {statusOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(selectedStatus === option.value ? undefined : option.value);
                      setStatusOpen(false);
                    }}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== statusOptions.length - 1 ? "border-b border-[#E5E5E5]" : ""
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded-[4px] transition-colors ${
                        selectedStatus === option.value ? "bg-[#04171F] border-[#04171F]" : "border-[#757575] bg-white"
                      }`}
                    >
                      {selectedStatus === option.value && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">Type</h3>
          <div className="relative w-full">
            <button
              onClick={() => setTypeOpen(!typeOpen)}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              type="button"
            >
              <span className={selectedTypes.length ? "" : "text-[#757575]"}>
                {selectedTypes.length ? `${selectedTypes.length} selected` : "Select Type"}
              </span>
              <ChevronUp className={`w-5 h-5 transition-transform duration-200 ${typeOpen ? "" : "rotate-180"}`} />
            </button>

            {typeOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-10">
                {typeOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => toggleType(option.value)}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== typeOptions.length - 1 ? "border-b border-[#E5E5E5]" : ""
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded-[4px] transition-colors ${
                        selectedTypes.includes(option.value) ? "bg-[#04171F] border-[#04171F]" : "border-[#757575] bg-white"
                      }`}
                    >
                      {selectedTypes.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Eligible Users */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[#05060D] font-medium text-[1rem]">Eligible Users</h3>
          <div className="relative w-full">
            <button
              onClick={() => setEligibleOpen(!eligibleOpen)}
              className="w-full p-2 bg-white border border-[#B5B1B1] rounded-[8px] flex items-center justify-between text-sm font-normal hover:border-gray-400 transition-colors"
              type="button"
            >
              <span className={selectedEligible.length ? "" : "text-[#757575]"}>
                {selectedEligible.length ? `${selectedEligible.length} selected` : "Select Users"}
              </span>
              <ChevronUp className={`w-5 h-5 transition-transform duration-200 ${eligibleOpen ? "" : "rotate-180"}`} />
            </button>

            {eligibleOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden shadow-lg z-10">
                {eligibleOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => toggleEligible(option.value)}
                    className={`w-full px-2 h-[38px] flex items-center gap-2 text-left hover:bg-gray-50 transition-colors ${
                      index !== eligibleOptions.length - 1 ? "border-b border-[#E5E5E5]" : ""
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center rounded-[4px] transition-colors ${
                        selectedEligible.includes(option.value) ? "bg-[#04171F] border-[#04171F]" : "border-[#757575] bg-white"
                      }`}
                    >
                      {selectedEligible.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[1rem] leading-[140%] font-normal text-[#3C3C3C]">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Pickers */}
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

        {/* Apply Button */}
        <div className="flex justify-end">
          <button
            className={`cursor-pointer [background:var(--primary-radial)] text-[#FDFDFD] font-medium px-6 py-4 rounded-[20px] ${
              !hasFilter ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            disabled={!hasFilter}
            onClick={handleApplyFilter}
          >
            Apply Filter
          </button>
        </div>
      </section>
    </>
  );
};

export default PromotionalFilterPanel;