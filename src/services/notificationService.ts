// services/notificationService.ts
import { getSession } from 'next-auth/react';

const API_BASE_URL = 'https://one-universe-de5673cf0d65.herokuapp.com/api/v1';

// Notification type enum
export type NotificationType =
  | 'BOOKING_UPDATE'
  | 'JOB_STARTED'
  | 'JOB_COMPLETED'
  | 'JOB_CONFIRMED'
  | 'ADMIN_DISBURSEMENT'
  | 'GENERAL'
  | 'DISPUTE_NOTIFICATION'
  | 'ACCOUNT_UPDATE'
  | 'SECURITY'
  | 'ACCOUNT_DELETION'
  | 'PASSWORD_CHANGE'
  | 'EMAIL_CHANGE'
  | 'RENEGOTIATION'
  | 'WARNING'
  | 'SERVICE_QUOTE'
  | 'BUYER_DECLINE'
  | 'BUYER_ACCEPT'
  | 'SELLER_ACCEPT'
  | 'SELLER_DECLINE'
  | 'SERVICE_REQUEST'
  | 'SYSTEM'
  | 'PANIC_ALERT'
  | 'GET_HELP_SUPPORT'
  | 'QUOTE_UPDATED'
  | 'BOOKING_CREATED'
  | 'BOOKING_ACCEPTED_BUYER'
  | 'BOOKING_DECLINE_BUYER'
  | 'BOOKING_ACCEPTED_SELLER'
  | 'BOOKING_DECLINE_SELLER'
  | 'NEW_MESSAGE'
  | 'PAYMENT_REQUEST'
  | 'VERIFICATION'
  | 'SUBSCRIBE';

export type DeliveryMethod = 'PUSH' | 'EMAIL' | 'IN_APP';

// Readable notification type labels
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  BOOKING_UPDATE: 'Booking Updates',
  JOB_STARTED: 'Job Started',
  JOB_COMPLETED: 'Job Completed',
  JOB_CONFIRMED: 'Job Confirmed',
  ADMIN_DISBURSEMENT: 'Payment Disbursement',
  GENERAL: 'General Updates',
  DISPUTE_NOTIFICATION: 'Dispute Escalations',
  ACCOUNT_UPDATE: 'Account Updates',
  SECURITY: 'Security Alerts',
  ACCOUNT_DELETION: 'Account Deletion',
  PASSWORD_CHANGE: 'Password Changes',
  EMAIL_CHANGE: 'Email Changes',
  RENEGOTIATION: 'Renegotiation Requests',
  WARNING: 'Important Warnings',
  SERVICE_QUOTE: 'Service Quotes',
  BUYER_DECLINE: 'Buyer Declined',
  BUYER_ACCEPT: 'Buyer Accepted',
  SELLER_ACCEPT: 'Seller Accepted',
  SELLER_DECLINE: 'Seller Declined',
  SERVICE_REQUEST: 'Service Requests',
  SYSTEM: 'System Notifications',
  PANIC_ALERT: 'Panic Alerts',
  GET_HELP_SUPPORT: 'Support Requests',
  QUOTE_UPDATED: 'Quote Updates',
  BOOKING_CREATED: 'New Bookings',
  BOOKING_ACCEPTED_BUYER: 'Booking Accepted by Buyer',
  BOOKING_DECLINE_BUYER: 'Booking Declined by Buyer',
  BOOKING_ACCEPTED_SELLER: 'Booking Accepted by Seller',
  BOOKING_DECLINE_SELLER: 'Booking Declined by Seller',
  NEW_MESSAGE: 'New Messages',
  PAYMENT_REQUEST: 'Payment Requests',
  VERIFICATION: 'Verification Requests',
  SUBSCRIBE: 'Subscription Updates',
};

export interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean; // Read-only, always true
}

export interface NotificationPreferences {
  userId: string;
  preferences: NotificationPreference[];
}

/**
 * Generic request method with NextAuth session
 */
async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const session = await getSession();

  if (!session?.accessToken) {
    console.error('❌ No access token found in session');
    throw new Error('Unauthorized - Please log in again');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        ...options.headers,
      },
    });

    // Handle 401 - Token may have expired
    if (response.status === 401) {
      console.error('❌ Unauthorized: Token expired or invalid');
      throw new Error('Unauthorized - Session expired');
    }

    if (response.status === 403) {
      console.error('❌ Forbidden: Access denied');
      throw new Error('Forbidden - Access denied');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch all notification preferences for current user
 * Returns format: { IN_APP: boolean, EMAIL: boolean, PUSH: boolean }
 */
export const fetchNotificationPreferences = async (): Promise<any> => {
  return request('/notification-preferences');
};

/**
 * Update notification preference for a specific type and method
 */
export const updateNotificationPreference = async (
  notificationType: NotificationType,
  method: 'PUSH' | 'EMAIL',
  enabled: boolean
): Promise<{ enabled: boolean }> => {
  return request(
    `/notifications/preferences/${notificationType}/${method}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }
  );
};

/**
 * Get readable label for notification type
 */
export const getNotificationTypeLabel = (type: NotificationType): string => {
  return NOTIFICATION_TYPE_LABELS[type] || type.replace(/_/g, ' ');
};

/**
 * Format notification type to readable text
 */
export const formatNotificationType = (type: string): string => {
  // Convert BOOKING_UPDATE to Booking Updates
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};