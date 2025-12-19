"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { ApproveVerificationModal, RejectVerificationModal } from "./Verificationactionmodals";

interface PhotoComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhoto?: string;
  ninPhoto?: string;
  uploadedDate?: string;
  ninSource?: string;
  onApprove?: () => void | Promise<void>;
  onReject?: (reason: string) => void | Promise<void>;
  isLoading?: boolean;
  userId?: string;
}

const PhotoComparisonModal: React.FC<PhotoComparisonModalProps> = ({
  isOpen,
  onClose,
  userPhoto = "/images/woman.png",
  ninPhoto = "/images/man.png",
  uploadedDate = "Oct 12, 2024",
  ninSource = "From: Nigeria Database (Dikript)",
  onApprove,
  onReject,
  isLoading = false,
  userId,
}) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    try {
      if (onApprove) {
        await onApprove();
      }
      setShowApproveConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error approving verification:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsProcessing(true);
    try {
      if (onReject) {
        await onReject(reason);
      }
      setShowRejectConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error rejecting verification:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-[16px] w-full max-w-[917px] shadow-lg p-4 md:p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-4">
                <h2 className="text-[#171417] font-bold text-lg md:text-xl">Photo Comparison</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 h-[28px] px-2 py-1 rounded-[8px] bg-[#FB37481A] flex-1 md:flex-initial">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#D00416" strokeWidth="1.5" fill="none" />
                      <circle cx="8" cy="5" r="0.6" fill="#D00416" />
                      <path d="M8 7V12" stroke="#D00416" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-[#D00416] font-regular text-sm text-center">Unverified</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black transition flex-shrink-0"
                    title="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Photos Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                {/* Uploaded by User */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#171417] font-medium text-base">Uploaded by User</h3>
                  <div className="w-full aspect-square rounded-[8px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={userPhoto}
                      alt="User uploaded photo"
                      width={414}
                      height={414}
                      className="w-full h-full object-cover rounded-[8px]"
                      priority
                    />
                  </div>
                  <p className="text-[#606060] font-regular text-sm">Uploaded: {uploadedDate}</p>
                </div>

                {/* NIN/BVN Record Photo */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#171417] font-medium text-base">NIN/BVN Record Photo</h3>
                  <div className="w-full aspect-square rounded-[8px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={ninPhoto}
                      alt="NIN/BVN record photo"
                      width={414}
                      height={414}
                      className="w-full h-full object-cover rounded-[8px]"
                      priority
                    />
                  </div>
                  <p className="text-[#606060] font-regular text-sm">{ninSource}</p>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-[#171417] font-medium text-base">Verification Notes</h3>
                <p className="text-[#333333] font-regular text-sm md:text-base">
                  Compare both photos carefully. Verify facial features, age consistency, and any visible discrepancies. 
                  If photos do not match, reject the verification with specific reasons.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-6 md:justify-end">
                <button
                  onClick={handleRejectClick}
                  disabled={isLoading || isProcessing}
                  className="flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-[36px] bg-[#D84040] text-white font-medium text-sm md:text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isLoading || isProcessing ? "Processing..." : "Reject Verification"}
                </button>
                <button
                  onClick={handleApproveClick}
                  disabled={isLoading || isProcessing}
                  className="flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-[36px] bg-gradient-to-r from-[#154751] to-[#04171F] text-white font-medium text-sm md:text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isLoading || isProcessing ? "Processing..." : "Approve Verification"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Action Modals */}
      <ApproveVerificationModal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleApproveConfirm}
        loading={isProcessing}
      />

      <RejectVerificationModal
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleRejectConfirm}
        loading={isProcessing}
      />
    </>
  );
};

export default PhotoComparisonModal;