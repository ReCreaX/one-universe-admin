"use client";

import React, { useState, useRef } from "react";
import { SupportTicket } from "@/types/SupportTicket";
import ActionMenu from "../../components/tickets/ActionMenu";
import StatusIcon from "../../components/tickets/StatusIcon";

const SupportTicketsTable = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const tickets: SupportTicket[] = [
    {
      id: "1",
      ticketId: "#4685",
      username: "Wade Warren",
      subject: "Unable to upload profile picture",
      status: "Resolved",
      submittedDate: "12, May 2025",
    },
    {
      id: "2",
      ticketId: "#4684",
      username: "Sarah Smith",
      subject: "Payment processing error",
      status: "In Progress",
      submittedDate: "Nov 30, 2024",
    },
    {
      id: "3",
      ticketId: "#4683",
      username: "Mike Jones",
      subject: "Account verification issue",
      status: "New",
      submittedDate: "Nov 29, 2024",
    },
  ];

  const handleActionClick = (
    ticketId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    let left = rect.left - 186;
    const menuWidth = 206;

    if (left < 0) {
      left = rect.right - menuWidth;
    }

    if (window.innerWidth < rect.left + menuWidth) {
      left = window.innerWidth - menuWidth - 16;
    }

    setMenuPosition({
      top: rect.bottom + 8,
      left,
    });

    setOpenMenuId(openMenuId === ticketId ? null : ticketId);
  };

  const getStatusStyles = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Resolved":
        return "bg-[#E0F5E6] text-[#1FC16B]";
      case "In Progress":
        return "bg-[#D3E1FF] text-[#007BFF]";
      case "New":
        return "bg-[#FFF2B9] text-[#9D7F04]";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base leading-[140%] text-[#646264]">
                Ticket ID
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base leading-[140%] text-[#646264]">
                Username
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base leading-[140%] text-[#646264]">
                Subject
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base leading-[140%] text-[#646264]">
                Status
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base leading-[140%] text-[#646264]">
                Submitted Date
              </th>
              <th className="py-[18px] px-[25px] font-inter font-medium text-base leading-[100%] text-[#7B7B7B]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans font-normal text-base leading-[140%] text-[#303237]">
                  {ticket.ticketId}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans font-normal text-base leading-[140%] text-[#303237]">
                  {ticket.username}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans font-normal text-base leading-[140%] text-[#303237] max-w-[300px] truncate">
                  {ticket.subject}
                </td>
                <td className="py-[18px] px-[25px]">
                  <div
                    className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(
                      ticket.status
                    )}`}
                  >
                    <StatusIcon status={ticket.status} />
                    <span className="font-dm-sans font-normal text-sm leading-[140%]">
                      {ticket.status}
                    </span>
                  </div>
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans font-normal text-base leading-[140%] text-[#303237]">
                  {ticket.submittedDate}
                </td>

                <td className="py-[18px] px-[25px]">
                  <button
                    ref={(el) => {
                      buttonRefs.current[ticket.id] = el;
                    }}
                    onClick={(e) => handleActionClick(ticket.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={`More actions for ticket ${ticket.ticketId}`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#303237]"
                    >
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-dm-sans font-medium text-base text-[#303237]">
                    {ticket.username}
                  </span>
                  <span className="font-dm-sans text-sm text-[#454345]">
                    {ticket.ticketId}
                  </span>
                </div>
                <p className="font-dm-sans text-sm text-[#454345]">
                  {ticket.submittedDate}
                </p>
              </div>
              <button
                onClick={(e) => handleActionClick(ticket.id, e)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={`More actions for ticket ${ticket.ticketId}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#303237]"
                >
                  <circle cx="10" cy="5" r="2" fill="currentColor" />
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                  <circle cx="10" cy="15" r="2" fill="currentColor" />
                </svg>
              </button>
            </div>
            <p className="font-dm-sans text-sm text-[#303237] mb-3">
              {ticket.subject}
            </p>
            <div
              className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(
                ticket.status
              )}`}
            >
              <StatusIcon status={ticket.status} />
              <span className="font-dm-sans font-normal text-sm leading-[140%]">
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Menus */}
      {tickets.map((ticket) => (
        <ActionMenu
          key={ticket.id}
          ticket={ticket}
          isOpen={openMenuId === ticket.id}
          onClose={() => setOpenMenuId(null)}
          position={menuPosition}
        />
      ))}
    </>
  );
};

export default SupportTicketsTable;