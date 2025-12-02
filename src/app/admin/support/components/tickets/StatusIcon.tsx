import React from "react";
import { SupportTicket } from "@/types/SupportTicket";

const StatusIcon = ({ status }: { status: SupportTicket["status"] }) => {
  if (status === "Resolved") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M6.00016 10.7803L3.2135 8.00033L2.2735 8.94033L6.00016 12.667L14.0002 4.66699L13.0602 3.72699L6.00016 10.7803Z"
          fill="#1FC16B"
        />
      </svg>
    );
  }

  if (status === "In Progress") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#007BFF" strokeWidth="2" />
        <path d="M8 4V8L10.5 10.5" stroke="#007BFF" strokeWidth="2" />
      </svg>
    );
  }

  if (status === "New") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" fill="#9D7F04" />
      </svg>
    );
  }

  return null;
};

export default StatusIcon;
