// store/notificationStore.ts
import { create } from 'zustand';
import {
  fetchNotificationPreferences,
  updateNotificationPreference,
  NotificationPreference,
  NotificationType,
} from '@/services/notificationService';

interface NotificationState {
  // State
  preferences: NotificationPreference[];
  loading: boolean;
  error: string | null;
  updating: Record<string, boolean>; // Track loading per preference
  updateError: Record<string, string | null>; // Track errors per preference

  // Actions
  setPreferences: (preferences: NotificationPreference[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // API Actions
  fetchPreferences: () => Promise<void>;
  updatePreference: (
    notificationType: NotificationType,
    method: 'PUSH' | 'EMAIL',
    enabled: boolean
  ) => Promise<boolean>;

  // Helper
  getPreference: (
    notificationType: NotificationType
  ) => NotificationPreference | undefined;
}

// List of all notification types from backend
const ALL_NOTIFICATION_TYPES: NotificationType[] = [
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

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial State
  preferences: [],
  loading: false,
  error: null,
  updating: {},
  updateError: {},

  // Basic Actions
  setPreferences: (preferences) => set({ preferences }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // API Actions
  fetchPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchNotificationPreferences();
      console.log('✅ Notification preferences fetched:', response);

      // Create preference objects for all notification types
      // Response format: { IN_APP: boolean, EMAIL: boolean, PUSH: boolean }
      const preferences: NotificationPreference[] = ALL_NOTIFICATION_TYPES.map(
        (type) => ({
          type,
          email: response.EMAIL || false,
          push: response.PUSH || false,
          inApp: response.IN_APP !== false, // IN_APP is always true or defaults to true
        })
      );

      set({
        preferences,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch preferences';
      set({ error: errorMessage, loading: false });
      console.error('Fetch preferences error:', error);
    }
  },

  // Update single preference
  updatePreference: async (notificationType, method, enabled) => {
    const key = `${notificationType}-${method}`;
    set((state) => ({
      updating: { ...state.updating, [key]: true },
      updateError: { ...state.updateError, [key]: null },
    }));

    try {
      await updateNotificationPreference(notificationType, method, enabled);
      console.log(
        `✅ Preference updated: ${notificationType} ${method} = ${enabled}`
      );

      // Update local state
      set((state) => ({
        preferences: state.preferences.map((pref) => {
          if (pref.type === notificationType) {
            return {
              ...pref,
              [method.toLowerCase()]: enabled,
            };
          }
          return pref;
        }),
        updating: { ...state.updating, [key]: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update preference';
      set((state) => ({
        updating: { ...state.updating, [key]: false },
        updateError: { ...state.updateError, [key]: errorMessage },
      }));
      console.error('Update preference error:', error);
      return false;
    }
  },

  // Get single preference
  getPreference: (notificationType) => {
    const { preferences } = get();
    return preferences.find((pref) => pref.type === notificationType);
  },
}));