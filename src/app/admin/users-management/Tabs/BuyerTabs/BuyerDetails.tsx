"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import { userDetailsStore } from "@/store/userDetailsStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { useSession } from "next-auth/react";

// NEW: Import the reusable component
import UserAdminActions from "../../components/UserAdminActions";

const BuyerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { fullUser, loading, fetchUser } = userDetailsStore();
  const { data: session } = useSession();

  // Fetch full user details when modal opens
  useEffect(() => {

   
    if (modalType === "openBuyer" && selectedUser?.id && session?.accessToken) {
      console.log("Fetching full buyer details for:", selectedUser.id);
      fetchUser(selectedUser.id, session.accessToken);
    }
  }, [modalType, selectedUser?.id, session?.accessToken, fetchUser]);

   const getValidStatus = (
  status: string | undefined
): "ACTIVE" | "INACTIVE" | "PENDING" | "VERIFIED" | "UNVERIFIED" | "DEACTIVATED" => {
  const validStatuses = [
    "ACTIVE",
    "INACTIVE",
    "PENDING",
    "VERIFIED",
    "UNVERIFIED",
    "DEACTIVATED",
  ] as const;

  return status && validStatuses.includes(status as any)
    ? (status as any)
    : "PENDING";
};

  if (!selectedUser || modalType !== "openBuyer") return null;

  // Use fullUser if available, otherwise fall back to selectedUser
  const displayUser = fullUser || selectedUser;
  const isActive = displayUser.status === "ACTIVE";
  const wallet = displayUser.wallet || displayUser.Wallet;
  const panicContacts = displayUser.panicContacts || displayUser.PanicContact || [];

  return (
    <AnimatePresence>
      {modalType === "openBuyer" && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="shadow-lg w-full md:w-[85%] bg-white md:rounded-2xl relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            {/* Header */}
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">Buyer Profile</h2>
              </div>
              <button
                className="[background:var(--primary-radial)] py-1.5 px-6 text-[#FDFDFD] rounded-[36px] font-medium text-sm"
                type="button"
              >
                View History
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="rounded-b-2xl bg-white h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading buyer details...</p>
              </div>
            )}

            {/* Body - Two Column Layout */}
            {!loading && (
              <div className="rounded-b-2xl bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
                <section className="flex flex-col md:flex-row py-3.5">
                  {/* Left Column */}
                  <section className="flex-1 px-5 w-full">
                    {/* Personal Information */}
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">Personal Information</h3>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Name</h3>
                          <p className="text-[#454345] font-normal text-base flex gap-2 items-center">
                            <span className="font-medium">{displayUser.fullName}</span>
                            <span className="bg-[#FFB800] text-[#171417] text-sm rounded-[8px] py-0.5 px-2">
                              BUYER
                            </span>
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Email Address</h3>
                          <p className="text-[#454345] font-normal text-base">{displayUser.email}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Phone Number</h3>
                          <p className="text-[#454345] font-normal text-base">{displayUser.phone || "-"}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Location</h3>
                          <p className="text-[#454345] font-normal text-base">{displayUser.location || "-"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">Verification Status</h3>
                          <UserManagementStatusBadge
                            status={displayUser.verificationStatus ? "VERIFIED" : "UNVERIFIED"}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">Account Status</h3>
                         <UserManagementStatusBadge status={getValidStatus(displayUser.status)} />
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Wallet Balance</h3>
                          <p className="text-[#454345] font-bold text-base">
                            ₦{wallet?.balance?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Registration Date</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.createdAt
                              ? new Date(displayUser.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </aside>

                    <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                    {/* Panic Contacts */}
                    {panicContacts.length > 0 && (
                      <aside className="py-6 flex flex-col gap-[24px]">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={20} className="text-[#454345]" />
                          <h3 className="text-[#646264] font-bold text-base">Emergency Contacts</h3>
                        </div>
                        <div className="flex flex-col gap-5">
                          {panicContacts.map((contact: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h3 className="text-[#171417] font-medium text-base">Contact {idx + 1}</h3>
                              </div>
                              <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="text-[#454345] font-medium">{contact.fullName || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="text-[#454345]">{contact.phoneNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="text-[#454345]">{contact.email || "-"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </aside>
                    )}
                  </section>

                  {/* Divider */}
                  <div className="bg-[#E8E3E3] w-full h-[1px] md:w-[1px] md:h-auto"></div>

                  {/* Right Column */}
                  <section className="flex-1 px-5 w-full">
                    {/* Activity Summary */}
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">Activity Summary</h3>
                      </div>
                      <div className="flex flex-col gap-5 md:w-3/5">
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Total Bookings Made</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.bookingStats?.totalBookings || 0}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Ongoing Bookings</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.bookingStats?.ongoingBookings || 0}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Completed Bookings</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.bookingStats?.completedBookings || 0}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Disputed Bookings</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.bookingStats?.disputedBookings || 0}
                          </p>
                        </div>
                      </div>
                    </aside>
                  </section>
                </section>

                {/* REPLACED: All action buttons + modals now come from UserAdminActions */}
                <div className="bg-white pt-3 pb-12">
                  <UserAdminActions
                    userId={selectedUser.id}
                    userName={displayUser.fullName}
                    userEmail={displayUser.email}
                    isActive={isActive}
                    onSuccess={closeModal}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyerDetails;