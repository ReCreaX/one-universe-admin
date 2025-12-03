"use client";

import React, { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

interface NotificationRowProps {
  label: string;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({ label }) => {
  const [email, setEmail] = useState(false);
  const [inApp, setInApp] = useState(false);

  return (
    <div className="flex items-center justify-between h-[58px]">
      <span className="font-dm-sans text-[16px] leading-[140%] text-[#6B6969] w-[200px]">
        {label}
      </span>

      <div className="flex gap-[150px]">
        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={email} onToggle={() => setEmail(!email)} />
        </div>

        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={inApp} onToggle={() => setInApp(!inApp)} />
        </div>
      </div>
    </div>
  );
};
