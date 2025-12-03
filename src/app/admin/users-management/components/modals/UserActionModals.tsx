"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, TriangleAlert } from "lucide-react";

// ============== TYPES ==============
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  userName?: string;
}

interface SendWarningModalProps extends Omit<BaseModalProps, "onConfirm"> {
  warningMessage: string;
  setWarningMessage: (message: string) => void;
  onSend: () => void;
}

// ============== SEND WARNING MODAL ==============
export const SendWarningModal: React.FC<SendWarningModalProps> = ({
  isOpen,
  onClose,
  warningMessage,
  setWarningMessage,
  onSend,
  loading = false,
}) => {
  const handleClose = () => {
    onClose();
    setWarningMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg border border-[#EBEBEB]"
            style={{
              width: "633px",
              maxWidth: "90vw",
              height: "397px",
              padding: "32px",
              gap: "32px",
              borderRadius: "8px",
              boxShadow:
                "0px 20px 20px 0px #00000014, 0px 0px 2px 0px #0000001F",
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "140%",
                color: "#171417",
              }}
            >
              Send Warning Notification
            </h1>

            <div className="flex gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#FFF1C4] flex items-center justify-center">
                  <div className="w-7 h-7 bg-[#B08300] rounded-full flex items-center justify-center">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
                  Enter the warning message you&apos;d like to send. It will be
                  delivered as an in-app notification and an email to the user.
                </p>
                <label
                  className="font-medium block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                  }}
                >
                  Message *
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Write a warning or notice for this user."
                  className="w-full h-[123px] resize-none rounded-xl border border-[#B2B2B4] px-4 py-3 text-base"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-8 mt-auto">
              <button
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={!warningMessage.trim() || loading}
                className="text-white font-medium rounded-[20px] disabled:opacity-50 flex items-center justify-center"
                style={{
                  width: "268.5px",
                  height: "48px",
                  padding: "16px 24px",
                  background: warningMessage.trim()
                    ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                    : "#ACC5CF",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading ? "Sending..." : "Send Warning"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============== REACTIVATE MODAL ==============
export const ReactivateModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  userName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg border border-gray-200 flex flex-col"
            style={{
              width: "633px",
              maxWidth: "90vw",
              height: "250px",
              padding: "32px",
              gap: "16px",
              borderRadius: "8px",
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h1
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: "#171417",
              }}
            >
              Reactivate User Account
            </h1>
            <div className="flex items-start gap-4">
              <div className="relative w-8 h-8 mt-1">
                <div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: "#1FC16B" }}
                />
                <div className="absolute bg-[#1FC16B] rounded-full w-6.5 h-6.5 top-0.5 left-0.5 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "16px",
                }}
              >
                Do you want to reactivate {userName ? `${userName}'s` : "this"}{" "}
                account?
              </p>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#454345",
              }}
            >
              This user&apos;s account is currently deactivated. Reactivating will
              restore their full access to the platform.
            </p>
            <div className="flex justify-end gap-6 mt-auto">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="text-white font-medium rounded-[20px] flex items-center justify-center"
                style={{
                  width: "268.5px",
                  height: "48px",
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)",
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

// ============== DEACTIVATE MODAL ==============
export const DeactivateModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  userName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-[633px] max-w-[90vw] h-[250px] p-8 flex flex-col justify-between shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <TriangleAlert size={24} className="text-red-600" />
                </div>
                <p className="text-gray-800 text-sm">
                  You&apos;re about to deactivate{" "}
                  {userName ? `${userName}'s` : "this user's"} account. They
                  will no longer have access to the platform.
                </p>
              </div>
              <p className="text-gray-900 font-medium text-base">
                Are you sure you want to proceed?
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Yes, Deactivate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};