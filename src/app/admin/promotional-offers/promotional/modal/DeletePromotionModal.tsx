// components/modal/DeletePromotionModal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import useToastStore from "@/store/useToastStore";
import { usePromotionalStore } from "@/store/promotionalStore";

interface DeletePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  offerTitle?: string;
}

const DeletePromotionModal: React.FC<DeletePromotionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  offerTitle,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { showToast } = useToastStore();
  const { fetchAllPromotions, fetchStats } = usePromotionalStore();

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      
      showToast(
        "success",
        "Success",
        `"${offerTitle}" deleted successfully`,
        3000
      );

      await Promise.all([fetchAllPromotions(1, 100), fetchStats()]);
      onClose();
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.message || "Failed to delete promotion",
        3000
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#FFE8E8] px-6 md:px-8 pt-8 pb-4 border-b border-[#FFD9D9] flex items-center justify-between">
            <h2 className="font-dm-sans font-bold text-xl md:text-2xl text-[#D84040]">
              Delete Promotion
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition"
              disabled={isDeleting}
            >
              <X className="w-6 h-6 text-[#D84040]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 md:px-8 py-8">
            <p className="font-dm-sans text-base text-[#454345] mb-2">
              Are you sure you want to delete:
            </p>
            <p className="font-dm-sans font-bold text-lg text-[#171417] mb-6">
              "{offerTitle}"
            </p>
            <p className="font-dm-sans text-sm text-[#6B6969]">
              This action cannot be undone. The promotion will be permanently removed from the system.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 md:px-8 pb-8 flex flex-col md:flex-row gap-4 md:gap-6">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-3 rounded-full font-dm-sans font-medium text-base text-[#171417] border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-6 py-3 rounded-full font-dm-sans font-medium text-base text-white bg-[#D84040] hover:bg-[#C23030] transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Promotion"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePromotionModal;