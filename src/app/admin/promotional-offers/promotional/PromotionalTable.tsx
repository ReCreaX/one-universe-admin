"use client";

import React, { useState } from "react";
import { PromotionalOffer } from "@/types/PromotionalOffer";
import PromotionalEmptyState from "./PromotionalEmptyState";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface PromotionalOffersTableProps {
  offers: PromotionalOffer[];
}

const PromotionalOffersTable = ({ offers }: PromotionalOffersTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleActionClick = (
    offerId: string,
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
    setOpenMenuId(prev => prev === offerId ? null : offerId);
  };

  const handleView = (offer: PromotionalOffer) => {
    alert(`View offer: ${offer.title}`);
    setOpenMenuId(null);
  };

  const handleEdit = (offer: PromotionalOffer) => {
    alert(`Edit offer: ${offer.title}`);
    setOpenMenuId(null);
  };

  const handleDelete = (offer: PromotionalOffer) => {
    if (confirm(`Delete "${offer.title}"?`)) {
      alert("Deleted!");
    }
    setOpenMenuId(null);
  };

  const getStatusStyles = (status: PromotionalOffer["status"]) => {
    switch (status) {
      case "Active": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "Completed": return "bg-[#FFE8E8] text-[#D32F2F]";
      case "Expired": return "bg-[#FFE8E8] text-[#D32F2F]";
      case "Draft": return "bg-[#D3E1FF] text-[#007BFF]";
      default: return "";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "Discount": return "bg-[#FFF1E6] text-[#E67E22]";
      case "Free Shipping": return "bg-[#E8F5E9] text-[#388E3C]";
      case "Bundle": return "bg-[#F3E5F5] text-[#7B1FA2]";
      case "Cashback": return "bg-[#FFF8E1] text-[#F57F17]";
      default: return "";
    }
  };

  return (
    <>
      {offers.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Offer Title</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Type</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Eligible User</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">End Date</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Redemptions</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{offer.title}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg w-fit ${getTypeStyles(offer.type)}`}>
                        <span className="font-dm-sans text-sm font-medium">{offer.type}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{offer.eligibleUser}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{offer.endDate}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] font-medium">{offer.redemptions.toLocaleString()}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg ${getStatusStyles(offer.status)}`}>
                        <span className="font-dm-sans text-sm font-medium">{offer.status}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px] relative">
                      <button
                        onClick={(e) => handleActionClick(offer.id, e)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                          <circle cx="10" cy="5" r="2" fill="currentColor" />
                          <circle cx="10" cy="10" r="2" fill="currentColor" />
                          <circle cx="10" cy="15" r="2" fill="currentColor" />
                        </svg>
                      </button>

                      {/* PERFECT FIGMA MENU — 168×176px */}
                      {openMenuId === offer.id && (
                        <div
                          className="fixed w-42 bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] border border-[#E5E7EF] overflow-hidden z-50"
                          style={{ top: menuPosition.top, left: menuPosition.left }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* View Offer */}
                          <button
                            onClick={() => handleView(offer)}
                            className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                          >
                            <Eye className="w-4.5 h-4.5 text-[#454345]" />
                            <span className="font-dm-sans text-base text-[#454345]">View Offer</span>
                          </button>

                          {/* Edit Offer */}
                          <button
                            onClick={() => handleEdit(offer)}
                            className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition"
                          >
                            <Edit2 className="w-4.5 h-4.5 text-[#454345]" />
                            <span className="font-dm-sans text-base text-[#454345]">Edit Offer</span>
                          </button>

                          {/* Delete Offer */}
                          <button
                            onClick={() => handleDelete(offer)}
                            className="w-full flex items-center gap-2.5 px-6 py-4.5 hover:bg-[#FAFAFA] transition text-red-600"
                          >
                            <Trash2 className="w-4.5 h-4.5 text-red-600" />
                            <span className="font-dm-sans text-base text-red-600">Delete Offer</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards — Same menu */}
          <div className="md:hidden space-y-4 p-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-dm-sans font-medium text-base text-[#303237] mb-1">{offer.title}</p>
                    <p className="font-dm-sans text-sm text-[#454345]">{offer.offerId}</p>
                  </div>
                  <button
                    onClick={(e) => handleActionClick(offer.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${getTypeStyles(offer.type)}`}>
                    <span className="font-dm-sans font-medium">{offer.type}</span>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${getStatusStyles(offer.status)}`}>
                    <span className="font-dm-sans font-medium">{offer.status}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">User:</span> {offer.eligibleUser}</p>
                  <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Ends:</span> {offer.endDate}</p>
                  <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Redeemed:</span> {offer.redemptions.toLocaleString()}</p>
                </div>

                {/* SAME MENU IN MOBILE */}
                {openMenuId === offer.id && (
                  <div
                    className="fixed w-42 bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] border border-[#E5E7EF] overflow-hidden z-50"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => handleView(offer)} className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition">
                      <Eye className="w-4.5 h-4.5 text-[#454345]" />
                      <span className="font-dm-sans text-base text-[#454345]">View Offer</span>
                    </button>
                    <button onClick={() => handleEdit(offer)} className="w-full flex items-center gap-2.5 px-6 py-4.5 border-b border-[#E5E7EF] hover:bg-[#FAFAFA] transition">
                      <Edit2 className="w-4.5 h-4.5 text-[#454345]" />
                      <span className="font-dm-sans text-base text-[#454345]">Edit Offer</span>
                    </button>
                    <button onClick={() => handleDelete(offer)} className="w-full flex items-center gap-2.5 px-6 py-4.5 hover:bg-[#FAFAFA] transition text-red-600">
                      <Trash2 className="w-4.5 h-4.5 text-red-600" />
                      <span className="font-dm-sans text-base text-red-600">Delete Offer</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <PromotionalEmptyState />
      )}
    </>
  );
};

export default PromotionalOffersTable;