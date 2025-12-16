"use client";

import { useState } from "react";
import { Menu, Mail } from "lucide-react";
import { TfiMenuAlt } from "react-icons/tfi";

export default function DisputeDetailsTabs() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="px-4 py-3">
      {/* Wrap buttons in w-fit container */}
      <div className="flex items-center gap-6 border-b-[0.5px] border-[#949394] w-fit">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 text-[1rem] font-normal transition-colors pb-2 ${
            activeTab === "details"
              ? "text-[#171417] border-b border-[#454345]"
              : "text-[#949394] hover:text-gray-700"
          }`}
        >
          <TfiMenuAlt className="w-4 h-4" />
          Dispute Details
        </button>

        {/* <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 text-[1rem] font-normal transition-colors pb-2 ${
            activeTab === "messages"
              ? "text-[#171417] border-b border-[#454345]"
              : "text-[#949394] hover:text-gray-700"
          }`}
        >
          <Mail className="w-4 h-4" />
          Message Log
        </button> */}
      </div>
    </div>
  );
}
