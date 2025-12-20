"use client";

import React, { useState } from "react";
import { Bell, Check, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status: "critical" | "warning" | "success" | "pending";
  isUnread: boolean;
  icon?: React.ReactNode;
}

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Panic Alert Triggered",
      message: "Seller #2941 (James Oladele) triggered a panic alert during a scheduled service.",
      timestamp: "10m ago",
      status: "critical",
      isUnread: true,
    },
    {
      id: "2",
      title: "Failed Disbursement",
      message: "Payment disbursement to buyer #5847 (Sarah Johnson) failed. Please review and retry.",
      timestamp: "2h ago",
      status: "warning",
      isUnread: true,
    },
    {
      id: "3",
      title: "Pending User Verification",
      message: "User verification pending for seller #3214 (Michael Chen). Review required.",
      timestamp: "May 13, 2025",
      status: "pending",
      isUnread: false,
    },
    {
      id: "4",
      title: "Dispute Raised",
      message: "A dispute has been raised on booking #8921 between buyer and seller. Urgent review needed.",
      timestamp: "May 12, 2025",
      status: "warning",
      isUnread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "critical":
        return {
          badge: "bg-[#FFF2B9]",
          badgeText: "text-[#9D7F04]",
          icon: "text-[#9D7F04]",
          label: "Critical",
        };
      case "warning":
        return {
          badge: "bg-[#D3E1FF]",
          badgeText: "text-[#007BFF]",
          icon: "text-[#007BFF]",
          label: "Retry",
        };
      case "pending":
        return {
          badge: "bg-[#E5E5E5]",
          badgeText: "text-[#242424]",
          icon: "text-[#242424]",
          label: "Pending",
        };
      case "success":
        return {
          badge: "bg-[#D3F5E3]",
          badgeText: "text-[#1FC16B]",
          icon: "text-[#1FC16B]",
          label: "Resolved",
        };
      default:
        return {
          badge: "bg-[#E5E5E5]",
          badgeText: "text-[#242424]",
          icon: "text-[#242424]",
          label: "Info",
        };
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-6 h-full py-12">
      {/* Vector Icon - PNG Image */}
      <div className="relative w-[120px] h-[120px]">
        <Image
          src="/notifications/empty-state-icon.png"
          alt="No notifications"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Content */}
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

  const NotificationCard = ({ 
    notification, 
    onMarkAsRead 
  }: { 
    notification: Notification;
    onMarkAsRead?: (id: string) => void;
  }) => {
    const styles = getStatusStyles(notification.status);

    return (
      <div
        className={`p-2 rounded-lg border border-[#E6E7E9] gap-3 flex cursor-pointer hover:bg-opacity-90 transition-colors ${
          notification.isUnread ? "bg-[#F5F5F5]" : "bg-white"
        }`}
        onClick={() => {
          onMarkAsRead?.(notification.id);
        }}
      >
        {/* Notification Icon */}
        <div className="w-8 h-8 rounded-lg border border-[#E6E7E9] flex items-center justify-center flex-shrink-0">
          <div className="w-5 h-4 flex items-center justify-center">
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 8L7 14L19 2"
                stroke="#154751"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 gap-2 flex flex-col">
          {/* Title and Time */}
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-dm-sans font-medium text-base text-[#171417]">
              {notification.title}
            </h4>
            <span className="font-dm-sans text-sm text-[#6B6969] flex-shrink-0">
              {notification.timestamp}
            </span>
          </div>

          {/* Date */}
          <p className="font-dm-sans text-sm text-[#565C69]">
            May 14, 2025
          </p>

          {/* Status and Action */}
          <div className="flex justify-between items-center gap-4 mt-2">
            {/* Status Badge */}
            <div
              className={`px-2 py-1 rounded-lg h-7 flex items-center gap-1.5 ${styles.badge}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z"
                  fill={`currentColor`}
                  className={styles.badgeText}
                />
              </svg>
              <span
                className={`font-dm-sans text-sm font-normal ${styles.badgeText}`}
              >
                {styles.label}
              </span>
            </div>

            {/* View Details Button */}
            <button className="flex items-center gap-2 text-[#154751] hover:opacity-80 transition-opacity">
              <span className="font-dm-sans text-sm font-normal">View Details</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Unread Indicator */}
        {notification.isUnread && (
          <div className="w-2 h-2 rounded-full bg-[#154751] border border-white flex-shrink-0 mt-1" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[682px] bg-white rounded-2xl shadow-lg p-6 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-3 border-b border-[#E8E3E3] mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <Bell size={20} className="text-[#171417]" />
          </div>
          <h2 className="font-dm-sans font-bold text-xl text-[#171417]">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-[#D84040] text-white text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-1 px-4 py-1.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{
            background:
              unreadCount > 0
                ? "radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)"
                : "linear-gradient(0deg, #ACC5CF, #ACC5CF)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L5.5 9L3 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-dm-sans text-sm font-normal">Mark all as read</span>
        </button>
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {/* Today Section */}
          <div>
            <div className="px-4 py-2 mb-3">
              <span className="font-dm-sans font-medium text-base text-[#454345]">
                Today
              </span>
            </div>

            <div className="space-y-3">
              {notifications
                .slice(0, 2)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
            </div>
          </div>

          {/* Older Section */}
          {notifications.length > 2 && (
            <div>
              <div className="px-4 py-2 mb-3 mt-6">
                <span className="font-dm-sans font-medium text-base text-[#454345]">
                  Older
                </span>
              </div>

              <div className="space-y-3">
                {notifications
                  .slice(2)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;