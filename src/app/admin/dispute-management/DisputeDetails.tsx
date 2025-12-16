"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Download, X } from "lucide-react";
import { disputeModalStore } from "@/store/disputeManagementStore";
import { DisputeStatus } from "./DisputeStatus";
import Image from "next/image";
import Dropdown from "@/shared/Dropdown/Dropdown";
import DisputeDetailsTabs from "./DisputeDetailsTabs";
import { disputeService } from "@/services/Disputeservice";

const DisputeDetailsModal = () => {
  const { modalType, selectedDispute, closeModal, fetchDisputes, disputesMeta } = disputeModalStore();
  const [resolving, setResolving] = useState(false);
  const [resolution, setResolution] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const dispute = selectedDispute;

  const handleSelect = (value: string) => {
    setResolution(value);
  };

  const handleDownloadEvidence = async (url: string, fileName: string) => {
    try {
      setDownloading(url);
      const response = await fetch(
        `/api/admin/download-document?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    } finally {
      setDownloading(null);
    }
  };

  const handleResolve = async () => {
    if (!dispute || !resolution || !comment) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setResolving(true);
      setError(null);

      await disputeService.resolveDispute(dispute.id, resolution, comment);

      // Refetch disputes after resolving
      await disputeModalStore.getState().fetchDisputes(
        disputesMeta?.page || 1,
        disputesMeta?.limit || 50
      );

      closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to resolve dispute");
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <AnimatePresence>
      {modalType === "openDispute" && dispute && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="shadow-lg w-[90%] lg:w-[65%] relative max-h-[90vh] rounded-lg overflow-hidden"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
          >
            <div className="flex items-center justify-between bg-[#E8FBF7] px-8 py-4">
              <h2 className="text-xl font-semibold text-[#171417]">
                Dispute Details
              </h2>
              <button
                title="Close modal"
                onClick={closeModal}
                className="text-gray-500 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-white max-h-[80vh] overflow-y-auto scrollbar-hide">
              <section className="px-8 my-3">
                <DisputeDetailsTabs />
              </section>
              <>
                <section className="flex flex-col lg:flex-row px-8 gap-4">
                  <aside className="flex-1 flex flex-col gap-[16px]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Raised By
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] font-medium">
                          {dispute.buyer.fullName}
                        </h3>
                        <p className="bg-[#E6E8E9] px-2 py-0.5 rounded-[8px] text-[.875rem] font-normal">
                          Buyer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Service Provider
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] font-medium">
                          {dispute.seller?.fullName || "N/A"}
                        </h3>
                        <p className="bg-[#97EADA] px-2 py-0.5 rounded-[8px] text-[.875rem] font-normal">
                          Seller
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Booking ID
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] text-[1rem] font-normal">
                          #{dispute.bookingId.slice(0, 8).toUpperCase()}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Date & Time
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] text-[1rem] font-normal">
                          {new Date(dispute.createdAt).toLocaleDateString()} –{" "}
                          {new Date(dispute.createdAt).toLocaleTimeString()}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Services
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] text-[1rem] font-normal">
                          {dispute.booking.serviceTitle}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Dispute Status
                      </h3>
                      <div className="flex items-center gap-2">
                        <DisputeStatus status={dispute.status} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#171417] text-[1rem] font-medium">
                        Dispute Reason
                      </h3>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#454345] text-[1rem] font-normal">
                          {dispute.reason}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-[1rem] text-[#646264]">
                        Description
                      </h3>
                      <div className="bg-[#FFFAFA] p-2 rounded-[8px]">
                        <p className="text-[#171417]">{dispute.description}</p>
                      </div>
                    </div>
                  </aside>

                  <div className="border-[.5px] border-[#B7B6B7] hidden lg:block"></div>
                  <aside className="flex-1 flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#171417] font-bold text-[1rem]">
                        Activity Feed
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[#171417] font-normal text-[1rem]">
                            Dispute Raised by {dispute.openedByRole}
                          </p>
                          <div className="flex items-center gap-[4px] text-[#646264] font-normal text-[.875rem]">
                            <Clock3 size={16} />
                            <p>
                              {new Date(dispute.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-[#454345] text-[1rem] font-normal">
                          {dispute.reason}
                        </p>
                        <div className="flex items-center justify-between">
                          <h3 className="text-[#171417] font-medium">
                            Dispute Status
                          </h3>
                          <DisputeStatus status={dispute.status} />
                        </div>
                      </div>
                    </div>
                    {dispute.evidenceUrls.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#171417] font-medium text-[1rem]">
                          Uploaded Evidence
                        </h3>
                        <div className="flex flex-col gap-[12px]">
                          {dispute.evidenceUrls.map((url, idx) => {
                            const fileName = url.split("/").pop() || `evidence-${idx}`;
                            return (
                              <div key={idx} className="flex items-center gap-4">
                                <Image
                                  src="/icons/dispute-evidence.svg"
                                  alt="Evidence"
                                  width={32}
                                  height={32}
                                />
                                <div className="flex flex-1 justify-between items-center">
                                  <div className="flex flex-col gap-1">
                                    <h4 className="text-[#154751] font-medium text-[.875rem] truncate">
                                      {fileName}
                                    </h4>
                                    <p className="text-[#8C8989] font-normal text-[.875rem]">
                                      File
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDownloadEvidence(url, fileName)
                                    }
                                    disabled={downloading === url}
                                    className="text-[#373737] cursor-pointer hover:text-[#171417] disabled:opacity-50"
                                    title="Download file"
                                  >
                                    <Download
                                      size={19}
                                      className={downloading === url ? "animate-pulse" : ""}
                                    />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </aside>
                </section>
                <section className="mt-[30px] px-5 flex flex-col gap-[16px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#171417] font-bold text-[1.25rem]">
                      Resolution Actions
                    </h3>
                    {/* <button
                      className="text-[#020D27] border-[#04171F] rounded-[36px] border font-medium py-[12px] px-[24px] hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      Send Message
                    </button> */}
                  </div>
                  <div className="bg-[#EAF1FF] rounded-[8px] border-[.5px] border-[#006ADB]">
                    <p className="px-4 py-3 text-[#006ADB]">
                      Job {dispute.booking.status} Dispute: 30% payment to
                      seller is non-refundable. 70% can be refunded or held
                      based on resolution.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-[8px] p-4">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}

                  {dispute.status !== "RESOLVED" && (
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleResolve();
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-[#05060D] font-medium text-[1rem]">
                          Select Resolution
                        </label>
                        <Dropdown
                          placeholder="Select resolution action"
                          options={[
                            "Refund Buyer (70% only)",
                            "Pay Seller (Release 65%)",
                            "Split Payment Between Buyer & Seller",
                            "Seller Rework",
                          ]}
                          onSelect={handleSelect}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[#05060D] font-medium text-[1rem]">
                          Resolution Comment
                        </label>
                        <textarea
                          placeholder="Add detailed explanation for your resolution decision"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="
outline-none 
    border outline border-[#B2B2B4] 
    py-[11px] px-[16px] 
    rounded-[12px] 
    h-[123px] 
    resize-none 
    placeholder-[#B2B2B4] 
    text-[14px] 
    placeholder:font-normal
  "
                          name="decision"
                          id="decision"
                        />
                      </div>
                      <button
                        disabled={resolving}
                        className="py-3 [background:var(--primary-radial)] mb-5 text-[#FFFFFF] rounded-[36px] font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                      >
                        {resolving ? "Resolving..." : "Resolve Dispute"}
                      </button>
                    </form>
                  )}

                  {dispute.status === "RESOLVED" && (
                    <div className="bg-green-50 border border-green-200 rounded-[8px] p-4">
                      <p className="text-green-600 font-medium">
                        This dispute has been resolved.
                      </p>
                      {dispute.resolveComment && (
                        <p className="text-green-600 text-sm mt-2">
                          Resolution: {dispute.resolveComment}
                        </p>
                      )}
                    </div>
                  )}
                </section>
              </>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisputeDetailsModal;