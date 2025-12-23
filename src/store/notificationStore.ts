// src/store/notificationStore.ts
import { create } from 'zustand';
import {
  fetchNotificationPreferences,
  updateNotificationPreference,
  NotificationType,
} from '@/services/notificationService';

interface NotificationPreference {
  type: NotificationType;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationState {
  preferences: Partial<Record<NotificationType, NotificationPreference>>;
  loading: boolean;
  error: string | null;
  updating: Record<string, boolean>;
  updateError: Record<string, string | null>;
  hasInitialized: boolean; // ← NEW: Track if we've applied defaults once

  fetchPreferences: () => Promise<void>;
  updatePreference: (
    type: NotificationType,
    method: 'PUSH' | 'EMAIL',
    enabled: boolean
  ) => Promise<boolean>;
  getPreference: (type: NotificationType) => NotificationPreference | null;
  clearUpdateError: (key: string) => void;
}

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
  preferences: {},
  loading: false,
  error: null,
  updating: {},
  updateError: {},
  hasInitialized: false,

  fetchPreferences: async () => {
    const { hasInitialized } = get();

    set({ loading: true, error: null });

    try {
      const response = await fetchNotificationPreferences();
      console.log('Fetched global notification defaults:', response);

      const defaults = {
        email: !!response?.EMAIL,
        push: !!response?.PUSH,
        inApp: response?.IN_APP !== false,
      };

      set((state) => {
        const newPreferences = { ...state.preferences };

        // Only apply defaults to types that don't already have user settings
        ALL_NOTIFICATION_TYPES.forEach((type) => {
          if (!newPreferences[type]) {
            newPreferences[type] = {
              type,
              email: defaults.email,
              push: defaults.push,
              inApp: defaults.inApp,
            };
          }
          // If user has already toggled it → preserve their choice
        });

        return {
          preferences: newPreferences,
          loading: false,
          hasInitialized: true, // Mark as initialized after first load
        };
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load preferences';
      set({ error: msg, loading: false });
      console.error('Error fetching preferences:', error);
    }
  },

  updatePreference: async (type, method, enabled) => {
    const key = `${type}-${method}`;

    // Optimistic update
    set((state) => {
      const current = state.preferences[type];
      const updatedPref: NotificationPreference = {
        type,
        email: current?.email ?? false,
        push: current?.push ?? false,
        inApp: current?.inApp ?? true,
        [method.toLowerCase()]: enabled,
      };

      return {
        updating: { ...state.updating, [key]: true },
        updateError: { ...state.updateError, [key]: null },
        preferences: {
          ...state.preferences,
          [type]: updatedPref,
        },
      };
    });

    try {
      await updateNotificationPreference(type, method, enabled);
      console.log(`Preference saved: ${type} ${method} = ${enabled}`);

      // Success: just clear loading
      set((state) => ({
        updating: { ...state.updating, [key]: false },
      }));

      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update preference';

      // Revert optimistic change
      set((state) => {
        const current = state.preferences[type];
        if (!current) return state;

        return {
          preferences: {
            ...state.preferences,
            [type]: {
              ...current,
              [method.toLowerCase()]: !enabled,
            },
          },
          updating: { ...state.updating, [key]: false },
          updateError: { ...state.updateError, [key]: msg },
        };
      });

      console.error('Update failed:', error);
      return false;
    }
  },

  getPreference: (type) => {
    return get().preferences[type] ?? null;
  },

  clearUpdateError: (key) => {
    set((state) => ({
      updateError: { ...state.updateError, [key]: null },
    }));
  },
}));