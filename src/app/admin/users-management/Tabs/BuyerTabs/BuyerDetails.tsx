"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import { userDetailsStore } from "@/store/userDetailsStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { useSession } from "next-auth/react";
import UserAdminActions from "../../components/UserAdminActions";
import UserHistoryModal from "../../components/modals/UserHistoryModal";
import PhotoComparisonModal from "../../components/modals/Photocomparisonmodal";
import { MdCheckCircleOutline } from "react-icons/md";
import {
  isOngoingBooking,
  isCompletedBooking,
  isDisputedBooking,
  bookingStatusConfig,
  BookingStatus,
} from "@/services/userManagementService";

const BuyerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { fullUser, loading, fetchUser } = userDetailsStore();
  const { data: session } = useSession();
  const [showHistory, setShowHistory] = useState(false);
  const [showPhotoComparison, setShowPhotoComparison] = useState(false);

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

  const displayUser = fullUser || selectedUser;
  const isActive = displayUser.status === "ACTIVE";
  const panicContacts = displayUser.panicContacts || displayUser.PanicContact || [];

  // Calculate booking stats based on actual booking statuses from backend
  const bookingStats = useMemo(() => {
    const bookings = displayUser.bookings || [];

    return {
      totalBookings: bookings.length,
      ongoingBookings: bookings.filter((b: any) =>
        isOngoingBooking(b.status)
      ).length,
      completedBookings: bookings.filter((b: any) =>
        isCompletedBooking(b.status)
      ).length,
      disputedBookings: bookings.filter((b: any) =>
        isDisputedBooking(b.status)
      ).length,
    };
  }, [displayUser.bookings]);

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
                onClick={() => setShowHistory(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-1.5 rounded-[36px] text-white text-sm font-medium hover:from-teal-700 hover:to-cyan-800 transition"
              >
                View History
              </button>
            </div>

            {loading && (
              <div className="rounded-b-2xl bg-white h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading buyer details...</p>
              </div>
            )}

            {!loading && (
              <div className="rounded-b-2xl bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
                <section className="flex flex-col md:flex-row py-3.5">
                  <section className="flex-1 px-5 w-full">
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">
                          Personal Information
                        </h3>
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
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.phone || "-"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Location</h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.location || "-"}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">
                            Verification Status
                          </h3>
                          <UserManagementStatusBadge
                            status={displayUser.verificationStatus ? "VERIFIED" : "UNVERIFIED"}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">Account Status</h3>
                          <UserManagementStatusBadge status={getValidStatus(displayUser.status)} />
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

                    {/* Activity Summary with Dynamic Booking Stats */}
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">Activity Summary</h3>
                      </div>
                      <div className="flex flex-col gap-5 md:w-3/5">
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Total Bookings Made
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {bookingStats.totalBookings}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Ongoing Bookings
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {bookingStats.ongoingBookings}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Completed Bookings
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {bookingStats.completedBookings}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Disputed Bookings
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {bookingStats.disputedBookings}
                          </p>
                        </div>
                      </div>
                    </aside>

                    {panicContacts.length > 0 && (
                      <>
                        <div className="bg-[#E8E3E3] h-[1px] w-full"></div>
                        <aside className="py-6 flex flex-col gap-[24px]">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={20} className="text-[#454345]" />
                            <h3 className="text-[#646264] font-bold text-base">
                              Emergency Contacts
                            </h3>
                          </div>
                          <div className="flex flex-col gap-5">
                            {panicContacts.map((contact: any, idx: number) => (
                              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <h3 className="text-[#171417] font-medium text-base">
                                    Contact {idx + 1}
                                  </h3>
                                </div>
                                <div className="flex flex-col gap-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="text-[#454345] font-medium">
                                      {contact.fullName || "-"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="text-[#454345]">
                                      {contact.phoneNumber || "-"}
                                    </span>
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
                      </>
                    )}
                  </section>

                  <div className="bg-[#E8E3E3] w-full h-[1px] md:w-[1px] md:h-auto"></div>

                  <section className="flex-1 px-5 w-full">
                    <aside className="py-6 flex flex-col gap-[24px] w-[540px]">
                      <div className="flex items-center gap-2 h-[22px]">
                        <MdCheckCircleOutline size={24} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">
                          Third Party Verification
                        </h3>
                      </div>

                      {!displayUser.verificationStatus && (
                        <div className="w-[492px] rounded-[8px] border border-solid border-[#FFFAFA] gap-3 flex flex-col p-3">
                          <div className="flex justify-between h-[28px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">Status</h4>
                            <div className="flex items-center gap-[6px] w-[90px] h-[28px] px-2 py-1 rounded-[8px] bg-[#FFF2B9]">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="flex-shrink-0"
                              >
                                <path
                                  d="M8 1.55469C4.41015 1.55469 1.5 4.46484 1.5 8.05469C1.5 11.6445 4.41015 14.5547 8 14.5547C11.5898 14.5547 14.5 11.6445 14.5 8.05469C14.5 4.46484 11.5898 1.55469 8 1.55469Z"
                                  fill="#9D7F04"
                                />
                                <path
                                  d="M8 5.05469V8.55469M8 10.5547H8.005"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-[#9D7F04] font-normal text-[14px] leading-[140%] text-center">
                                Pending
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 h-[52px]">
                            <h4 className="text-[#171417] font-medium text-base">Remarks</h4>
                            <p className="text-[#333333] font-regular text-base">
                              Awaiting verification response
                            </p>
                          </div>
                        </div>
                      )}

                      {displayUser.verificationStatus && (
                        <div className="w-[492px] rounded-[8px] border border-solid border-[#FFFAFA] gap-3 flex flex-col p-3">
                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">Provider</h4>
                            <p className="text-[#454345] font-regular text-base">Dikrip</p>
                          </div>

                          <div className="flex justify-between h-[28px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">Status</h4>
                            <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#E0F5E6]">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="flex-shrink-0"
                              >
                                <circle cx="8" cy="8" r="7" stroke="#1FC16B" strokeWidth="1.5" fill="none" />
                                <path
                                  d="M5 8L7 10L11 6"
                                  stroke="#1FC16B"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-[#1FC16B] font-regular text-sm text-center">
                                Verified
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">Date Verified</h4>
                            <p className="text-[#454345] font-regular text-base">Oct 13, 2024</p>
                          </div>

                          <div className="flex flex-col gap-2 h-[52px]">
                            <h4 className="text-[#171417] font-medium text-base">Remarks</h4>
                            <p className="text-[#1FC16B] font-regular text-base">
                              Identity verified successfully via NIN
                            </p>
                          </div>

                          <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                          <div className="flex flex-col gap-2">
                            <h4 className="text-[#171417] font-bold text-base">Photo Verification</h4>
                            <button
                              onClick={() => setShowPhotoComparison(true)}
                              className="flex items-center justify-center gap-2 h-[32px] px-4 py-1.5 rounded-[36px] border border-solid border-transparent bg-gradient-to-r from-[#154751] to-[#04171F] hover:opacity-90 transition"
                            >
                              <span className="text-white font-medium text-sm">Compare Photos</span>
                            </button>
                          </div>

                          <div className="flex gap-2 p-2 rounded-[8px] bg-[#FFF5F4] border border-solid border-[#DA8E85]">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              className="flex-shrink-0"
                            >
                              <circle cx="10" cy="10" r="9" stroke="#D84040" strokeWidth="1.5" fill="none" />
                              <circle cx="10" cy="7" r="0.8" fill="#D84040" />
                              <path d="M10 10V15" stroke="#D84040" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="text-[#171417] font-regular text-sm">
                              If a user does not pass third-party verification, a manual admin review is
                              required, especially in cases of photo mismatch.
                            </p>
                          </div>

                          <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                          <h4 className="text-[#171417] font-medium text-base">
                            Verified Data (From NIN/BVN Records)
                          </h4>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">Full Name</h5>
                            <p className="text-[#454345] font-regular text-base">
                              Babatunde Oluwaseun Bakaré
                            </p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">Date of Birth</h5>
                            <p className="text-[#454345] font-regular text-base">1988-03-22</p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">Phone Number</h5>
                            <p className="text-[#454345] font-regular text-base">+2348084848848</p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">Address</h5>
                            <p className="text-[#454345] font-regular text-base">
                              42 Bode Thomas Street, Surulere, Lagos
                            </p>
                          </div>
                        </div>
                      )}
                    </aside>
                  </section>
                </section>

                <div className="bg-white pt-3 pb-12">
                  <UserAdminActions
                    userId={selectedUser.id}
                    userName={displayUser.fullName}
                    userEmail={displayUser.email}
                    isActive={isActive}
                    onSuccess={closeModal}
                    showHistoryButton={false}
                  />
                </div>
              </div>
            )}
          </motion.div>

          <UserHistoryModal
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            userId={selectedUser.id}
            userName={displayUser.fullName}
          />

          <PhotoComparisonModal
            isOpen={showPhotoComparison}
            onClose={() => setShowPhotoComparison(false)}
            userPhoto="/images/woman.png"
            ninPhoto="/images/man.png"
            uploadedDate="Oct 12, 2024"
            ninSource="From: Nigeria Database (Dikript)"
            userId={selectedUser?.id}
            onApprove={async () => {
              console.log("Verification approved for buyer:", selectedUser?.id);
            }}
            onReject={async (reason: string) => {
              console.log("Verification rejected for buyer:", selectedUser?.id);
              console.log("Rejection reason:", reason);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyerDetails;