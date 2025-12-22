"use client";

import React, { useState, useRef, useEffect } from "react";
import { supportTicketStore } from "@/store/supportTicketStore";
import { SupportTicketResponse } from "@/services/supportService";
import useToastStore from "@/store/useToastStore"; // Your toast store

interface TicketDetailViewProps {
  ticket: SupportTicketResponse;
  onClose: () => void;
}

const TicketDetailView = ({ ticket, onClose }: TicketDetailViewProps) => {
  const [response, setResponse] = useState("");
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    respondToTicket,
    markAsResolved,
    respondingToTicket,
    respondError,
  } = supportTicketStore();

  const toast = useToastStore();

  // Focus textarea when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  const handleSendResponse = async () => {
    if (!response.trim() || !ticket.id) return;

    const success = await respondToTicket(ticket.id, response.trim());

    if (success) {
      setResponse(""); // Clear input
      toast.showToast(
        "success",
        "Response Sent",
        "Your message has been sent to the user via email."
      );
      // Modal stays open so you can send more responses if needed
      // If you prefer to close: onClose();
    }
  };

  const handleMarkAsResolved = async () => {
    if (!ticket.id) return;

    const success = await markAsResolved(ticket.id);

    if (success) {
      toast.showToast(
        "success",
        "Ticket Resolved",
        "This ticket has been marked as resolved."
      );
      onClose(); // Close modal after resolving
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-[#E0F5E6] text-[#1FC16B] border border-[#1FC16B]";
      case "IN_PROGRESS":
        return "bg-[#D3E1FF] text-[#007BFF] border border-[#007BFF]";
      case "NEW":
        return "bg-[#FFF2B9] text-[#9D7F04] border border-[#9D7F04]";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "RESOLVED") {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6.00016 10.7803L3.2135 8.00033L2.2735 8.94033L6.00016 12.667L14.0002 4.66699L13.0602 3.72699L6.00016 10.7803Z"
            fill="#1FC16B"
          />
        </svg>
      );
    }
    if (status === "IN_PROGRESS") {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#007BFF" strokeWidth="2" fill="none" />
          <path d="M8 4V8L10.5 10.5" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3" fill="#9D7F04" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasAdminResponse =
    typeof ticket.adminResponse === "string" && ticket.adminResponse.trim().length > 0;

  const handleDownload = async (fileUrl: string) => {
    try {
      setDownloadingFile(fileUrl);
      const fileName = fileUrl.split("/").pop()?.split("?")[0] ?? "download";

      const res = await fetch(`/api/admin/download-document?url=${encodeURIComponent(fileUrl)}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text() || "Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.showToast(
        "error",
        "Download Failed",
        err instanceof Error ? err.message : "Unknown error"
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  const modalContent = (
    <>
      {/* Header */}
      <div className="bg-[#E8FBF7] px-6 py-5 md:px-8 md:py-6 border-b border-[#E8E3E3] flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
          Ticket ID: {ticket.ticketId}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-white rounded-lg transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#171417" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-6 md:px-8 space-y-8 overflow-y-auto">
        {/* Ticket Details */}
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Email</span>
            <span className="font-dm-sans font-medium text-base text-[#454345]">{ticket.email}</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Status</span>
            <div className={`inline-flex items-center gap-[6px] px-2 py-1 rounded-lg ${getStatusStyles(ticket.status)}`}>
              <StatusIcon status={ticket.status} />
              <span className="font-dm-sans text-sm leading-[140%]">{ticket.status.replace("_", " ")}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Submitted on</span>
            <span className="font-dm-sans text-base text-[#454345]">{formatDate(ticket.createdAt)}</span>
          </div>

          {ticket.respondedAt && (
            <div className="flex items-start gap-4">
              <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Responded on</span>
              <span className="font-dm-sans text-base text-[#454345]">{formatDate(ticket.respondedAt)}</span>
            </div>
          )}

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Subject</span>
            <span className="font-dm-sans text-base text-[#454345]">{ticket.subject}</span>
          </div>

          <div className="flex items-start gap-4">
            <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Description</span>
            <span className="font-dm-sans text-base text-[#454345] leading-[140%] whitespace-pre-wrap">
              {ticket.description}
            </span>
          </div>

          {ticket.screenshotUrls && ticket.screenshotUrls.length > 0 && (
            <div className="flex items-start gap-4">
              <span className="font-dm-sans font-medium text-base text-[#171417] min-w-[160px]">Attachments</span>
              <div className="flex flex-col gap-4">
                {ticket.screenshotUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="8" fill="#F5F5F5" />
                      <path
                        d="M12 10H18L21 13V22C21 22.5304 20.7893 23.0391 20.4142 23.4142C20.0391 23.7893 19.5304 24 19 24H12C11.4696 24 10.9609 23.7893 10.5858 23.4142C10.2107 23.0391 10 22.5304 10 22V12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10Z"
                        stroke="#454345"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex flex-1 justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[#154751] font-medium text-[.875rem] truncate max-w-[200px]">
                          Attachment {idx + 1}
                        </h4>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8C8989] hover:text-[#154751] text-[.875rem] flex items-center gap-2"
                        >
                          View file
                        </a>
                      </div>
                      <button
                        onClick={() => handleDownload(url)}
                        disabled={downloadingFile === url}
                        className="text-[#373737] hover:text-[#154751] disabled:opacity-50"
                        title={downloadingFile === url ? "Downloading..." : "Download"}
                      >
                        {downloadingFile === url ? (
                          <div className="w-5 h-5 border-2 border-[#154751] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.83331 8.33333L9.99998 12.5L14.1666 8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Message */}
        <div className="space-y-2">
          <h3 className="font-dm-sans font-medium text-base text-[#171417]">User Message</h3>
          <div className="bg-[#E8FBF7] rounded-xl px-4 py-3">
            <p className="font-dm-sans text-base leading-[140%] text-[#171417]">{ticket.description}</p>
          </div>
        </div>

        {/* Admin Response */}
        {hasAdminResponse && (
          <div className="space-y-2">
            <h3 className="font-dm-sans font-medium text-base text-[#171417]">Admin Response</h3>
            <div className="bg-[#FFFAFA] rounded-xl px-4 py-3">
              <p className="font-dm-sans text-base leading-[140%] text-[#171417]">{ticket.adminResponse}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {respondError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="font-dm-sans text-sm text-red-600">{respondError}</p>
          </div>
        )}

        {/* Response Input */}
        {ticket.status !== "RESOLVED" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-dm-sans font-medium text-base text-[#171417]">
                {hasAdminResponse ? "Add Another Response:" : "Respond to User:"}
              </label>
              <textarea
                ref={textareaRef}
                value={response}
                onChange={handleResponseChange}
                placeholder="Type your response here..."
                className="w-full border border-[#B2B2B4] rounded-xl px-4 py-3 font-dm-sans text-base placeholder:text-[#B2B2B4] focus:outline-none focus:border-[#154751] resize-none"
                rows={4}
                disabled={respondingToTicket}
              />
            </div>

            <div className="flex items-center gap-2 text-[#454345]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#454345" strokeWidth="2" />
                <path d="M10 6V10L13 13" stroke="#454345" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="font-dm-sans text-base">Response will be sent via email to {ticket.email}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleSendResponse}
                disabled={!response.trim() || respondingToTicket}
                className={`flex-1 px-6 py-3 md:py-4 rounded-[36px] font-dm-sans font-medium text-base text-center transition-all ${
                  response.trim() && !respondingToTicket
                    ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white hover:opacity-90"
                    : "bg-[#ACC5CF] text-[#FFFEFE] cursor-not-allowed"
                }`}
              >
                {respondingToTicket ? "Sending..." : "Send Response"}
              </button>

              <button
                onClick={handleMarkAsResolved}
                disabled={respondingToTicket}
                className="px-6 py-4 rounded-[36px] border border-[#154751] text-[#154751] font-dm-sans font-medium text-base hover:bg-[#154751] hover:text-white transition-colors disabled:opacity-50"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        )}

        {/* Resolved State */}
        {ticket.status === "RESOLVED" && (
          <div className="bg-[#E0F5E6] border border-[#1FC16B] rounded-lg px-4 py-3 text-center">
            <p className="font-dm-sans font-medium text-base text-[#1FC16B]">This ticket has been resolved</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:fixed md:inset-0 md:z-[200] md:flex md:items-center md:justify-center md:p-4">
        <div className="absolute inset-0 bg-black/5" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-[671px] max-h-[90vh] overflow-y-auto">
          {modalContent}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed inset-0 z-[200] flex items-end">
        <div className="absolute inset-0 bg-black/5" onClick={onClose} />
        <div
          className="relative w-full bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {modalContent}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .md\\:hidden ~ div > div {
          animation: slide-up 0.35s ease-out;
        }
      `}</style>
    </>
  );
};

export default TicketDetailView;