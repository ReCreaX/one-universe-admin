"use client";

import React, { useEffect } from "react";
import { Bell, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useNotificationsStore } from "@/store/Notificationsstore";
import { notificationsService } from "@/services/Notificationsservice";

interface NotificationsPanelProps {
  onClose?: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsStore();

  const [isMarkingAll, setIsMarkingAll] = React.useState(false);

  useEffect(() => {
    fetchNotifications({ limit: 10, offset: 0 });
  }, [fetchNotifications]);

  const getStatusStyles = (type: string) => {
    switch (type) {
      // Booking Related - Blue
      case "BOOKING_UPDATE":
      case "BOOKING_CREATED":
      case "BOOKING_ACCEPTED_BUYER":
      case "BOOKING_ACCEPTED_SELLER":
        return { badge: "bg-[#D3E1FF]", badgeText: "text-[#007BFF]", label: "Booking" };

      case "BOOKING_DECLINE_BUYER":
      case "BOOKING_DECLINE_SELLER":
        return { badge: "bg-[#FFE5E5]", badgeText: "text-[#D84040]", label: "Declined" };

      // Job Related - Green
      case "JOB_STARTED":
      case "JOB_COMPLETED":
      case "JOB_CONFIRMED":
        return { badge: "bg-[#D3F5E3]", badgeText: "text-[#1FC16B]", label: "Job Update" };

      // Payment Related - Purple
      case "ADMIN_DISBURSEMENT":
      case "PAYMENT_REQUEST":
        return { badge: "bg-[#E5D3FF]", badgeText: "text-[#8B5CF6]", label: "Payment" };

      // Dispute & Support - Yellow/Orange
      case "DISPUTE_NOTIFICATION":
        return { badge: "bg-[#FFF2B9]", badgeText: "text-[#9D7F04]", label: "Dispute" };
      
      case "GET_HELP_SUPPORT":
        return { badge: "bg-[#FFE5F0]", badgeText: "text-[#D84040]", label: "Support" };

      case "PANIC_ALERT":
        return { badge: "bg-[#FFD6D6]", badgeText: "text-[#C92A2A]", label: "Alert" };

      // Account & Security - Gray
      case "ACCOUNT_UPDATE":
      case "ACCOUNT_DELETION":
      case "PASSWORD_CHANGE":
      case "EMAIL_CHANGE":
      case "SECURITY":
      case "VERIFICATION":
        return { badge: "bg-[#E5E5E5]", badgeText: "text-[#242424]", label: "Account" };

      // Quotes & Service - Teal
      case "SERVICE_QUOTE":
      case "QUOTE_UPDATED":
      case "SERVICE_REQUEST":
        return { badge: "bg-[#D3F5F5]", badgeText: "text-[#0D9488]", label: "Quote" };

      // Acceptance/Decline - Green/Red
      case "BUYER_ACCEPT":
      case "SELLER_ACCEPT":
        return { badge: "bg-[#D3F5E3]", badgeText: "text-[#1FC16B]", label: "Accepted" };

      case "BUYER_DECLINE":
      case "SELLER_DECLINE":
        return { badge: "bg-[#FFE5E5]", badgeText: "text-[#D84040]", label: "Declined" };

      // Renegotiation - Orange
      case "RENEGOTIATION":
        return { badge: "bg-[#FFF4E5]", badgeText: "text-[#F97316]", label: "Renegotiation" };

      // Messages - Blue
      case "NEW_MESSAGE":
        return { badge: "bg-[#E0F2FF]", badgeText: "text-[#0284C7]", label: "Message" };

      // Warning - Red
      case "WARNING":
        return { badge: "bg-[#FFEAEA]", badgeText: "text-[#DC2626]", label: "Warning" };

      // System & General - Gray
      case "SYSTEM":
      case "GENERAL":
      case "SUBSCRIBE":
        return { badge: "bg-[#F3F4F6]", badgeText: "text-[#4B5563]", label: "General" };

      default:
        return { badge: "bg-[#E5E5E5]", badgeText: "text-[#242424]", label: "Info" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-6 h-full py-12">
      <div className="relative w-[120px] h-[120px]">
        <Image
          src="/notifications/empty-state-icon.png"
          alt="No notifications"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-dm-sans font-medium text-base text-[#171417]">
          No new notifications at the moment
        </h3>
        <p className="font-dm-sans text-sm text-[#B5B1B1]">
          Check back later for updates.
        </p>
      </div>
    </div>
  );

  const NotificationCard = ({ notification }: { notification: typeof notifications[0] }) => {
    const styles = getStatusStyles(notification.type);
    const isUnread = !notification.isRead;
    const [isMarking, setIsMarking] = React.useState(false);

    const handleClick = async () => {
      if (isUnread && !isMarking) {
        setIsMarking(true);
        await markAsRead(notification.id);
        setIsMarking(false);
      }
    };

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await deleteNotification(notification.id);
    };

    // Determine if notification should have "View Details" button and where to redirect
    const getRedirectUrl = () => {
      const ticketId = notification.data?.ticketId;
      if (!ticketId) return null;

      switch (notification.type) {
        case "DISPUTE_NOTIFICATION":
          return `/admin/dispute-management?disputeId=${ticketId}`;
        
        case "GET_HELP_SUPPORT":
          return `/admin/support?ticketId=${ticketId}`;
        
        // Add other types that need redirection here
        // For now, only dispute and support redirect
        default:
          return null;
      }
    };

    const redirectUrl = getRedirectUrl();

    const handleViewDetails = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    };

    return (
      <div
        className={`p-3 rounded-lg border border-[#E6E7E9] gap-3 flex cursor-pointer hover:bg-gray-50 transition-colors relative ${
          isUnread ? "bg-[#F5F5F5]" : "bg-white"
        } ${isMarking ? "opacity-50" : ""}`}
        onClick={handleClick}
      >
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#6B6969] hover:text-[#D84040] hover:bg-gray-100 rounded transition-colors z-10"
          aria-label="Delete notification"
        >
          <X size={16} />
        </button>

        <div className="w-8 h-8 rounded-lg border border-[#E6E7E9] flex items-center justify-center flex-shrink-0">
          {notification.sender?.profilePicture ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={notification.sender.profilePicture}
                alt={notification.sender.fullName || "User"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <Bell size={16} className="text-[#154751]" />
          )}
        </div>

        <div className="flex-1 gap-2 flex flex-col pr-10">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-dm-sans font-medium text-base text-[#171417] flex-1">
              {notification.title}
            </h4>
            <span className="font-dm-sans text-sm text-[#6B6969] flex-shrink-0">
              {notificationsService.formatTimestamp(notification.createdAt)}
            </span>
          </div>

          <p className="font-dm-sans text-sm text-[#565C69] line-clamp-2">
            {notification.body}
          </p>

          {notification.sender && (
            <p className="font-dm-sans text-xs text-[#6B6969]">
              From: {notification.sender.fullName}
            </p>
          )}

          <div className="flex justify-between items-center gap-4 mt-2">
            <div className={`px-2 py-1 rounded-lg h-7 flex items-center gap-1.5 ${styles.badge}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="4" fill="currentColor" className={styles.badgeText} />
              </svg>
              <span className={`font-dm-sans text-sm font-normal ${styles.badgeText}`}>
                {styles.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {redirectUrl && (
                <button
                  onClick={handleViewDetails}
                  className="flex items-center gap-2 text-[#154751] hover:opacity-80 transition-opacity"
                >
                  <span className="font-dm-sans text-sm font-normal">View Details</span>
                  <ChevronRight size={16} />
                </button>
              )}
              {isUnread && (
                <div className="w-2 h-2 rounded-full bg-[#154751] border border-white flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[682px] bg-white rounded-2xl shadow-lg p-6 md:p-4 relative">
      {/* Header with Close Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-3 border-b border-[#E8E3E3] mb-6">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-[#171417]" />
          <h2 className="font-dm-sans font-bold text-xl text-[#171417]">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-[#D84040] text-white text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setIsMarkingAll(true);
              await markAllAsRead();
              setIsMarkingAll(false);
            }}
            disabled={unreadCount === 0 || isLoading || isMarkingAll}
            className="flex items-center gap-1 px-4 py-1.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
            style={{
              background:
                unreadCount > 0
                  ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                  : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
            }}
          >
            {isMarkingAll ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-dm-sans text-sm font-normal">Marking...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L5.5 9L3 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-dm-sans text-sm font-normal">Mark all as read</span>
              </>
            )}
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close notifications panel"
            >
              <X size={20} className="text-[#6B6969]" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 h-full py-12">
          <div className="w-8 h-8 border-4 border-[#154751] border-t-transparent rounded-full animate-spin" />
          <p className="font-dm-sans text-sm text-[#6B6969]">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 h-full py-12">
          <div className="p-4 rounded-lg bg-[#FFE5E5]">
            <p className="font-dm-sans text-sm text-[#D84040]">{error}</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {(() => {
            const today = new Date().toDateString();
            const todayNotifications = notifications.filter(
              n => new Date(n.createdAt).toDateString() === today
            );
            const olderNotifications = notifications.filter(
              n => new Date(n.createdAt).toDateString() !== today
            );

            return (
              <>
                {todayNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 mb-3">
                      <span className="font-dm-sans font-medium text-base text-[#454345]">Today</span>
                    </div>
                    <div className="space-y-3">
                      {todayNotifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} />
                      ))}
                    </div>
                  </div>
                )}

                {olderNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 mb-3 mt-6">
                      <span className="font-dm-sans font-medium text-base text-[#454345]">Older</span>
                    </div>
                    <div className="space-y-3">
                      {olderNotifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;