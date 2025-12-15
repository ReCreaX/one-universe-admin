// components/Tabs/pricing/UpdatePlanPricingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { usePlanStore } from "@/store/planStore";
import { Plan } from "@/services/planService";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

// Toast Notification Component
const Toast: React.FC<Toast & { onClose: () => void }> = ({
  id,
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 animate-slide-in max-w-md`}
      style={{
        background:
          type === "success"
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={24} className="text-white flex-shrink-0" />
      ) : (
        <XCircle size={24} className="text-white flex-shrink-0" />
      )}
      <p className="text-white font-dm-sans font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Toast Container
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="p-6 space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface UpdatePlanPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  allPlans?: Plan[];
  onUpdate?: () => void;
}

const UpdatePlanPricingModal: React.FC<UpdatePlanPricingModalProps> = ({
  isOpen,
  onClose,
  plan,
  allPlans = [],
  onUpdate,
}) => {
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { updatePlanPrice, updating, updateError } = usePlanStore();

  if (!isOpen || !plan) return null;

  const formatPrice = (value: string) => {
    const num = value.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Find the matching plan of same name but different type
  const getOtherVariant = () => {
    return allPlans.find((p) => p.name === plan.name && p.type !== plan.type);
  };

  const otherVariant = getOtherVariant();
  const monthlyPlan = plan.type === "MONTHLY" ? plan : otherVariant;
  const yearlyPlan = plan.type === "YEARLY" ? plan : otherVariant;

  const handleSubmit = async () => {
    if (!selectedPlanId) return;

    let priceToUpdate = 0;
    if (selectedPlanId === monthlyPlan?.id) {
      priceToUpdate = parseFloat(monthlyPrice.replace(/,/g, ""));
    } else if (selectedPlanId === yearlyPlan?.id) {
      priceToUpdate = parseFloat(yearlyPrice.replace(/,/g, ""));
    }

    if (isNaN(priceToUpdate) || priceToUpdate <= 0) return;

    const success = await updatePlanPrice(selectedPlanId, priceToUpdate);
    if (success) {
      showToast(
        `${plan.name} price updated successfully to ₦${priceToUpdate.toLocaleString()}!`,
        "success"
      );
      setMonthlyPrice("");
      setYearlyPrice("");
      setSelectedPlanId(null);
      setTimeout(() => {
        onClose();
        onUpdate?.();
      }, 500);
    } else {
      const errorMsg = updateError[selectedPlanId] || "Failed to update price";
      showToast(errorMsg, "error");
    }
  };

  const isUpdating = selectedPlanId ? updating[selectedPlanId] : false;
  const error = selectedPlanId ? updateError[selectedPlanId] : null;

  const canSubmit = selectedPlanId && (
    (selectedPlanId === monthlyPlan?.id && monthlyPrice) ||
    (selectedPlanId === yearlyPlan?.id && yearlyPrice)
  );

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[556px] mx-auto">
          
          {/* Header */}
          <div className="bg-[#E8FBF7] border-b border-[#E8E3E3] px-8 py-8 flex justify-between items-center rounded-t-[16px]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#154751]">
                <Check size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-dm-sans font-medium text-lg text-[#171417]">
                  {plan?.name || 'Plan'}
                </h2>
                <p className="font-dm-sans text-sm text-[#6B6969]">
                  {plan?.description || 'Update plan pricing'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-lg transition-colors"
            >
              <X size={28} className="text-[#171417]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            {/* Current Prices */}
            <div className="flex flex-col md:flex-row gap-4">
              {monthlyPlan && (
                <div className="flex-1 bg-[#FFFCFC] border-l-4 border-[#154751] rounded-[8px] p-4 flex flex-col gap-2">
                  <p className="text-xs text-[#6B6969] font-dm-sans">Current Monthly Price</p>
                  <p className="text-lg font-bold text-[#171417]">
                    ₦{(monthlyPlan.price || 0).toLocaleString()}/month
                  </p>
                </div>
              )}
              {yearlyPlan && (
                <div className="flex-1 bg-[#FFFCFC] border-l-4 border-[#1ABF9E] rounded-[8px] p-4 flex flex-col gap-2">
                  <p className="text-xs text-[#6B6969] font-dm-sans">Current Yearly Price</p>
                  <p className="text-lg font-bold text-[#171417]">
                    ₦{(yearlyPlan.price || 0).toLocaleString()}/year
                  </p>
                </div>
              )}
            </div>

            {/* New Prices - Inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Monthly Input */}
              <div className="flex-1 flex flex-col gap-2">
                <label className={`font-dm-sans font-medium ${
                  selectedPlanId === monthlyPlan?.id ? "text-[#154751]" : "text-[#05060D]"
                }`}>
                  New Monthly Price (₦)
                </label>
                <input
                  type="text"
                  value={monthlyPrice}
                  onChange={(e) => {
                    setMonthlyPrice(formatPrice(e.target.value));
                    if (monthlyPlan?.id) setSelectedPlanId(monthlyPlan.id);
                  }}
                  onFocus={() => {
                    if (monthlyPlan?.id) setSelectedPlanId(monthlyPlan.id);
                  }}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 rounded-[12px] border-2 focus:outline-none text-center font-dm-sans text-lg transition-colors ${
                    selectedPlanId === monthlyPlan?.id
                      ? "border-[#154751] bg-white"
                      : "border-[#B2B2B4] bg-[#F9F9F9]"
                  }`}
                />
              </div>

              {/* Yearly Input */}
              <div className="flex-1 flex flex-col gap-2">
                <label className={`font-dm-sans font-medium ${
                  selectedPlanId === yearlyPlan?.id ? "text-[#1ABF9E]" : "text-[#05060D]"
                }`}>
                  New Yearly Price (₦)
                </label>
                <input
                  type="text"
                  value={yearlyPrice}
                  onChange={(e) => {
                    setYearlyPrice(formatPrice(e.target.value));
                    if (yearlyPlan?.id) setSelectedPlanId(yearlyPlan.id);
                  }}
                  onFocus={() => {
                    if (yearlyPlan?.id) setSelectedPlanId(yearlyPlan.id);
                  }}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 rounded-[12px] border-2 focus:outline-none text-center font-dm-sans text-lg transition-colors ${
                    selectedPlanId === yearlyPlan?.id
                      ? "border-[#1ABF9E] bg-white"
                      : "border-[#B2B2B4] bg-[#F9F9F9]"
                  }`}
                />
              </div>
            </div>

            {/* Error Message in Modal */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={18} />
                <p className="text-red-700 text-sm font-dm-sans">{error}</p>
              </div>
            )}

            {/* Update Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isUpdating}
                className={`px-12 md:px-16 py-4 rounded-[20px] font-dm-sans font-medium text-lg text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  canSubmit && !isUpdating ? "shadow-lg hover:shadow-xl cursor-pointer" : "opacity-60 cursor-not-allowed"
                }`}
                style={{
                  background:
                    canSubmit && !isUpdating
                      ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                      : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
                }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Pricing"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container at Top Right */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default UpdatePlanPricingModal;