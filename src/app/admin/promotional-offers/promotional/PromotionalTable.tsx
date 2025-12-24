// components/PromotionalOffersTable.tsx
"use client";

import React, { useState } from "react";
import { Eye, Edit2, Trash2, CircleCheck, Clock, Flag, ShoppingBag, Truck, Package, Coins } from "lucide-react";
import PromotionalEmptyState from "./PromotionalEmptyState";
import PromotionDetailModal from "./modal/PromotionDetailModal";
import CreatePromoOfferModal from "./modal/CreatePromoOfferModal";
import DeletePromotionModal from "./modal/DeletePromotionModal";
import { usePromotionalStore } from "@/store/promotionalStore";
import useToastStore from "@/store/useToastStore";

interface PromotionalOffersTableProps {
  promotions: any[];
}

const PromotionalOffersTable = ({ promotions }: PromotionalOffersTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [detailPromo, setDetailPromo] = useState<any>(null);
  const [editPromo, setEditPromo] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePromo, setDeletePromo] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { showToast } = useToastStore();
  const { deletePromotion, fetchAllPromotions, fetchStats } = usePromotionalStore();

  const handleActionClick = (
    promoId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const menuWidth = 168;
    const menuHeight = 176;
    const padding = 16;

    let left = rect.right - menuWidth;
    if (left < padding) left = padding;
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    let top = rect.bottom + window.scrollY + 8;
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    setMenuPosition({ top, left });
    setOpenMenuId((prev) => (prev === promoId ? null : promoId));
  };

  const handleView = (promo: any) => {
    setDetailPromo(promo);
    setOpenMenuId(null);
  };

  const handleEdit = (promo: any) => {
    setEditPromo(promo);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (promo: any) => {
    setDeletePromo(promo);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletePromo) return;

    try {
      await deletePromotion(deletePromo.id);
      showToast(
        "success",
        "Success",
        `"${deletePromo.offerTitle || deletePromo.title}" deleted successfully`,
        3000
      );

      await Promise.all([fetchAllPromotions(1, 100), fetchStats()]);

      setIsDeleteModalOpen(false);
      setDeletePromo(null);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.message || "Failed to delete promotion",
        3000
      );
    }
  };

  const handleEditFromDetail = (promo: any) => {
    setDetailPromo(null);
    setTimeout(() => {
      setEditPromo(promo);
      setIsEditModalOpen(true);
    }, 150);
  };

  // ✅ NEW: Status badge configuration with icons
  const getStatusConfig = (status: string, isMobile: boolean = false) => {
    const normalizedStatus = status?.toUpperCase();
    const iconSize = isMobile ? 14 : 16;
    
    switch (normalizedStatus) {
      case 'ACTIVE':
        return {
          icon: <CircleCheck size={iconSize} className="text-[#1FC16B]" />,
          bgClass: "bg-[#E0F5E6]",
          textClass: "text-[#1FC16B]",
          label: "Active"
        };
      case 'DRAFT':
        return {
          icon: <Clock size={iconSize} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: "Draft"
        };
      case 'EXPIRED':
        return {
          icon: <Flag size={iconSize} className="text-[#D00416]" />,
          bgClass: "bg-[#FB37481A]",
          textClass: "text-[#D00416]",
          label: "Expired"
        };
      case 'INACTIVE':
        return {
          icon: <Flag size={iconSize} className="text-[#D00416]" />,
          bgClass: "bg-[#FB37481A]",
          textClass: "text-[#D00416]",
          label: "Inactive"
        };
      default:
        return {
          icon: <Clock size={iconSize} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: status || "Unknown"
        };
    }
  };

  // ✅ NEW: Type badge configuration with icons
  const getTypeConfig = (type: string, isMobile: boolean = false) => {
    const normalizedType = type?.toUpperCase();
    const iconSize = isMobile ? 14 : 16;
    
    switch (normalizedType) {
      case 'DISCOUNT':
        return {
          icon: <ShoppingBag size={iconSize} className="text-[#E67E22]" />,
          bgClass: "bg-[#FFF1E6]",
          textClass: "text-[#E67E22]",
          label: "Discount"
        };
      case 'FREE_SHIPPING':
        return {
          icon: <Truck size={iconSize} className="text-[#388E3C]" />,
          bgClass: "bg-[#E8F5E9]",
          textClass: "text-[#388E3C]",
          label: "Free Shipping"
        };
      case 'BUNDLE':
        return {
          icon: <Package size={iconSize} className="text-[#7B1FA2]" />,
          bgClass: "bg-[#F3E5F5]",
          textClass: "text-[#7B1FA2]",
          label: "Bundle"
        };
      case 'CASHBACK':
        return {
          icon: <Coins size={iconSize} className="text-[#F57F17]" />,
          bgClass: "bg-[#FFF8E1]",
          textClass: "text-[#F57F17]",
          label: "Cashback"
        };
      default:
        return {
          icon: <ShoppingBag size={iconSize} className="text-[#6B6969]" />,
          bgClass: "bg-[#E6E8E9]",
          textClass: "text-[#6B6969]",
          label: type || "Other"
        };
    }
  };

  return (
    <>
      {promotions.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Offer Title
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Type
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Eligible Users
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    End Date
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Redemptions
                  </th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                    Status
                  </th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => {
                  const statusConfig = getStatusConfig(promo.status || "Draft");
                  const typeConfig = getTypeConfig(promo.type);
                  
                  return (
                    <tr
                      key={promo.id}
                      className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]"
                    >
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                        {promo.title || promo.offerTitle}
                      </td>
                      <td className="py-[18px] px-[25px]">
                        {/* ✅ NEW: Type badge with icon */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-dm-sans ${typeConfig.bgClass} ${typeConfig.textClass}`}
                        >
                          {typeConfig.icon}
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                        {promo.eligibleUser}
                      </td>
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                        {promo.endDate}
                      </td>
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] font-medium">
                        {(promo.redemptions || 0).toLocaleString()}
                      </td>
                      <td className="py-[18px] px-[25px]">
                        {/* ✅ NEW: Status badge with icon */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-dm-sans ${statusConfig.bgClass} ${statusConfig.textClass}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-[18px] px-[25px] relative">
                        <button
                          onClick={(e) => handleActionClick(promo.id, e)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-[#303237]"
                          >
                            <circle cx="10" cy="5" r="2" fill="currentColor" />
                            <circle cx="10" cy="10" r="2" fill="currentColor" />
                            <circle cx="10" cy="15" r="2" fill="currentColor" />
                          </svg>
                        </button>

                        {openMenuId === promo.id && (
                          <div
                            className="fixed w-42 bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] border border-[#E5E7EF] overflow-hidden z-50"
                            style={{
                              top: menuPosition.top,
                              left: menuPosition.left,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleView(promo)}
                              className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                            >
                              <Eye className="w-4.5 h-4.5 text-[#454345]" />
                              <span className="font-dm-sans text-base text-[#454345]">
                                View Offer
                              </span>
                            </button>
                            <button
                              onClick={() => handleEdit(promo)}
                              className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                            >
                              <Edit2 className="w-4.5 h-4.5 text-[#454345]" />
                              <span className="font-dm-sans text-base text-[#454345]">
                                Edit Offer
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(promo)}
                              className="w-full flex items-center gap-2.5 px-6 py-4.5 hover:bg-[#FAFAFA] transition text-red-600"
                            >
                              <Trash2 className="w-4.5 h-4.5 text-red-600" />
                              <span className="font-dm-sans text-base text-red-600">
                                Delete Offer
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {promotions.map((promo) => {
              const statusConfig = getStatusConfig(promo.status || "Draft", true);
              const typeConfig = getTypeConfig(promo.type, true);
              
              return (
                <div
                  key={promo.id}
                  className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-dm-sans font-medium text-base text-[#303237] mb-1">
                        {promo.title || promo.offerTitle}
                      </p>
                      <p className="font-dm-sans text-sm text-[#454345]">
                        {promo.offerId}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleActionClick(promo.id, e)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="text-[#303237]"
                      >
                        <circle cx="10" cy="5" r="2" fill="currentColor" />
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                        <circle cx="10" cy="15" r="2" fill="currentColor" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {/* ✅ NEW: Type badge with icon */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-dm-sans ${typeConfig.bgClass} ${typeConfig.textClass}`}
                    >
                      {typeConfig.icon}
                      {typeConfig.label}
                    </span>
                    
                    {/* ✅ NEW: Status badge with icon */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-dm-sans ${statusConfig.bgClass} ${statusConfig.textClass}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-dm-sans text-[#454345]">
                      <span className="font-medium text-[#303237]">Users:</span>{" "}
                      {promo.eligibleUser}
                    </p>
                    <p className="font-dm-sans text-[#454345]">
                      <span className="font-medium text-[#303237]">Ends:</span>{" "}
                      {promo.endDate}
                    </p>
                    <p className="font-dm-sans text-[#454345]">
                      <span className="font-medium text-[#303237]">Redeemed:</span>{" "}
                      {(promo.redemptions || 0).toLocaleString()}
                    </p>
                  </div>

                  {openMenuId === promo.id && (
                    <div
                      className="fixed w-42 bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] border border-[#E5E7EF] overflow-hidden z-50 mt-3"
                      style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleView(promo)}
                        className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                      >
                        <Eye className="w-4.5 h-4.5 text-[#454345]" />
                        <span className="font-dm-sans text-base text-[#454345]">
                          View Offer
                        </span>
                      </button>
                      <button
                        onClick={() => handleEdit(promo)}
                        className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                      >
                        <Edit2 className="w-4.5 h-4.5 text-[#454345]" />
                        <span className="font-dm-sans text-base text-[#454345]">
                          Edit Offer
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(promo)}
                        className="w-full flex items-center gap-2.5 px-6 py-4.5 hover:bg-[#FAFAFA] transition text-red-600"
                      >
                        <Trash2 className="w-4.5 h-4.5 text-red-600" />
                        <span className="font-dm-sans text-base text-red-600">
                          Delete Offer
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <PromotionalEmptyState />
      )}

      {/* View Detail Modal */}
      {detailPromo && (
        <PromotionDetailModal
          offer={detailPromo}
          isOpen={!!detailPromo}
          onClose={() => setDetailPromo(null)}
          onEdit={handleEditFromDetail}
        />
      )}

      {/* Edit Modal */}
      <CreatePromoOfferModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditPromo(null);
        }}
        offerToEdit={editPromo}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <DeletePromotionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletePromo(null);
        }}
        onConfirm={handleConfirmDelete}
        offerTitle={deletePromo?.offerTitle || deletePromo?.title}
      />
    </>
  );
};

export default PromotionalOffersTable;