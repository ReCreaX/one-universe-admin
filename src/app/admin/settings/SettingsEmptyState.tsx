"use client";

import React from "react";
import Image from "next/image";

const SettingsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Empty Illustration */}
      <div className="w-[160px] h-[160px] mb-8">
        <Image
          src="/empty/no-result.png" // Replace with your preferred empty state image
          alt="No results found"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </div>

      {/* Title & Description */}
      <h3 className="font-dm-sans font-bold text-lg md:text-xl leading-[140%] text-[#171417] mb-3">
        No Results Found
      </h3>
      <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] max-w-[520px]">
        We couldn’t find any records matching your search or filters.
      </p>
    </div>
  );
};

export default SettingsEmptyState;