"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, TrendingUp, X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import { userDetailsStore } from "@/store/userDetailsStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { IoBusinessOutline } from "react-icons/io5";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserAdminActions from "../../components/UserAdminActions";
import UserHistoryModal from "../../components/modals/UserHistoryModal";

const SellerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { fullUser, loading, fetchUser } = userDetailsStore();
  const { data: session } = useSession();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (modalType === "openSeller" && selectedUser?.id && session?.accessToken) {
      console.log("Fetching full seller details for:", selectedUser.id);
      fetchUser(selectedUser.id, session.accessToken);
    }
  }, [modalType, selectedUser?.id, session?.accessToken, fetchUser]);

  if (!selectedUser || modalType !== "openSeller") return null;

  const displayUser = fullUser || selectedUser;
  const isActive = displayUser.status === "ACTIVE";
  const profile = displayUser.profile || displayUser.sellerProfile;
  const wallet = displayUser.wallet || displayUser.Wallet;

  return (
    <AnimatePresence>
      {modalType === "openSeller" && selectedUser && (
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
            {/* Header with View History Button */}
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">Seller Profile</h2>
              </div>
              
              {/* View History Button - Moved to header */}
              <button
                onClick={() => setShowHistory(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-1.5 rounded-[36px] text-white text-sm font-medium hover:from-teal-700 hover:to-cyan-800 transition"
              >
                View History
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="rounded-b-2xl bg-white h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading seller details...</p>
              </div>
            )}

            {/* Body */}
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
                            <span className="bg-[#1DD2AE] text-[#171417] text-sm rounded-[8px] py-0.5 px-2">
                              SELLER
                            </span>
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Email Address</h3>
                          <p className="text-[#454345] font-normal text-base">{displayUser.email}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">Phone Number</h3>
                          <p className="text-[#454345] font-normal text-base">{displayUser.phone}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">Verification Status</h3>
                          <UserManagementStatusBadge
                            status={displayUser.verificationStatus ? "VERIFIED" : "UNVERIFIED"}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">Account Status</h3>
                          <UserManagementStatusBadge
                            status={(displayUser.status as
                              | "ACTIVE"
                              | "INACTIVE"
                              | "PENDING"
                              | "VERIFIED"
                              | "UNVERIFIED"
                              | "DEACTIVATED") ?? "PENDING"}
                          />
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

                    {/* Business Details */}
                    {profile && (
                      <aside className="py-6 flex flex-col gap-[24px]">
                        <div className="flex items-center gap-2">
                          <IoBusinessOutline size={20} className="text-[#454345]" />
                          <h3 className="text-[#646264] font-bold text-base">Business Details</h3>
                        </div>
                        <div className="flex flex-col gap-5">
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">Business Name</h3>
                            <p className="text-[#454345] font-normal text-base">{profile.businessName || "-"}</p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">Services</h3>
                            <p className="text-[#454345] font-normal text-base">
                              {profile.servicesOffered?.join(", ") || "-"}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">Location</h3>
                            <p className="text-[#454345] font-normal text-base">{displayUser.location || "-"}</p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">Service Description</h3>
                            <p className="text-[#454345] font-normal text-base">
                              {profile.businessDescription || "-"}
                            </p>
                          </div>
                        </div>
                      </aside>
                    )}
                  </section>

                  {/* Divider */}
                  <div className="bg-[#E8E3E3] w-full h-[1px] md:w-[1px] md:h-auto"></div>

                  {/* Right Column */}
                  <section className="flex-1 px-5 w-full">
                    {/* Portfolio / Business Documents */}
                    {profile?.portfolioGallery && profile.portfolioGallery.length > 0 && (
                      <>
                        <aside className="py-6 flex flex-col gap-[24px]">
                          <div className="flex items-center gap-2">
                            <IoBusinessOutline size={20} className="text-[#454345]" />
                            <h3 className="text-[#646264] font-bold text-base">Business Documents</h3>
                          </div>

                          <div className="flex flex-col gap-4">
                            {profile.portfolioGallery.map((file: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-4">
                                <Image
                                  src="/icons/dispute-evidence.svg"
                                  alt="Document icon"
                                  width={32}
                                  height={32}
                                  className="flex-shrink-0"
                                />
                                <div className="flex flex-1 justify-between items-center">
                                  <div className="flex flex-col gap-1">
                                    <h4 className="text-[#154751] font-medium text-[.875rem] truncate max-w-[200px]">
                                      {file}
                                    </h4>
                                    <p className="text-[#8C8989] font-normal text-[.875rem] flex items-center gap-2">
                                      <span>200KB</span>
                                      <span className="w-1 h-1 bg-[#454345] rounded-full"></span>
                                      <span>Oct 12, 2024</span>
                                    </p>
                                  </div>
                                  <a
                                    href={`/uploads/${file}`}
                                    download
                                    className="text-[#373737] hover:text-[#154751] transition-colors"
                                  >
                                    <Download size={19} className="cursor-pointer" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </aside>
                        <div className="bg-[#E8E3E3] h-[1px] w-full" />
                      </>
                    )}

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

                {/* UserAdminActions without View History button */}
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

          {/* History Modal */}
          <UserHistoryModal
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            userId={selectedUser.id}
            userName={displayUser.fullName}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SellerDetails;