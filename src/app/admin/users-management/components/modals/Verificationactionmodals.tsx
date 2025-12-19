"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ApproveVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

interface RejectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export const ApproveVerificationModal: React.FC<ApproveVerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[8px] w-full max-w-[568px] shadow-lg p-6 md:p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header with Icon */}
            <div className="flex gap-6 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#C0F8DA]">
                <CheckCircle size={32} className="text-[#1FC16B]" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-[#171417] font-bold text-xl">Approve Verification</h2>
                <p className="text-[#454345] font-regular text-sm">
                  You are about to approve this user's verification.
                </p>
                <p className="text-[#171417] font-regular text-base">
                  This confirms that the submitted details match the third party verification records.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 rounded-[20px] border border-gradient-to-r from-[#154751] to-[#04171F] text-[#154751] font-medium text-base hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 rounded-[20px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {loading ? "Processing..." : "Approve Verification"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RejectVerificationModal: React.FC<RejectVerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirm = () => {
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason);
      setRejectionReason("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[8px] w-full max-w-[686px] shadow-lg p-6 md:p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header with Icon */}
            <div className="flex gap-6 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#FFC4C9]">
                <AlertCircle size={32} className="text-[#FB3748]" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-[#171417] font-bold text-xl">Reject Verification</h2>
                <p className="text-[#454345] font-regular text-sm">
                  You are about to reject this user's verification.
                </p>
                <p className="text-[#171417] font-regular text-base">
                  This confirms that the submitted details match the third party verification records.
                </p>
              </div>
            </div>

            {/* Rejection Reason Input */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[#171417] font-medium text-base">
                Reason for Rejection <span className="text-[#D84040]">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                disabled={loading}
                className="w-full px-4 py-3 rounded-[8px] border border-[#B2B2B4] text-[#171417] placeholder-[#949394] font-regular text-base focus:outline-none focus:ring-2 focus:ring-[#154751] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 rounded-[20px] border border-gradient-to-r from-[#154751] to-[#04171F] text-[#154751] font-medium text-base hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !rejectionReason.trim()}
                className="flex items-center justify-center px-6 py-3 rounded-[20px] bg-[#DA8E85] text-white font-medium text-base hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {loading ? "Processing..." : "Reject Verification"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};