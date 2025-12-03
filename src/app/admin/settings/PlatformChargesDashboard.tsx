"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, message, onClose }) => {
  const icons = {
    success: <CheckCircle size={24} className="text-[#1FC16B]" />,
    error: <XCircle size={24} className="text-[#D84040]" />,
    warning: <AlertCircle size={24} className="text-[#F9CB43]" />,
  };

  const borders = {
    success: "border-b-2 border-b-[#1FC16B]",
    error: "border-b-2 border-b-[#D84040]",
    warning: "border-b-2 border-b-[#F9CB43]",
  };

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[473px] bg-white rounded-lg shadow-xl ${borders[type]} animate-in slide-in-from-top-2`}>
      <div className="flex gap-4 px-4 py-3">
        {icons[type]}
        <div className="flex-1">
          <h4 className="font-dm-sans font-bold text-base text-[#06070E]">{title}</h4>
          <p className="font-dm-sans text-sm text-[#454345] mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-[#B2B2B4] hover:text-[#171417]">
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
};

const PlatformChargesDashboard = () => {
  const [fee, setFee] = useState("");
  const [toast, setToast] = useState<ToastProps | null>(null);

  const currentFee = 5; // Default platform fee

  const handleUpdate = () => {
    const num = parseFloat(fee);

    if (!fee || isNaN(num) || num < 1 || num > 100) {
      setToast({
        type: "warning",
        title: "Invalid Input",
        message: "Platform charge must be between 1% and 100%.",
        onClose: () => setToast(null),
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.2) {
        // Success 80% of the time
        setToast({
          type: "success",
          title: "Update Successful",
          message: `Platform fee updated successfully to ${num}%.`,
          onClose: () => setToast(null),
        });
      } else {
        setToast({
          type: "error",
          title: "Update Failed",
          message: "Unable to update platform fee. Please try again later.",
          onClose: () => setToast(null),
        });
      }
    }, 800);
  };

  const isValid = fee === "" || (!isNaN(parseFloat(fee)) && parseFloat(fee) >= 1 && parseFloat(fee) <= 100);
  const isActive = fee !== "" && isValid && parseFloat(fee) !== currentFee;

  return (
    <div className="w-full space-y-8 px-5 md:px-0">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-dm-sans font-medium text-xl text-[#171417]">
          Platform Charge Management
        </h2>
        <p className="font-dm-sans text-sm md:text-base text-[#6B6969]">
          Admins can adjust the platform service fee applied to all payouts.
        </p>
      </div>

      {/* Current Fee Card */}
      <div className="bg-[#FFFCFC] border-l-4 border-l-[#154751] rounded-r-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-dm-sans text-xs text-[#6B6969]">Current Platform Fee</p>
            <p className="font-dm-sans font-bold text-xl text-[#171417] mt-1">
              {currentFee}% <span className="text-sm font-normal text-[#6B6969]">(default)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="font-dm-sans font-medium text-base text-[#05060D]">
            New Platform Fee (%)
          </label>
          <div className="mt-3">
            <input
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
              placeholder="Enter percentage"
              className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-center focus:outline-none focus:border-[#154751] transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={!isActive}
          className={`w-full h-12 rounded-[20px] font-dm-sans font-medium text-base text-white flex items-center justify-center transition-all ${
            isActive
              ? "cursor-pointer shadow-lg"
              : "cursor-not-allowed opacity-70"
          }`}
          style={{
            background: isActive
              ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
              : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
          }}
        >
          Update Platform Fee
        </button>
      </div>

      {/* Toast Notification */}
      {toast && <Toast {...toast} />}
    </div>
  );
};

export default PlatformChargesDashboard;