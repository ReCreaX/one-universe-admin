"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react"; // Using Check icon for reactivate

type ConfirmActionModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const ConfirmActionModal = ({
  isOpen,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmActionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* EXACT DESIGN MATCH – 633×250px, 32px padding, 32px gap */}
          <motion.div
            className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"
            style={{
              width: "633px",
              height: "250px",
              padding: "32px",
              gap: "32px",
              borderRadius: "8px",
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            {/* Title – Exact text & specs */}
            <h2
              className="text-gray-900 font-normal"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                lineHeight: "140%",
                fontWeight: 400,
                width: "385px",
                height: "22px",
              }}
            >
              Do you want to reactivate this account?
            </h2>

            {/* Icon + Message Row */}
            <div className="flex items-center gap-4">
              {/* Outline Circle (32×32) */}
              <div className="relative w-8 h-8 flex-shrink-0">
                {/* Outer ring – Variant="Outline" */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-[#1FC16B]"
                  style={{
                    width: "32.00027084350586px",
                    height: "32.00027084350586px",
                  }}
                />
                {/* Inner filled green circle */}
                <div
                  className="absolute rounded-full bg-[#1FC16B] flex items-center justify-center"
                  style={{
                    width: "26.000221252441406px",
                    height: "26.000221252441406px",
                    top: "3px",
                    left: "3px",
                  }}
                >
                  <Check size={16} className="text-white" />
                </div>
              </div>

              {/* Message */}
              <p
                className="text-gray-800 leading-[140%]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                This user’s account is currently deactivated. Reactivating will restore their full access to the platform.
              </p>
            </div>

            {/* Buttons – Now perfectly inside container */}
            <div className="flex justify-end items-center gap-6">
              {/* Cancel – Outline */}
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                onClick={onCancel}
              >
                Cancel
              </button>

              {/* Yes, Reactivate – EXACT design specs */}
              <button
                onClick={onConfirm}
                disabled={loading}
                className="text-white font-medium text-sm rounded-[20px] disabled:opacity-50 transition flex items-center justify-center"
                style={{
                  width: "268.5px",
                  height: "48px",
                  padding: "16px 24px",
                  gap: "8px",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading ? "Processing..." : "Yes, Reactivate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmActionModal;