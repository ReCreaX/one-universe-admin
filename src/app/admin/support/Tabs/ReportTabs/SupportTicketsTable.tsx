"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supportTicketStore } from "@/store/supportTicketStore";
import { SupportTicketStatus } from "@/services/supportService";
import ActionMenu from "../../components/tickets/ActionMenu";
import StatusIcon from "../../components/tickets/StatusIcon";
import TicketDetailView from "./TicketDetailView";
import EmptyState from "../../EmptyState";

interface SupportTicketsTableProps {
  searchQuery: string;
  selectedStatuses: string[];
}

const SupportTicketsTable = ({ searchQuery, selectedStatuses }: SupportTicketsTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Get state from store
  const {
    tickets,
    ticketsLoading,
    ticketsError,
    selectedTicket,
    currentPage,
    totalPages,
    totalTickets,
    fetchTickets,
    setSelectedTicket,
  } = supportTicketStore();

  // ✅ FIXED: Map UI status names to API status values
  const mapStatusToAPI = (statuses: string[]): SupportTicketStatus[] => {
    return statuses
      .map(status => {
        if (status === "New") return "NEW" as SupportTicketStatus;
        if (status === "In Progress") return "IN_PROGRESS" as SupportTicketStatus;
        if (status === "Resolved") return "RESOLVED" as SupportTicketStatus;
        return null;
      })
      .filter((s): s is SupportTicketStatus => s !== null);
  };

  // ✅ FIXED: Fetch tickets when filters change - pass ALL selected statuses
  useEffect(() => {
    const apiStatuses = mapStatusToAPI(selectedStatuses);
    
    console.log("📋 Fetching tickets with filters:", { 
      selectedStatuses,
      apiStatuses, 
      page: 1 
    });
    
    // If no statuses selected, fetch all; otherwise pass the statuses
    // Note: You may need to update your backend to accept multiple statuses
    fetchTickets(1, 10, apiStatuses.length > 0 ? apiStatuses[0] : undefined);
  }, [selectedStatuses, fetchTickets]);

  // ✅ FIXED: Client-side filtering for multiple statuses AND search
  const filteredTickets = useMemo(() => {
    let result = tickets;

    // Filter by selected statuses (client-side)
    const apiStatuses = mapStatusToAPI(selectedStatuses);
    if (apiStatuses.length > 0) {
      result = result.filter(ticket => 
        apiStatuses.includes(ticket.status as SupportTicketStatus)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.ticketId?.toLowerCase().includes(query) ||
        ticket.email?.toLowerCase().includes(query) ||
        ticket.subject?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tickets, selectedStatuses, searchQuery]);

  const handleActionClick = (
    ticketId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const menuWidth = 206;
    const menuHeight = 180;
    const padding = 16;

    let left = rect.right - menuWidth;
    if (left < padding) left = padding;
    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }

    let top = rect.bottom + window.scrollY + 8;
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    setMenuPosition({ top, left });
    setOpenMenuId(prev => prev === ticketId ? null : ticketId);
  };

  const openTicketDetail = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpenMenuId(null);
  };

  // Map API response to UI format for ActionMenu compatibility
  const mapTicketForUI = (ticket: any) => ({
    ...ticket,
    username: ticket.email,
    userRole: "User",
    submittedDate: formatDate(ticket.createdAt),
    originalStatus: ticket.status,
    status: ticket.status === "RESOLVED" ? "Resolved" : ticket.status === "IN_PROGRESS" ? "In Progress" : "New",
    attachments: ticket.screenshotUrls?.length > 0 
      ? ticket.screenshotUrls.map((url: string, idx: number) => ({
          name: `Attachment ${idx + 1}`,
          size: "Unknown"
        }))
      : undefined
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "RESOLVED": return "bg-[#E0F5E6] text-[#1FC16B]";
      case "IN_PROGRESS": return "bg-[#D3E1FF] text-[#007BFF]";
      case "NEW": return "bg-[#FFF2B9] text-[#9D7F04]";
      default: return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const openTicket = openMenuId ? tickets.find(t => t.id === openMenuId) : null;
  const mappedOpenTicket = openTicket ? mapTicketForUI(openTicket) : null;

  // Loading state
  if (ticketsLoading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154751]"></div>
      </div>
    );
  }

  // Error state
  if (ticketsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-dm-sans text-base">{ticketsError}</p>
        <button
          onClick={() => fetchTickets(1, 10, undefined)}
          className="mt-4 px-6 py-2 bg-[#154751] text-white rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* === CONTENT WHEN THERE ARE TICKETS === */}
      {filteredTickets.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Ticket ID</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Email</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Subject</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Submitted Date</th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ticket.ticketId}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ticket.email}</td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237] max-w-[300px] truncate">{ticket.subject}</td>
                    <td className="py-[18px] px-[25px]">
                      <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
                        <StatusIcon status={ticket.status === "RESOLVED" ? "Resolved" : ticket.status === "IN_PROGRESS" ? "In Progress" : "New"} />
                        <span className="font-dm-sans text-sm">{ticket.status.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{formatDate(ticket.createdAt)}</td>
                    <td className="py-[18px] px-[25px]">
                      <button
                        onClick={(e) => handleActionClick(ticket.id, e)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-dm-sans font-medium text-base text-[#303237]">{ticket.email}</span>
                      <span className="font-dm-sans text-sm text-[#454345]">{ticket.ticketId}</span>
                    </div>
                    <p className="font-dm-sans text-sm text-[#454345]">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleActionClick(ticket.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                      <circle cx="10" cy="5" r="2" fill="currentColor" />
                      <circle cx="10" cy="10" r="2" fill="currentColor" />
                      <circle cx="10" cy="15" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <p className="font-dm-sans text-sm text-[#303237] mb-3">{ticket.subject}</p>
                <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
                  <StatusIcon status={ticket.status === "RESOLVED" ? "Resolved" : ticket.status === "IN_PROGRESS" ? "In Progress" : "New"} />
                  <span className="font-dm-sans text-sm">{ticket.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => fetchTickets(currentPage - 1, 10, undefined)}
                disabled={currentPage === 1 || ticketsLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="font-dm-sans text-sm text-[#303237]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchTickets(currentPage + 1, 10, undefined)}
                disabled={currentPage === totalPages || ticketsLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        /* === EMPTY STATE === */
        <EmptyState type="support" />
      )}

      {/* Action Menu */}
      {mappedOpenTicket && (
        <ActionMenu
          ticket={mappedOpenTicket}
          isOpen={true}
          onClose={() => setOpenMenuId(null)}
          position={menuPosition}
          onViewDetails={openTicketDetail}
        />
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailView 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
};

export default SupportTicketsTable;