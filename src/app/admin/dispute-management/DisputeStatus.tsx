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

type DisputeStatusProps = {
  status: "New" | "Under review" | "Resolved" | "Open";
};

const statusConfig: Record<
  DisputeStatusProps["status"],
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

export function DisputeStatus({ status }: DisputeStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[.875rem] font-medium",
        config.bgClass,
        config.textClass
      )}
    >
      {config.icon}
      {status}
    </span>
  );
}
