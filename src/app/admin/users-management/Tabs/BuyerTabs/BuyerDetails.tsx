"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, TriangleAlert, X, Check, AlertTriangle } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import axios from "axios";
import { useSession } from "next-auth/react";

const BuyerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { data: session } = useSession();

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [loadingDeactivate, setLoadingDeactivate] = useState(false);
  const [loadingReactivate, setLoadingReactivate] = useState(false);
  const [loadingWarning, setLoadingWarning] = useState(false);

  const isActive = selectedUser?.status === "ACTIVE";

  const handleSendWarning = async () => {
    if (!warningMessage.trim()) return;
    setLoadingWarning(true);
    try {
      await axios.post(
        `/api/admin/users/${selectedUser?.id}/warning`, // Update with your real endpoint
        { message: warningMessage },
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowWarningModal(false);
      setWarningMessage("");
    } catch (err) {
      console.error("Warning failed", err);
    } finally {
      setLoadingWarning(false);
    }
  };

  const handleConfirmReactivate = async () => {
    setLoadingReactivate(true);
    try {
      await axios.patch(
        `/api/admin/users/${selectedUser?.id}/reactivate`,
        {},
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowReactivateModal(false);
      closeModal();
    } catch (err) {
      console.error("Reactivate failed", err);
    } finally {
      setLoadingReactivate(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    setLoadingDeactivate(true);
    try {
      await axios.patch(
        `/api/admin/users/${selectedUser?.id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setShowDeactivateModal(false);
      closeModal();
    } catch (err) {
      console.error("Deactivate failed", err);
    } finally {
      setLoadingDeactivate(false);
    }
  };

  return (
    <AnimatePresence>
      {modalType === "openBuyer" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MAIN BUYER DETAILS MODAL */}
          <motion.div
            className="shadow-lg w-full md:w-[65%] bg-white md:rounded-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header */}
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button onClick={closeModal} className="text-gray-500 hover:text-black">
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">Buyer Profile</h2>
              </div>
              <button className="bg-gradient-to-r from-teal-600 to-cyan-700 py-1.5 px-6 text-white rounded-[36px] font-medium text-sm">
                View History
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-5">
                <div className="flex justify-between"><strong>Name</strong> <span>{selectedUser.fullName} <span className="bg-gray-200 px-2 py-1 rounded text-xs">Buyer</span></span></div>
                <div className="flex justify-between"><strong>Email</strong> <span>{selectedUser.email}</span></div>
                <div className="flex justify-between"><strong>Phone</strong> <span>{selectedUser.phone}</span></div>
                <div className="flex justify-between items-center"><strong>Verification</strong> <UserManagementStatusBadge status="VERIFIED" /></div>
                <div className="flex justify-between"><strong>Location</strong> <span>{selectedUser.location}</span></div>
                <div className="flex justify-between items-center"><strong>Status</strong> <UserManagementStatusBadge status={selectedUser.status} /></div>
                <div className="flex justify-between"><strong>Wallet</strong> <strong>₦23,450</strong></div>
                <div className="flex justify-between"><strong>Registered</strong> <span>May 11, 2025</span></div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-white pt-3 pb-12 flex justify-end px-8">
              <div className="flex gap-4 flex-wrap">
                {isActive ? (
                  <button onClick={() => setShowDeactivateModal(true)} className="bg-red-600 text-white px-6 py-2 rounded-full text-sm">
                    Deactivate Buyer
                  </button>
                ) : (
                  <button onClick={() => setShowReactivateModal(true)} className="bg-green-600 text-white px-6 py-2 rounded-full text-sm">
                    Reactivate Buyer
                  </button>
                )}
                <button onClick={() => setShowWarningModal(true)} className="border border-red-600 text-red-600 px-6 py-2 rounded-full text-sm">
                  Send Warning
                </button>
                <button onClick={closeModal} className="border border-gray-800 text-gray-800 px-6 py-2 rounded-full text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>

          {/* SEND WARNING MODAL – 100% FIGMA PERFECT */}
          <AnimatePresence>
            {showWarningModal && (
              <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                  className="bg-white rounded-lg border border-[#EBEBEB]"
                  style={{
                    width: "633px",
                    height: "397px",
                    padding: "32px",
                    gap: "32px",
                    borderRadius: "8px",
                    boxShadow: "0px 20px 20px 0px #00000014, 0px 0px 2px 0px #0000001F",
                  }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                >
                  <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "20px", lineHeight: "140%", color: "#171417" }}>
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
                      Enter the warning message you’d like to send. It will be delivered as an in-app notification and an email to the user.
                      <label className="font-medium" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
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
                      onClick={() => {
                        setShowWarningModal(false);
                        setWarningMessage("");
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendWarning}
                      disabled={!warningMessage.trim() || loadingWarning}
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
                      {loadingWarning ? "Sending..." : "Send Warning"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REACTIVATE MODAL */}
          <AnimatePresence>
            {showReactivateModal && (
              <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white rounded-lg border border-gray-200 flex flex-col" style={{ width: "633px", height: "250px", padding: "32px", gap: "16px", borderRadius: "8px" }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                  <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "20px", color: "#171417" }}>Reactivate User Account</h1>
                  <div className="flex items-start gap-4">
                    <div className="relative w-8 h-8 mt-1">
                      <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "#1FC16B" }} />
                      <div className="absolute bg-[#1FC16B] rounded-full w-6.5 h-6.5 top-0.5 left-0.5 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>Do you want to reactivate this account?</p>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#454345" }}>
                    This user’s account is currently deactivated. Reactivating will restore their full access to the platform.
                  </p>
                  <div className="flex justify-end gap-6 mt-auto">
                    <button onClick={() => setShowReactivateModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                    <button onClick={handleConfirmReactivate} disabled={loadingReactivate} className="text-white font-medium rounded-[20px] flex items-center justify-center" style={{ width: "268.5px", height: "48px", background: "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)" }}>
                      {loadingReactivate ? "Processing..." : "Yes, Reactivate"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DEACTIVATE MODAL */}
          <AnimatePresence>
            {showDeactivateModal && (
              <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white rounded-lg w-[633px] h-[250px] p-8 flex flex-col justify-between shadow-lg" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <TriangleAlert size={24} className="text-red-600" />
                      </div>
                      <p className="text-gray-800 text-sm">You’re about to deactivate this user’s account. They will no longer have access to the platform.</p>
                    </div>
                    <p className="text-gray-900 font-medium text-base">Are you sure you want to proceed?</p>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setShowDeactivateModal(false)} className="border px-6 py-3 rounded-lg">Cancel</button>
                    <button onClick={handleConfirmDeactivate} disabled={loadingDeactivate} className="bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50">
                      {loadingDeactivate ? "Processing..." : "Yes, Deactivate"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyerDetails;