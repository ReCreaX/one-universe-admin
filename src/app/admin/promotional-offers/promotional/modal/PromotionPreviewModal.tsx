// components/modal/PromotionPreviewModal.tsx
"use client";

import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PromotionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromotionPreviewModal: React.FC<PromotionPreviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TEAL HEADER */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3] relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/30 rounded-lg transition"
                >
                  <ArrowLeft className="w-6 h-6 text-[#171417]" />
                </button>
                <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                  Promotion Preview
                </h2>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div className="px-8 py-6 bg-white">
            <p className="font-dm-sans font-medium text-base leading-[140%] text-[#171417] text-left">
              How this promotion will appear to users
            </p>
          </div>

          {/* Main Content */}
          <div className="px-8 pt-6 pb-10 bg-[#FAFAFA]">
            {/* Promotion Card */}
            <div className="bg-gradient-to-br from-[#154751] to-[#04171F] rounded-lg p-8 text-white">
              {/* ICON + TITLE ON THE SAME LINE */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F093FB] to-[#F5576C] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-dm-sans font-bold text-2xl leading-[140%] bg-gradient-to-r from-[#A4C0FF] to-white bg-clip-text text-transparent">
                  Welcome Bonus
                </h3>
              </div>

              {/* Description */}
              <p className="text-center font-dm-sans text-base leading-[140%] text-[#FFFDFD] mb-6">
                Get 20% off your first booking
              </p>

              {/* Claim Button */}
              <div className="flex justify-center">
                <button className="flex items-center gap-2 bg-white text-[#04171F] font-dm-sans font-medium text-sm px-6 py-2.5 rounded-full hover:shadow-lg transition">
                  Claim Now
                </button>
              </div>
            </div>

            {/* Reward Flow Simulation */}
            <div className="mt-10 space-y-5">
              <h3 className="text-[#171417] font-dm-sans font-bold text-base leading-[140%]">
                Reward Flow Simulation:
              </h3>
              <ol className="space-y-3 text-[#171417] font-dm-sans text-sm leading-[150%] list-decimal list-inside">
                <li>User signs up → Promotion triggers automatically</li>
                <li>User makes first booking → 20% discount applied</li>
                <li>User saves money → Increased satisfaction</li>
                <li className="text-[#154751] font-medium">
                  Platform gains new active user → Success!
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionPreviewModal;