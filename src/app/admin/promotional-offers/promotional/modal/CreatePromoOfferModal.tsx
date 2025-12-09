"use client";

import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import PromotionPreviewModal from "./PromotionPreviewModal"; // ← Your imported preview

interface CreatePromoOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePromoOfferModal({ isOpen, onClose }: CreatePromoOfferModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    offerTitle: "",
    offerType: "",
    eligibleUsers: [] as string[],
    activationTrigger: "",
    startDate: "",
    endDate: "",
    rewardValue: "",
    maxRedemptionsPerUser: "",
    maxTotalRedemptions: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (user: string) => {
    setFormData(prev => ({
      ...prev,
      eligibleUsers: prev.eligibleUsers.includes(user)
        ? prev.eligibleUsers.filter(u => u !== user)
        : [...prev.eligibleUsers, user]
    }));
  };

  const userOptions = ["Buyers", "Sellers", "All Users"];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
          
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 md:px-8 py-6 md:py-8 flex justify-between items-start sticky top-0 z-10">
            <div className="flex-1">
              <h2 className="font-dm-sans font-bold text-xl md:text-2xl text-[#171417] leading-[140%]">
                Create New Promotional Offer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#171417] hover:opacity-70 transition flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-6 md:px-8 py-6 md:py-8 overflow-y-auto flex-1">
            <div className="space-y-4 md:space-y-6">
              
              {/* Offer Title */}
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Offer Title <span className="text-[#D84040]">*</span>
                </label>
                <input
                  type="text"
                  name="offerTitle"
                  value={formData.offerTitle}
                  onChange={handleInputChange}
                  placeholder="e.g Welcome Bonus- 20% Off"
                  className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751]"
                />
              </div>

              {/* Offer Type */}
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Offer Type <span className="text-[#D84040]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="offerType"
                    value={formData.offerType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base text-[#B2B2B4] focus:outline-none appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select offer Type</option>
                    <option value="Discount">Discount</option>
                    <option value="Free Shipping">Free Shipping</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Cashback">Cashback</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2B2B4] pointer-events-none" />
                </div>
              </div>

              {/* Eligible Users */}
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Eligible Users <span className="text-[#D84040]">*</span>
                </label>
                <div className="flex gap-6">
                  {userOptions.map((user) => (
                    <label key={user} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.eligibleUsers.includes(user)}
                        onChange={() => handleCheckboxChange(user)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                        formData.eligibleUsers.includes(user)
                          ? "border-[#154751] bg-[#154751]"
                          : "border-[#757575] bg-white"
                      }`}>
                        {formData.eligibleUsers.includes(user) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-dm-sans text-base text-[#6B6969]">{user}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activation Trigger */}
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Activation Trigger <span className="text-[#D84040]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="activationTrigger"
                    value={formData.activationTrigger}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base text-[#B2B2B4] focus:outline-none appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select trigger</option>
                    <option value="Signup">Signup</option>
                    <option value="First Purchase">First Purchase</option>
                    <option value="Referral">Referral</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2B2B4] pointer-events-none" />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    Start Date <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    End Date <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base focus:outline-none"
                  />
                </div>
              </div>

              {/* Reward Value */}
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Value <span className="text-[#D84040]">*</span>
                </label>
                <input
                  type="text"
                  name="rewardValue"
                  value={formData.rewardValue}
                  onChange={handleInputChange}
                  placeholder="Enter % or amount (₦)"
                  className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751]"
                />
              </div>

              {/* Max Redemptions */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    Max Redemptions per User <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxRedemptionsPerUser"
                    value={formData.maxRedemptionsPerUser}
                    onChange={handleInputChange}
                    placeholder="e.g 1"
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    Max Total Redemptions <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxTotalRedemptions"
                    value={formData.maxTotalRedemptions}
                    onChange={handleInputChange}
                    placeholder="e.g 500"
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons — ALL ENABLED */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-8 pt-6 border-t border-[#E8E3E3] px-6 md:px-8 pb-6">
              {/* PREVIEW — NOW WORKING */}
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-[#171417] border border-gray-300 bg-white hover:bg-gray-50 transition"
              >
                Preview
              </button>

              <button
                type="button"
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-[#171417] bg-white hover:bg-gray-50 transition"
                style={{ border: "2px solid #154751" }}
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-white"
                style={{
                  background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                }}
              >
                Publish Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* YOUR IMPORTED PREVIEW MODAL */}
      <PromotionPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </>
  );
}