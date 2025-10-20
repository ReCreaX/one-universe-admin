"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, RotateCcw, Clock } from "lucide-react";
import { HiOutlineUsers } from "react-icons/hi2";

import React from "react";
import { cn } from "@/lib/utils";
import { DisputeStatus } from "./DisputeStatus";
import { IoReturnUpForward } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { disputeModalStore, disputeType } from "@/store/disputeManagementStore";

const disputes: disputeType[] = [
  {
    id: "DP-10234",
    service: "Fashion Styling",
    jobStatus: "In Progress",
    buyer: "Jane Adebayo",
    seller: "Mike Chen",
    date: "12, May 2025",
    time: "11:00AM",
    status: "New",
  },
  {
    id: "DP-10234",
    service: "Graphic Design",
    jobStatus: "In Progress",
    buyer: "David White",
    seller: "Lisa Park",
    date: "12, May 2025",
    time: "11:00AM",
    status: "Under review",
  },
  {
    id: "DP-10234",
    service: "Copywriting",
    jobStatus: "Completed",
    buyer: "Jane Adebayo",
    seller: "Mike Chen",
    date: "12, May 2025",
    time: "11:00AM",
    status: "Resolved",
  },
  {
    id: "DP-10234",
    service: "Laptop Repair",
    jobStatus: "In Progress",
    buyer: "Sarah Johnson",
    seller: "Cathan Chen",
    date: "12, May 2025",
    time: "11:00AM",
    status: "Open",
  },
];

const statusStyles: Record<string, string> = {
  New: "bg-[#FB37481A] text-[#D00416]",
  "Under review": "bg-blue-100 text-blue-600",
  Resolved: "bg-green-100 text-green-600",
  Open: "bg-yellow-100 text-yellow-600",
};

export default function DisputeTable() {
  const openModal = disputeModalStore((state) => state.openModal);

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-[#E5E5E5]">
            <tr className="text-left text-[#646264] text-[1rem] leading-[140%] h-[60px]  font-medium">
              <th className="py-3 px-4 ">Dispute ID</th>
              <th className="py-3 px-4">Service Title</th>
              <th className="py-3 px-4">Job Status</th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-[8px]">
                  {" "}
                  <HiOutlineUsers size={18} color="#454345" />
                  <span className="">Parties</span>
                </div>
              </th>
              <th className="py-3 px-4">Dated Raised</th>
              <th className="py-3 px-4">Dispute Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {disputes.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50 leading-[140%] h-[60px]">
                <td className="py-3 px-4 [color:var(--primary-radial)] font-medium text-[1rem]">
                  {d.id}
                </td>
                <td className="py-3 px-4 text-[#303237] text-[1rem] font-normal">
                  {d.service}
                </td>
                <td
                  className={cn(
                    "rounded-md py-1 px-2 flex items-center gap-[6px]",
                    d.jobStatus === "Completed"
                      ? "bg-[#E0F5E6] text-[#1FC16B]"
                      : "bg-[#E5E5E5] text-[#272727]"
                  )}
                >
                  <Clock size={16} />
                  <span>{d.jobStatus}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-[4px]">
                    <p className="">
                      <span className="text-[#646264] text-[.875rem] font-normal">
                        Buyer: {""}
                      </span>
                      <span className="text-[#303237] text-[1rem] font-normal">
                        {d.buyer}
                      </span>
                    </p>
                    <p className="">
                      <span className="text-[#646264] text-[.875rem] font-normal">
                        Seller: {""}
                      </span>
                      <span className="text-[#303237] text-[1rem] font-normal">
                        {d.seller}
                      </span>
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#303237] font-normal text-[1rem]">
                  {d.date}
                </td>
                <td className="py-3 px-4">
                  <DisputeStatus status={d.status} />
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <Button
                    onClick={() => openModal("openDispute", d)}
                    variant={d.status === "Resolved" ? "secondary" : "default"}
                    className={cn(
                      "rounded-[20px] px-[12px] py-[8px] flex items-center gap-2 leading-[140%]",
                      d.status === "Resolved"
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "[background:var(--primary-radial)]  text-[#FDFDFD]"
                    )}
                  >
                    <IoReturnUpForward size={18} />{" "}
                    <span className="font-medium text-[1rem]">
                      {d.status === "Resolved" ? "Resolved" : "Resolve"}
                    </span>
                  </Button>
                  <button
                    type="button"
                    className="rounded-[8px] border border-[#B7B6B7] py-1 px-2 cursor-pointer"
                    aria-label="Send mail"
                    title="Send mail"
                  >
                    <CiMail className="text-[21px] text-[#373737]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {disputes.map((d, i) => (
          <Card key={i} className="rounded-2xl shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium">Buyer: {d.buyer}</p>
                <p className="text-sm text-gray-600">Seller: {d.seller}</p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium",
                    statusStyles[d.status]
                  )}
                >
                  {d.status}
                </span>
                <Button
                  onClick={() => openModal("openDispute", d)}
                  variant={d.status === "Resolved" ? "secondary" : "default"}
                  className={cn(
                    "rounded-full px-5 flex items-center gap-2",
                    d.status === "Resolved"
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gradient-to-r from-gray-800 to-black text-white"
                  )}
                >
                  <RotateCcw size={16} />{" "}
                  {d.status === "Resolved" ? "Resolved" : "Resolve"}
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  {d.date} || {d.time}
                </span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
