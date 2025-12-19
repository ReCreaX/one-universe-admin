"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, TrendingUp, X } from "lucide-react";
import { userManagementStore } from "@/store/userManagementStore";
import { userDetailsStore } from "@/store/userDetailsStore";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { IoBusinessOutline } from "react-icons/io5";
import { MdCheckCircleOutline } from "react-icons/md";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserAdminActions from "../../components/UserAdminActions";
import UserHistoryModal from "../../components/modals/UserHistoryModal";
import PhotoComparisonModal from "../../components/modals/Photocomparisonmodal";

const SellerDetails = () => {
  const { modalType, selectedUser, closeModal } = userManagementStore();
  const { fullUser, loading, fetchUser } = userDetailsStore();
  const { data: session } = useSession();
  const [showHistory, setShowHistory] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [showPhotoComparison, setShowPhotoComparison] = useState(false);

  useEffect(() => {
    if (modalType === "openSeller" && selectedUser?.id && session?.accessToken) {
      console.log("Fetching full seller details for:", selectedUser.id);
      fetchUser(selectedUser.id, session.accessToken);
    }
  }, [modalType, selectedUser?.id, session?.accessToken, fetchUser]);

  const handleDownload = async (fileUrl: string) => {
    try {
      setDownloadingFile(fileUrl);

      console.log("Attempting to download:", fileUrl);

      const urlParts = fileUrl.split("/");
      const fileNameWithExt = urlParts[urlParts.length - 1];
      const fileName = fileNameWithExt.split("?")[0];

      const response = await fetch(
        `/api/admin/download-document?url=${encodeURIComponent(fileUrl)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download failed:", errorText);
        throw new Error(errorText || "Download failed");
      }

      const blob = await response.blob();
      console.log("Blob size:", blob.size);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Download completed successfully");
    } catch (error) {
      console.error("Download error:", error);
      alert(
        `Failed to download file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  if (!selectedUser || modalType !== "openSeller") return null;

  const displayUser = fullUser || selectedUser;
  const isActive = displayUser.status === "ACTIVE";
  const profile = displayUser.profile || displayUser.sellerProfile;
  const wallet = displayUser.wallet || displayUser.Wallet;
  
  // Get bookingStats from the response data
  const bookingStats = displayUser.bookingStats || {
    totalBookings: 0,
    ongoingBookings: 0,
    completedBookings: 0,
    disputedBookings: 0,
  };

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
            <div className="flex rounded-t-2xl items-center justify-between bg-[#E8FBF7] pt-8 px-4 py-4">
              <div className="flex items-center gap-4">
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-[#171417]">
                  Seller Profile
                </h2>
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
                <p className="text-gray-500">Loading seller details...</p>
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
                          <h3 className="text-[#171417] font-medium text-base">
                            Name
                          </h3>
                          <p className="text-[#454345] font-normal text-base flex gap-2 items-center">
                            <span className="font-medium">
                              {displayUser.fullName}
                            </span>
                            <span className="bg-[#1DD2AE] text-[#171417] text-sm rounded-[8px] py-0.5 px-2">
                              SELLER
                            </span>
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Email Address
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.email}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Phone Number
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.phone}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">
                            Verification Status
                          </h3>
                          <UserManagementStatusBadge
                            status={
                              displayUser.verificationStatus
                                ? "VERIFIED"
                                : "UNVERIFIED"
                            }
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-[#171417] font-medium text-base">
                            Account Status
                          </h3>
                          <UserManagementStatusBadge
                            status={
                              (displayUser.status as
                                | "ACTIVE"
                                | "INACTIVE"
                                | "PENDING"
                                | "VERIFIED"
                                | "UNVERIFIED"
                                | "DEACTIVATED") ?? "PENDING"
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Wallet Balance
                          </h3>
                          <p className="text-[#454345] font-bold text-base">
                            ₦{wallet?.balance?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <h3 className="text-[#171417] font-medium text-base">
                            Registration Date
                          </h3>
                          <p className="text-[#454345] font-normal text-base">
                            {displayUser.createdAt
                              ? new Date(
                                  displayUser.createdAt
                                ).toLocaleDateString("en-GB", {
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

                    {profile && (
                      <aside className="py-6 flex flex-col gap-[24px]">
                        <div className="flex items-center gap-2">
                          <IoBusinessOutline
                            size={20}
                            className="text-[#454345]"
                          />
                          <h3 className="text-[#646264] font-bold text-base">
                            Business Details
                          </h3>
                        </div>
                        <div className="flex flex-col gap-5">
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">
                              Business Name
                            </h3>
                            <p className="text-[#454345] font-normal text-base">
                              {profile.businessName || "-"}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">
                              Services
                            </h3>
                            <p className="text-[#454345] font-normal text-base">
                              {profile.servicesOffered?.join(", ") || "-"}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">
                              Location
                            </h3>
                            <p className="text-[#454345] font-normal text-base">
                              {displayUser.location || "-"}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <h3 className="text-[#171417] font-medium text-base">
                              Service Description
                            </h3>
                            <p className="text-[#454345] font-normal text-base">
                              {profile.businessDescription || "-"}
                            </p>
                          </div>
                        </div>

                        {profile?.portfolioGallery &&
                          profile.portfolioGallery.length > 0 && (
                            <>
                              <div className="bg-[#E8E3E3] h-[1px] w-full"></div>
                              <div className="flex flex-col gap-[24px]">
                                <div className="flex items-center gap-2">
                                  <IoBusinessOutline
                                    size={20}
                                    className="text-[#454345]"
                                  />
                                  <h3 className="text-[#646264] font-bold text-base">
                                    Business Documents
                                  </h3>
                                </div>

                                <div className="flex flex-col gap-4">
                                  {profile.portfolioGallery.map(
                                    (file: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-4"
                                      >
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
                                          <button
                                            onClick={() =>
                                              handleDownload(file)
                                            }
                                            disabled={downloadingFile === file}
                                            className="text-[#373737] hover:text-[#154751] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={
                                              downloadingFile === file
                                                ? "Downloading..."
                                                : "Download file"
                                            }
                                          >
                                            {downloadingFile === file ? (
                                              <div className="w-5 h-5 border-2 border-[#154751] border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <Download
                                                size={19}
                                                className="cursor-pointer"
                                              />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                      </aside>
                    )}
                  </section>

                  <div className="bg-[#E8E3E3] w-full h-[1px] md:w-[1px] md:h-auto"></div>

                  <section className="flex-1 px-5 w-full">
                    <aside className="py-6 flex flex-col gap-[24px] w-[540px]">
                      <div className="flex items-center gap-2 h-[22px]">
                        <MdCheckCircleOutline
                          size={24}
                          className="text-[#454345]"
                        />
                        <h3 className="text-[#646264] font-bold text-base">
                          Third Party Verification
                        </h3>
                      </div>

                      {!displayUser.verificationStatus && (
                        <div className="w-[492px] rounded-[8px] border border-solid border-[#FFFAFA] gap-3 flex flex-col p-3">
                          <div className="flex justify-between h-[28px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">
                              Status
                            </h4>
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
                            <h4 className="text-[#171417] font-medium text-base">
                              Remarks
                            </h4>
                            <p className="text-[#333333] font-regular text-base">
                              Awaiting verification response
                            </p>
                          </div>
                        </div>
                      )}

                      {displayUser.verificationStatus && (
                        <div className="w-[492px] rounded-[8px] border border-solid border-[#FFFAFA] gap-3 flex flex-col p-3">
                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">
                              Provider
                            </h4>
                            <p className="text-[#454345] font-regular text-base">
                              Dikrip
                            </p>
                          </div>

                          <div className="flex justify-between h-[28px] gap-4 items-center">
                            <h4 className="text-[#171417] font-medium text-base">
                              Status
                            </h4>
                            <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#E0F5E6]">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="flex-shrink-0"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="7"
                                  stroke="#1FC16B"
                                  strokeWidth="1.5"
                                  fill="none"
                                />
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
                            <h4 className="text-[#171417] font-medium text-base">
                              Date Verified
                            </h4>
                            <p className="text-[#454345] font-regular text-base">
                              Oct 13, 2024
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 h-[52px]">
                            <h4 className="text-[#171417] font-medium text-base">
                              Remarks
                            </h4>
                            <p className="text-[#1FC16B] font-regular text-base">
                              Identity verified successfully via NIN
                            </p>
                          </div>

                          <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                          <div className="flex flex-col gap-2">
                            <h4 className="text-[#171417] font-bold text-base">
                              Photo Verification
                            </h4>
                            <button
                              onClick={() => setShowPhotoComparison(true)}
                              className="flex items-center justify-center gap-2 h-[32px] px-4 py-1.5 rounded-[36px] border border-solid border-transparent bg-gradient-to-r from-[#154751] to-[#04171F] hover:opacity-90 transition"
                            >
                              <span className="text-white font-medium text-sm">
                                Compare Photos
                              </span>
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
                              <circle
                                cx="10"
                                cy="10"
                                r="9"
                                stroke="#D84040"
                                strokeWidth="1.5"
                                fill="none"
                              />
                              <circle cx="10" cy="7" r="0.8" fill="#D84040" />
                              <path
                                d="M10 10V15"
                                stroke="#D84040"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <p className="text-[#171417] font-regular text-sm">
                              If a user does not pass third-party verification,
                              a manual admin review is required, especially in
                              cases of photo mismatch.
                            </p>
                          </div>

                          <div className="bg-[#E8E3E3] h-[1px] w-full"></div>

                          <h4 className="text-[#171417] font-medium text-base">
                            Verified Data (From NIN/BVN Records)
                          </h4>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">
                              Full Name
                            </h5>
                            <p className="text-[#454345] font-regular text-base">
                              Babatunde Oluwaseun Bakaré
                            </p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">
                              Date of Birth
                            </h5>
                            <p className="text-[#454345] font-regular text-base">
                              1988-03-22
                            </p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">
                              Phone Number
                            </h5>
                            <p className="text-[#454345] font-regular text-base">
                              +2348084848848
                            </p>
                          </div>

                          <div className="flex justify-between h-[22px] gap-4 items-center">
                            <h5 className="text-[#171417] font-medium text-base">
                              Address
                            </h5>
                            <p className="text-[#454345] font-regular text-base">
                              42 Bode Thomas Street, Surulere, Lagos
                            </p>
                          </div>
                        </div>
                      )}
                    </aside>

                    {/* ACTIVITY SUMMARY - USES EXISTING DATA FROM API RESPONSE */}
                    <aside className="py-6 flex flex-col gap-[24px]">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#454345]" />
                        <h3 className="text-[#646264] font-bold text-base">
                          Activity Summary
                        </h3>
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
              console.log("Verification approved for user:", selectedUser?.id);
            }}
            onReject={async (reason: string) => {
              console.log("Verification rejected for user:", selectedUser?.id);
              console.log("Rejection reason:", reason);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SellerDetails;