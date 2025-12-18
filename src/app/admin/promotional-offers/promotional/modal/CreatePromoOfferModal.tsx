"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import PromotionPreviewModal from "./PromotionPreviewModal";
import { usePromotionalStore } from "@/store/promotionalStore";
import useToastStore from "@/store/useToastStore";
import { PromotionalOfferAPI } from "@/services/promotionalService";

interface CreatePromoOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerToEdit?: PromotionalOfferAPI | null;
  mode?: "create" | "edit";
}

export default function CreatePromoOfferModal({
  isOpen,
  onClose,
  offerToEdit = null,
  mode = "create",
}: CreatePromoOfferModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToastStore();
  const { createPromotion, updatePromotion, fetchAllPromotions, fetchStats } = usePromotionalStore();

  const [formData, setFormData] = useState({
    offerTitle: "",
    type: "",
    eligibleUser: "",
    activationTrigger: "",
    startDate: "",
    endDate: "",
    rewardValue: "",
    rewardUnit: "NGN",
    maxRedemptionPerUser: "1",
    maxTotalRedemption: "500",
    status: mode === "create" ? "DRAFT" : "DRAFT",
  });

  useEffect(() => {
    if (offerToEdit && mode === "edit") {
      setFormData({
        offerTitle: offerToEdit.offerTitle,
        type: offerToEdit.type,
        eligibleUser: offerToEdit.eligibleUser,
        activationTrigger: offerToEdit.activationTrigger,
        startDate: offerToEdit.startDate,
        endDate: offerToEdit.endDate,
        rewardValue: offerToEdit.rewardValue.toString(),
        rewardUnit: offerToEdit.rewardUnit,
        maxRedemptionPerUser: offerToEdit.maxRedemptionPerUser?.toString() || "1",
        maxTotalRedemption: offerToEdit.maxTotalRedemption?.toString() || "500",
        status: offerToEdit.status,
      });
    }
  }, [offerToEdit, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = 
    formData.offerTitle &&
    formData.type &&
    formData.eligibleUser &&
    formData.activationTrigger &&
    formData.startDate &&
    formData.endDate &&
    formData.rewardValue &&
    formData.maxRedemptionPerUser &&
    formData.maxTotalRedemption;

  const handleSaveAsDraft = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const payload = {
        offerTitle: formData.offerTitle,
        eligibleUser: formData.eligibleUser,
        type: formData.type,
        activationTrigger: formData.activationTrigger,
        status: "DRAFT",
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxRedemptionPerUser: parseInt(formData.maxRedemptionPerUser),
        maxTotalRedemption: parseInt(formData.maxTotalRedemption),
        rewardValue: parseFloat(formData.rewardValue),
        rewardUnit: formData.rewardUnit,
      };

      console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));

      if (mode === "edit" && offerToEdit) {
        await updatePromotion(offerToEdit.id, payload);
        showToast(
          "success",
          "Success",
          "Promotion updated as draft successfully",
          3000
        );
      } else {
        await createPromotion(payload);
        showToast(
          "success",
          "Success",
          "Promotion saved as draft successfully",
          3000
        );
      }

      // Refetch with validated parameters
      const validPage = 1;
      const validPageSize = 100;
      console.log(`🔄 Refetching with page=${validPage}, pageSize=${validPageSize}`);
      
      await Promise.all([
        fetchAllPromotions(validPage, validPageSize),
        fetchStats(),
      ]);

      onClose();
    } catch (err: any) {
      console.error("❌ Error saving draft:", err);
      showToast(
        "error",
        "Error",
        err.message || "Failed to save draft",
        3000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const payload = {
        offerTitle: formData.offerTitle,
        eligibleUser: formData.eligibleUser,
        type: formData.type,
        activationTrigger: formData.activationTrigger,
        status: "ACTIVE",
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxRedemptionPerUser: parseInt(formData.maxRedemptionPerUser),
        maxTotalRedemption: parseInt(formData.maxTotalRedemption),
        rewardValue: parseFloat(formData.rewardValue),
        rewardUnit: formData.rewardUnit,
      };

      console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));

      if (mode === "edit" && offerToEdit) {
        await updatePromotion(offerToEdit.id, payload);
        showToast(
          "success",
          "Success",
          "Promotion updated successfully",
          3000
        );
      } else {
        await createPromotion(payload);
        showToast(
          "success",
          "Success",
          "Promotion published successfully",
          3000
        );
      }

      // Refetch with validated parameters
      const validPage = 1;
      const validPageSize = 100;
      console.log(`🔄 Refetching with page=${validPage}, pageSize=${validPageSize}`);
      
      await Promise.all([
        fetchAllPromotions(validPage, validPageSize),
        fetchStats(),
      ]);

      onClose();
    } catch (err: any) {
      console.error("❌ Error publishing promotion:", err);
      showToast(
        "error",
        "Error",
        err.message || "Failed to publish",
        3000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-[760px] max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-6 md:px-8 py-6 md:py-8 flex justify-between items-start sticky top-0 z-10">
            <h2 className="font-dm-sans font-bold text-xl md:text-2xl text-[#171417] leading-[140%]">
              {mode === "edit" ? "Edit Promotional Offer" : "Create New Promotional Offer"}
            </h2>
            <button onClick={onClose} className="text-[#171417] hover:opacity-70 transition" disabled={isSubmitting}>
              <X size={24} />
            </button>
          </div>

          <div className="px-6 md:px-8 py-6 md:py-8 overflow-y-auto flex-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Offer Title <span className="text-[#D84040]">*</span>
                </label>
                <input
                  type="text"
                  name="offerTitle"
                  value={formData.offerTitle}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="e.g Welcome Bonus"
                  className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751] disabled:bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Offer Type <span className="text-[#D84040]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base text-[#B2B2B4] focus:outline-none appearance-none bg-white cursor-pointer disabled:bg-gray-100"
                  >
                    <option value="">Select offer type</option>
                    <option value="DISCOUNT">Discount (%)</option>
                    <option value="BONUS">Bonus (Fixed NGN)</option>
                    <option value="CREDIT_WALLET">Credit Wallet</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2B2B4] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Eligible Users <span className="text-[#D84040]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="eligibleUser"
                    value={formData.eligibleUser}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base text-[#B2B2B4] focus:outline-none appearance-none bg-white cursor-pointer disabled:bg-gray-100"
                  >
                    <option value="">Select eligible users</option>
                    <option value="BUYER">Buyers</option>
                    <option value="SELLER">Sellers</option>
                    <option value="ALL">All Users</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2B2B4] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Activation Trigger <span className="text-[#D84040]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="activationTrigger"
                    value={formData.activationTrigger}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base text-[#B2B2B4] focus:outline-none appearance-none bg-white cursor-pointer disabled:bg-gray-100"
                  >
                    <option value="">Select trigger</option>
                    <option value="SIGNUP">Sign Up</option>
                    <option value="FIRST_BOOKING">First Booking</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B2B2B4] pointer-events-none" />
                </div>
              </div>

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
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base focus:outline-none disabled:bg-gray-100"
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Value <span className="text-[#D84040]">*</span>
                </label>
                <input
                  type="number"
                  name="rewardValue"
                  value={formData.rewardValue}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="e.g 20"
                  className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751] disabled:bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="font-dm-sans font-medium text-base text-[#171417]">
                  Reward Unit <span className="text-[#D84040]">*</span>
                </label>
                <input
                  type="text"
                  name="rewardUnit"
                  value={formData.rewardUnit}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="e.g %, NGN"
                  className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751] disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    Max per User <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxRedemptionPerUser"
                    value={formData.maxRedemptionPerUser}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="e.g 1"
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751] disabled:bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-dm-sans font-medium text-base text-[#171417]">
                    Max Total <span className="text-[#D84040]">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxTotalRedemption"
                    value={formData.maxTotalRedemption}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="e.g 500"
                    className="w-full px-4 py-3 border border-[#B2B2B4] rounded-lg font-dm-sans text-base placeholder-[#B7B6B7] focus:outline-none focus:border-[#154751] disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-8 pt-6 border-t border-[#E8E3E3]">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={isSubmitting}
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-[#171417] border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
              >
                Preview
              </button>

              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={!isValid || isSubmitting}
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-[#171417] bg-white hover:bg-gray-50 transition disabled:opacity-50"
                style={{ border: "2px solid #154751" }}
              >
                {isSubmitting ? "Saving..." : mode === "edit" ? "Update Draft" : "Save as Draft"}
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={!isValid || isSubmitting}
                className="px-6 py-4 rounded-full font-dm-sans font-medium text-base text-white disabled:opacity-50"
                style={{
                  background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)',
                }}
              >
                {isSubmitting ? "Publishing..." : mode === "edit" ? "Update Offer" : "Publish Offer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PromotionPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </>
  );
}