"use client";

import React from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative w-[42px] h-[24px] rounded-full transition-colors"
      style={{
        background: enabled
          ? "linear-gradient(to right, #154751, #04171F)"
          : "#E3E5E5",
      }}
    >
      <div
        className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: enabled ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  );
};
