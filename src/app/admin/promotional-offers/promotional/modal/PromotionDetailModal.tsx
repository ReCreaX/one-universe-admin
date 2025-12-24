// components/modal/PromotionDetailModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowLeft, CircleCheck, Clock, Flag } from "lucide-react";
import CreatePromoOfferModal from "./CreatePromoOfferModal";
import DeletePromotionModal from "./DeletePromotionModal";
import useToastStore from "@/store/useToastStore";
import { promotionalService, PromotionDetailStats } from "@/services/promotionalService";

interface PromotionDetailModalProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (offer: any) => void;
  onDelete?: (offer: any) => void;
}

const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({ 
  offer, 
  isOpen, 
  onClose,
  onEdit,
  onDelete
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToastStore();
  
  // Stats state
  const [stats, setStats] = useState<PromotionDetailStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch stats when modal opens
  useEffect(() => {
    if (isOpen && offer?.id) {
      fetchPromotionStats();
    }
    
    // Reset stats when modal closes
    if (!isOpen) {
      setStats(null);
      setStatsError(null);
    }
  }, [isOpen, offer?.id]);

  const fetchPromotionStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    
    try {
      const data = await promotionalService.getPromotionStats(offer.id);
      setStats(data);
      console.log("✅ Promotion stats loaded:", data);
    } catch (error: any) {
      console.error("❌ Failed to load promotion stats:", error);
      setStatsError(error.message || "Failed to load stats");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(offer);
    } else {
      onClose();
      setTimeout(() => {
        setIsEditModalOpen(true);
      }, 100);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(offer);
    }
    onClose();
  };

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // ✅ NEW: Status badge configuration
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    
    switch (normalizedStatus) {
      case 'ACTIVE':
        return {
          icon: <CircleCheck size={16} className="text-[#1FC16B]" />,
          bgClass: "bg-[#E0F5E6]",
          textClass: "text-[#1FC16B]",
          label: "Active"
        };
      case 'DRAFT':
        return {
          icon: <Clock size={16} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: "Draft"
        };
      case 'EXPIRED':
        return {
          icon: <Flag size={16} className="text-[#D00416]" />,
          bgClass: "bg-[#FB37481A]",
          textClass: "text-[#D00416]",
          label: "Expired"
        };
      case 'INACTIVE':
        return {
          icon: <Flag size={16} className="text-[#D00416]" />,
          bgClass: "bg-[#FB37481A]",
          textClass: "text-[#D00416]",
          label: "Inactive"
        };
      default:
        return {
          icon: <Clock size={16} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: status || "Unknown"
        };
    }
  };

  if (!isOpen) return null;

  const statusConfig = getStatusConfig(offer.status);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Detail Modal */}
      <div 
        className="fixed inset-0 z-[70] flex items-start justify-center pt-20 md:pt-32 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div 
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={onClose} className="p-2 hover:bg-white/30 rounded-lg transition">
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                {offer.title || offer.offerTitle}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/30 rounded-lg transition">
              <X className="w-6 h-6 text-[#171417]" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="px-4 md:px-8 py-8">
            <div className="grid grid-cols-3 gap-2 md:gap-6">
              <div className="bg-white rounded-xl p-3 md:p-4 text-center border border-[#E5E7EF]">
                <p className="font-dm-sans font-bold text-lg md:text-2xl text-[#171417] whitespace-nowrap">
                  {statsLoading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-7 w-12 rounded"></span>
                  ) : statsError ? (
                    "—"
                  ) : (
                    stats?.redemptions ?? 0
                  )}
                </p>
                <p className="font-dm-sans text-xs md:text-base text-[#6B6969] mt-1 whitespace-nowrap">Redemptions</p>
              </div>
              <div className="bg-white rounded-xl p-3 md:p-4 text-center border border-[#E5E7EF]">
                <p className="font-dm-sans font-bold text-lg md:text-2xl text-[#171417] whitespace-nowrap">
                  {statsLoading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-7 w-20 rounded"></span>
                  ) : statsError ? (
                    "—"
                  ) : (
                    formatCurrency(stats?.totalValue ?? 0)
                  )}
                </p>
                <p className="font-dm-sans text-xs md:text-base text-[#6B6969] mt-1 whitespace-nowrap">Total Value</p>
              </div>
              <div className="bg-white rounded-xl p-3 md:p-4 text-center border border-[#E5E7EF]">
                <p className="font-dm-sans font-bold text-lg md:text-2xl text-[#171417] whitespace-nowrap">
                  {statsLoading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-7 w-12 rounded"></span>
                  ) : statsError ? (
                    "—"
                  ) : (
                    stats?.newUsers ?? 0
                  )}
                </p>
                <p className="font-dm-sans text-xs md:text-base text-[#6B6969] mt-1 whitespace-nowrap">New Users</p>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="px-8 pb-8 space-y-6">
            {[
              { label: "Type", value: offer.type },
              { label: "Eligible Users", value: offer.eligibleUser, badge: true },
              { label: "Trigger", value: offer.activationTrigger || "User Signup" },
              { label: "Reward Value", value: `${offer.rewardValue}${offer.rewardUnit}` },
              { label: "Start Date", value: offer.startDate || "March 11, 2025" },
              { label: "End Date", value: offer.endDate },
              { label: "Max per User", value: offer.maxRedemptionPerUser?.toString() || "1", pill: true },
              { label: "Max Total", value: offer.maxTotalRedemption?.toString() || "400", pill: true, bg: "#FFF9F9" },
              { label: "Status", value: offer.status, isStatus: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-dm-sans font-medium text-base text-[#171417] w-40">{item.label}</span>
                <div className="flex-1 flex justify-end">
                  {item.badge ? (
                    <span className="px-3 py-1 bg-[#E6E8E9] text-[#171417] rounded-lg text-sm font-dm-sans">
                      {item.value}
                    </span>
                  ) : item.pill ? (
                    <div className={`px-4 py-2 rounded-full ${item.bg === "#FFF9F9" ? "bg-[#FFF9F9]" : "bg-[#B6C6C9]"}`}>
                      <span className="font-dm-sans text-base text-[#171417]">{item.value}</span>
                    </div>
                  ) : item.isStatus ? (
                    // ✅ NEW: Beautiful status badge with icon
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-dm-sans ${statusConfig.bgClass} ${statusConfig.textClass}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  ) : (
                    <span className="font-dm-sans text-base text-[#454345] text-right">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 flex flex-col md:flex-row gap-4 md:gap-8 md:justify-between">
            <button 
              onClick={handleDeleteClick}
              className="w-full md:w-auto px-8 py-3 rounded-full bg-[#D84040] text-white font-dm-sans font-medium text-base hover:opacity-90 transition order-first md:order-none"
            >
              Delete Promotion
            </button>

            <button
              onClick={handleEditClick}
              className="w-full md:w-auto px-8 py-3 rounded-full text-white font-dm-sans font-medium text-base hover:opacity-90 transition"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)' }}
            >
              Edit Promotion
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL - Only shown if no parent handler */}
      {!onEdit && (
        <CreatePromoOfferModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          offerToEdit={offer}
          mode="edit"
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeletePromotionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        offerTitle={offer.title || offer.offerTitle}
      />
    </>
  );
};

export default PromotionDetailModal;