"use client";

import React from "react";
import { NotificationRow } from "../components/shared/NotificationRow";

const alertTypes = [
  "Dispute Escalations",
  "Payment Disbursement",
  "Panic Alert",
  "New User Registrations",
  "Pending Verification",
  "Credit Requests",
  "Platform Downtime",
];

export const NotificationTab = () => {
  return (
    <div className="w-[878px] space-y-6">
      {/* Header */}
      <div className="w-[765px]">
        <h2 className="font-dm-sans font-medium text-[20px] leading-[140%] text-[#171417] mb-2">
          Notification Preferences
        </h2>
        <p className="font-dm-sans text-[16px] leading-[140%] text-[#6B6969]">
          Stay informed without the noise. Choose which alerts matter to you and how you’d like to receive them.
        </p>
      </div>

      {/* Table */}
      <div className="w-[724px] space-y-5">
        {/* Table Header */}
        <div className="flex items-center justify-between h-[28px] border-b border-[#E3E5E5]">
          <span className="font-dm-sans font-bold text-[16px] leading-[140%] text-[#171417]">
            Alert Type
          </span>

          <div className="flex items-center gap-[96px]">
            <span className="font-dm-sans font-bold text-[16px] leading-[140%] text-[#171417] w-[56px] text-center">
              Email
            </span>
            <span className="font-dm-sans font-bold text-[16px] leading-[140%] text-[#171417] w-[56px] text-center">
              In-app
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-6">
          {alertTypes.map((type) => (
            <NotificationRow key={type} label={type} />
          ))}
        </div>
      </div>
    </div>
  );
};
