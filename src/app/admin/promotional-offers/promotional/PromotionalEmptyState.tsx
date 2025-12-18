"use client";
import React from "react";
import Image from "next/image";

interface PromotionalEmptyStateProps {
  onCreateOffer?: () => void; // ✅ FIXED: Add callback prop
}

const PromotionalEmptyState: React.FC<PromotionalEmptyStateProps> = ({ onCreateOffer }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Empty Illustration */}
      <div className="w-[160px] h-[160px] mb-8">
        <Image
          src="/empty/empty-state.png"
          alt="No results found"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </div>
      
      {/* Title & Description */}
      <h3 className="font-dm-sans font-bold text-lg md:text-xl leading-[140%] text-[#171417] mb-3">
        No Promotional Offers Yet
      </h3>
      
      <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] max-w-[520px] mb-6">
        Start engaging your users by creating limited-time offers, bonuses, or discounts.
      </p>

      {/* Create Offer Button */}
      <button
        className="relative flex items-center justify-center gap-2 w-[241px] h-[48px] rounded-[20px] px-6 py-4 hover:opacity-90 transition-opacity"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
        }}
        onClick={onCreateOffer} // ✅ FIXED: Use the callback prop
        type="button"
      >
        {/* Plus icon */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path 
            d="M8 3.33334V12.6667M3.33333 8H12.6667" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Button text */}
        <span 
          className="font-dm-sans font-medium text-base leading-[140%]"
          style={{ color: '#FDFDFD' }}
        >
          Create Your First Offer
        </span>
      </button>
    </div>
  );
};

export default PromotionalEmptyState;