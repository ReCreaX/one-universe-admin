"use client";

import React from "react";
import { cn } from "@/lib/utils";

type PaymentStatusProps = {
  status: "PAID" | "PENDING" | "DISPUTED" | "PENDING REFUND" | "REFUNDED" | "FAILED";
};

const statusConfig: Record<PaymentStatusProps["status"], { textClass: string; bgClass: string }> = {
  PAID: { textClass: "text-[#1FC16B]", bgClass: "bg-[#E0F5E6]" },
  PENDING: { textClass: "text-[#007BFF]", bgClass: "bg-[#D3E1FF]" },
  DISPUTED: { textClass: "text-[#D00416]", bgClass: "bg-[#FB37481A]" },
  "PENDING REFUND": { textClass: "text-[#9D7F04]", bgClass: "bg-[#FFF2B9]" },
  REFUNDED: { textClass: "text-[#6B6B6B]", bgClass: "bg-[#F2F2F2]" },
  FAILED: { textClass: "text-[#D00416]", bgClass: "bg-[#FDEDED]" },
};

export function PaymentStatus({ status }: PaymentStatusProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[.875rem] font-medium",
        config.bgClass,
        config.textClass
      )}
    >
      {status}
    </span>
  );
}