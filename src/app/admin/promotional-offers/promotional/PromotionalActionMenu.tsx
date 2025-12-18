
"use client";

import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface PromotionalActionMenuProps {
  offerId: string;
  isOpen: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PromotionalActionMenu: React.FC<PromotionalActionMenuProps> = ({
  isOpen,
  position,
  onClose,
  onView,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Menu — 168×176px */}
      <div
        className="fixed w-42 bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] border border-[#E5E7EF] overflow-hidden z-50"
        style={{
          top: position.top,
          left: position.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* View Offer */}
        <button
          onClick={() => {
            onView();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
        >
          <Eye className="w-4.5 h-4.5 text-[#454345]" />
          <span className="font-dm-sans text-base text-[#454345]">View Offer</span>
        </button>

        {/* Edit Offer */}
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
        >
          <Edit2 className="w-4.5 h-4.5 text-[#454345]" />
          <span className="font-dm-sans text-base text-[#454345]">Edit Offer</span>
        </button>

        {/* Delete Offer */}
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-6 py-4.5 hover:bg-[#FAFAFA] transition text-red-600"
        >
          <Trash2 className="w-4.5 h-4.5 text-red-600" />
          <span className="font-dm-sans text-base text-red-600">Delete Offer</span>
        </button>
      </div>
    </>
  );
};

export default PromotionalActionMenu;