"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { useSession } from "next-auth/react";
import UserAdminActions from "../../components/UserAdminActions";

const AdminDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { data: session } = useSession();

  if (!selectedUser || modalType !== "openAdmin") return null;

  const isActive = selectedUser.status === "ACTIVE";

  // Helper to fix TypeScript status issue
  const getValidStatus = (status: string | undefined) => {
    const valid = ["ACTIVE", "INACTIVE", "PENDING", "VERIFIED", "UNVERIFIED", "DEACTIVATED"] as const;
    return status && valid.includes(status as any) ? (status as any) : "PENDING";
  };

  return (
    <AnimatePresence>
      {modalType === "openAdmin" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MAIN ADMIN DETAILS MODAL */}
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
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">
                  Admin Profile
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-5">
                <div className="flex justify-between">
                  <strong>Name</strong>
                  <span>
                    {selectedUser.fullName}{" "}
                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                      Admin
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Email</strong> <span>{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Phone</strong> <span>{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Verification</strong>
                  <UserManagementStatusBadge status="VERIFIED" />
                </div>
                <div className="flex justify-between">
                  <strong>Location</strong> <span>{selectedUser.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <strong>Status</strong>
                  <UserManagementStatusBadge status={getValidStatus(selectedUser.status)} />
                </div>
                <div className="flex justify-between">
                  <strong>Role</strong> <strong>Administrator</strong>
                </div>
                <div className="flex justify-between">
                  <strong>Registered</strong> <span>May 11, 2025</span>
                </div>
              </div>
            </div>

            {/* Admin Actions WITHOUT View History Button */}
            <div className="bg-white pt-3 pb-12">
              <UserAdminActions
                userId={selectedUser.id}
                userName={selectedUser.fullName}
                userEmail={selectedUser.email}
                isActive={isActive}
                onSuccess={closeModal}
                showHistoryButton={false}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminDetails;