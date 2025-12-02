import React from "react";
import Image from "next/image";

const EmptySupportTickets = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Empty State Icon */}
      <div className="w-[150px] h-[150px] mb-6 relative">
        <Image
          src="/empty/empty-support.png"
          alt="No support tickets"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Empty State Text */}
      <h3 className="font-dm-sans font-bold text-base leading-[140%] text-[#171417] mb-2">
        No Support Requests Yet
      </h3>
      <p className="font-dm-sans text-base leading-[140%] text-[#6B6969] text-center max-w-[600px]">
        All user-reported issues will appear here. You're all caught up for now!
      </p>
    </div>
  );
};

export default EmptySupportTickets;