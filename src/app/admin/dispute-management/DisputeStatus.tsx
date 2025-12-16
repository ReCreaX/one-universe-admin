// components/DisputeStatus.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  CircleDot,
  Flag,
  Check,
  CircleCheck,
} from "lucide-react";
import React from "react";

type DisplayStatus = "New" | "Under review" | "Resolved" | "Open";
type ApiStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";

type DisputeStatusProps = {
  status: DisplayStatus | ApiStatus;
};

const statusConfig: Record<
  DisplayStatus,
  {
    icon: React.ReactNode;
    textClass: string;
    bgClass: string;
  }
> = {
  New: {
    icon: <Flag size={16} className="text-[#D00416]" />,
    bgClass: "bg-[#FB37481A]",
    textClass: "text-[#D00416]",
  },
  "Under review": {
    icon: <Check size={16} className="text-[#007BFF]" />,
    bgClass: "bg-[#D3E1FF]",
    textClass: "text-[#007BFF]",
  },
  Resolved: {
    icon: <CircleCheck size={16} className="text-[#1FC16B]" />,
    bgClass: "bg-[#E0F5E6]",
    textClass: "text-[#1FC16B]",
  },
  Open: {
    icon: <AlertTriangle size={16} className="text-[#9D7F04]" />,
    bgClass: "bg-[#FFF2B9]",
    textClass: "text-[#9D7F04]",
  },
};

// Map API status to display status
function mapApiStatusToDisplay(status: ApiStatus | DisplayStatus): DisplayStatus {
  const statusMap: Record<ApiStatus, DisplayStatus> = {
    OPEN: "Open",
    UNDER_REVIEW: "Under review",
    RESOLVED: "Resolved",
  };

  // If it's already a display status, return as is
  if (status in statusConfig) {
    return status as DisplayStatus;
  }

  // Otherwise map from API status
  return statusMap[status as ApiStatus];
}

export function DisputeStatus({ status }: DisputeStatusProps) {
  const displayStatus = mapApiStatusToDisplay(status);
  const config = statusConfig[displayStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[.875rem] font-medium",
        config.bgClass,
        config.textClass
      )}
    >
      {config.icon}
      {displayStatus}
    </span>
  );
}