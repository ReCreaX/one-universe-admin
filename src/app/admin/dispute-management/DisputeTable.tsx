"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Clock } from "lucide-react";
import { HiOutlineUsers } from "react-icons/hi2";

import React from "react";
import { cn } from "@/lib/utils";
import { DisputeStatus } from "./DisputeStatus";
import { IoReturnUpForward } from "react-icons/io5";
import { DisputeFilterState } from "./Filters/Disputefilters";
import { disputeModalStore } from "@/store/disputeManagementStore";
import { type Dispute } from "@/app/admin/utils/disputeStatusMapper";

const statusStyles: Record<string, string> = {
  OPEN: "bg-[#FB37481A] text-[#D00416]",
  UNDER_REVIEW: "bg-blue-100 text-blue-600",
  RESOLVED: "bg-green-100 text-green-600",
};

interface DisputeTableProps {
  disputes: Dispute[];
  activeFilters?: DisputeFilterState;
}

export default function DisputeTable({
  disputes = [],
  activeFilters = {},
}: DisputeTableProps) {
  const { openModal } = disputeModalStore();

  // Guard against empty or invalid data
  if (!disputes || !Array.isArray(disputes) || disputes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No disputes to display</p>
      </div>
    );
  }

  const handleOpenDispute = (dispute: Dispute) => {
    try {
      openModal("openDispute", dispute);
    } catch (error) {
      console.error("Error opening dispute modal:", error);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-[#E5E5E5]">
            <tr className="text-left text-[#646264] text-[1rem] leading-[140%] h-[60px] font-medium">
              <th className="py-3 px-4">Dispute ID</th>
              <th className="py-3 px-4">Service Title</th>
              <th className="py-3 px-4">Job Status</th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-[8px]">
                  <HiOutlineUsers size={18} color="#454345" />
                  <span>Parties</span>
                </div>
              </th>
              <th className="py-3 px-4">Date Raised</th>
              <th className="py-3 px-4">Dispute Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {disputes.map((dispute, i) => {
              // Safety checks for each dispute
              if (!dispute || !dispute.id) {
                return null;
              }

              return (
                <tr key={dispute.id || i} className="hover:bg-gray-50 leading-[140%] h-[60px]">
                  <td className="py-3 px-4 [color:var(--primary-radial)] font-medium text-[1rem]">
                    {dispute.id ? dispute.id.slice(0, 8).toUpperCase() : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-[#303237] text-[1rem] font-normal">
                    {dispute.booking?.serviceTitle || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className={cn(
                        "rounded-md py-1 px-2 flex items-center gap-[6px] w-fit",
                        dispute.booking?.status === "COMPLETED"
                          ? "bg-[#E0F5E6] text-[#1FC16B]"
                          : "bg-[#E5E5E5] text-[#272727]"
                      )}
                    >
                      <Clock size={16} />
                      <span>{dispute.booking?.status || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-[4px]">
                      <p>
                        <span className="text-[#646264] text-[.875rem] font-normal">
                          Buyer:{" "}
                        </span>
                        <span className="text-[#303237] text-[1rem] font-normal">
                          {dispute.buyer?.fullName || "N/A"}
                        </span>
                      </p>
                      <p>
                        <span className="text-[#646264] text-[.875rem] font-normal">
                          Seller:{" "}
                        </span>
                        <span className="text-[#303237] text-[1rem] font-normal">
                          {dispute.seller?.fullName || "N/A"}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#303237] font-normal text-[1rem]">
                    {dispute.createdAt
                      ? new Date(dispute.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <DisputeStatus status={dispute.status} />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      onClick={() => handleOpenDispute(dispute)}
                      variant={dispute.status === "RESOLVED" ? "secondary" : "default"}
                      className={cn(
                        "rounded-[20px] px-[12px] py-[8px] flex items-center gap-2 leading-[140%]",
                        dispute.status === "RESOLVED"
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "[background:var(--primary-radial)] text-[#FDFDFD]"
                      )}
                    >
                      <IoReturnUpForward size={18} />
                      <span className="font-medium text-[1rem]">
                        {dispute.status === "RESOLVED" ? "Resolved" : "Resolve"}
                      </span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {disputes.map((dispute, i) => {
          // Safety checks for each dispute
          if (!dispute || !dispute.id) {
            return null;
          }

          return (
            <Card key={dispute.id || i} className="rounded-2xl shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium">
                    Buyer: {dispute.buyer?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Seller: {dispute.seller?.fullName || "N/A"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium",
                      statusStyles[dispute.status] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {dispute.status || "UNKNOWN"}
                  </span>
                  <Button
                    onClick={() => handleOpenDispute(dispute)}
                    variant={dispute.status === "RESOLVED" ? "secondary" : "default"}
                    className={cn(
                      "rounded-full px-5 flex items-center gap-2",
                      dispute.status === "RESOLVED"
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gradient-to-r from-gray-800 to-black text-white"
                    )}
                  >
                    <RotateCcw size={16} />
                    {dispute.status === "RESOLVED" ? "Resolved" : "Resolve"}
                  </Button>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    {dispute.createdAt
                      ? `${new Date(dispute.createdAt).toLocaleDateString()} || ${new Date(
                          dispute.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "N/A"}
                  </span>
                  <span className="text-gray-400">&gt;</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}