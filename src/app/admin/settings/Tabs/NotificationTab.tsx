"use client";

import React, { useEffect } from "react";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import {
  getNotificationTypeLabel,
  NotificationType,
} from "@/services/notificationService";

/**
 * Toggle Switch Component
 */
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className="relative w-[42px] h-[24px] rounded-full transition-colors disabled:opacity-50"
    style={{
      background: enabled
        ? "linear-gradient(to right, #154751, #04171F)"
        : "#E3E5E5",
    }}
  >
    <div
      className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300"
      style={{ transform: enabled ? "translateX(20px)" : "translateX(2px)" }}
    />
  </button>
);

/**
 * Notification Row Component
 */
interface NotificationRowProps {
  label: string;
  notificationType: NotificationType;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
  label,
  notificationType,
}) => {
  const { getPreference, updatePreference, updating, updateError } =
    useNotificationStore();

  const preference = getPreference(notificationType);

  // If preference not loaded yet, don't render (will show loading at parent level)
  if (!preference) return null;

  const emailKey = `${notificationType}-EMAIL`;
  const pushKey = `${notificationType}-PUSH`;

  const isUpdatingEmail = updating[emailKey] || false;
  const isUpdatingPush = updating[pushKey] || false;
  const emailErr = updateError[emailKey];
  const pushErr = updateError[pushKey];

  const handleEmailToggle = async (enabled: boolean) => {
    await updatePreference(notificationType, "EMAIL", enabled);
  };

  const handlePushToggle = async (enabled: boolean) => {
    await updatePreference(notificationType, "PUSH", enabled);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-4 md:py-0 md:h-[58px]">
        <span className="font-dm-sans text-sm md:text-base leading-[140%] text-[#6B6969] flex-1 md:w-[200px]">
          {label}
        </span>

        <div className="flex gap-8 md:gap-[150px]">
          {/* Email Toggle */}
          <div className="w-[56px] flex justify-center relative">
            {isUpdatingEmail && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-[#154751]" />
              </div>
            )}
            <div style={{ opacity: isUpdatingEmail ? 0.5 : 1 }}>
              <ToggleSwitch
                enabled={preference.email}
                onChange={handleEmailToggle}
                disabled={isUpdatingEmail}
              />
            </div>
          </div>

          {/* Push Toggle */}
          <div className="w-[56px] flex justify-center relative">
            {isUpdatingPush && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-[#154751]" />
              </div>
            )}
            <div style={{ opacity: isUpdatingPush ? 0.5 : 1 }}>
              <ToggleSwitch
                enabled={preference.push}
                onChange={handlePushToggle}
                disabled={isUpdatingPush}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(emailErr || pushErr) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2 mx-4 md:mx-0">
          <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
          <p className="text-red-700 text-xs md:text-sm">
            {emailErr || pushErr}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Main Notification Tab Component
 */
export const NotificationTab = () => {
  const { preferences, loading, error, fetchPreferences } =
    useNotificationStore();

  // Fetch on mount
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Get all types to render (in consistent order)
  const allTypes: NotificationType[] = [
    'BOOKING_UPDATE',
    'JOB_STARTED',
    'JOB_COMPLETED',
    'JOB_CONFIRMED',
    'ADMIN_DISBURSEMENT',
    'GENERAL',
    'DISPUTE_NOTIFICATION',
    'ACCOUNT_UPDATE',
    'SECURITY',
    'ACCOUNT_DELETION',
    'PASSWORD_CHANGE',
    'EMAIL_CHANGE',
    'RENEGOTIATION',
    'WARNING',
    'SERVICE_QUOTE',
    'BUYER_DECLINE',
    'BUYER_ACCEPT',
    'SELLER_ACCEPT',
    'SELLER_DECLINE',
    'SERVICE_REQUEST',
    'SYSTEM',
    'PANIC_ALERT',
    'GET_HELP_SUPPORT',
    'QUOTE_UPDATED',
    'BOOKING_CREATED',
    'BOOKING_ACCEPTED_BUYER',
    'BOOKING_DECLINE_BUYER',
    'BOOKING_ACCEPTED_SELLER',
    'BOOKING_DECLINE_SELLER',
    'NEW_MESSAGE',
    'PAYMENT_REQUEST',
    'VERIFICATION',
    'SUBSCRIBE',
  ];

  const hasPreferences = Object.keys(preferences).length > 0;

  if (loading && !hasPreferences) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#154751]" />
          <p className="text-[#6B6969] font-dm-sans">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 px-5 md:px-0">
      {/* Header */}
      <div>
        <h2 className="font-dm-sans font-medium text-lg md:text-[20px] text-[#171417] mb-2">
          Notification Preferences
        </h2>
        <p className="font-dm-sans text-sm md:text-base text-[#6B6969]">
          Stay informed without the noise. Choose which alerts matter to you.
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <p className="text-red-700 font-dm-sans font-medium text-sm">
              Failed to load preferences
            </p>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Preferences List */}
      {hasPreferences && !error && (
        <div className="space-y-5">
          {/* Table Header */}
          <div className="flex items-center justify-between h-[28px] border-b border-[#E3E5E5]">
            <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417]">
              Alert Type
            </span>
            <div className="flex gap-8 md:gap-24">
              <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417] w-14 text-center">
                Email
              </span>
              <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417] w-14 text-center">
                Push
              </span>
            </div>
          </div>

          {/* Rows */}
          {allTypes.map((type) => {
            const pref = preferences[type];
            if (!pref) return null; // Skip if somehow missing

            return (
              <NotificationRow
                key={type}
                label={getNotificationTypeLabel(type)}
                notificationType={type}
              />
            );
          })}

          {/* Info Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-blue-700 text-sm font-dm-sans">
              In-app notifications are always enabled to ensure you don't miss important updates.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !hasPreferences && !error && (
        <div className="text-center py-12">
          <p className="text-[#6B6969] font-dm-sans">
            No notification preferences available
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationTab;