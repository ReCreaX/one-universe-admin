// components/StatusFilterDropdown.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface StatusFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: string[];
  onStatusChange: (status: string) => void;
}

const StatusFilterDropdown = ({
  isOpen,
  onClose,
  selectedStatuses,
  onStatusChange,
}: StatusFilterDropdownProps) => {
  if (!isOpen) return null;

  const statuses = [
    { label: "New", value: "New" },
    { label: "In Progress", value: "In Progress" },
    { label: "Resolved", value: "Resolved" },
  ];

  return (
    <div className="relative">
      {/* Dropdown Panel */}
      <div
        className="absolute top-10 right-0 w-[125px] bg-white rounded-lg shadow-lg border border-[#E5E5E5] overflow-hidden z-50"
        style={{
          boxShadow:
            "0px 8px 16px 0px #1A1A1A14, 0px 4px 6px 0px #1A1A1A14, 0px 1px 2px 0px #1A1A1F",
        }}
      >
        <div className="py-2">
          {statuses.map((status, index) => (
            <label
              key={status.value}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition
                ${index !== statuses.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
            >
              {/* Custom Checkbox */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status.value)}
                  onChange={() => onStatusChange(status.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                    ${
                      selectedStatuses.includes(status.value)
                        ? "border-[#154751] bg-[#154751]"
                        : "border-[#757575] bg-white"
                    }`}
                >
                  {selectedStatuses.includes(status.value) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
              </div>

              {/* Label */}
              <span className="font-dm-sans text-base text-[#3C3C3C]">
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Close on outside click */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
    </div>
  );
};

export default StatusFilterDropdown;