// store/subscriptionStore.ts
import { create } from 'zustand';
import { fetchPremiumSubscriptions } from '@/services/subscriptionService';

interface Transaction {
  id: string;
  walletId: string;
  subscriptionId: string;
  amount: number;
  type: string;
  reference: string;
  description: string;
  createdAt: string;
  status: string;
  bookingId: string | null;
  holdUntil: string | null;
  hydrogenTxId: string;
}

interface Plan {
  id: string;
  name: string;
  frequency: number;
  isRecurring: boolean;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  type: string;
}

interface UserRole {
  role: {
    name: string;
  };
}

interface User {
  email: string;
  phone: string;
  fullName: string;
  userRoles: UserRole[];
  role: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planPriceSnapshot: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  cardToken: string | null;
  user: User;
  plan: Plan;
  transaction: Transaction | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Metrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  yetToRenew: number;
  totalRevenue: number;
}

interface SubscriptionState {
  // State
  subscriptions: Subscription[];
  metrics: Metrics | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  selectedSubscription: Subscription | null;
  searchTerm: string;
  selectedFilters: string[];

  // Actions
  setSubscriptions: (data: {
    data: Subscription[];
    metrics: Metrics;
    pagination: Pagination;
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedSubscription: (subscription: Subscription | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedFilters: (filters: string[]) => void;
  clearError: () => void;

  // API Actions
  fetchSubscriptions: (page?: number, limit?: number) => Promise<void>;

  // Computed
  getFilteredSubscriptions: () => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial State
  subscriptions: [],
  metrics: null,
  pagination: null,
  loading: false,
  error: null,
  selectedSubscription: null,
  searchTerm: '',
  selectedFilters: ['All'],

  // Basic Actions
  setSubscriptions: (data) =>
    set({
      subscriptions: data.data,
      metrics: data.metrics,
      pagination: data.pagination,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedSubscription: (subscription) =>
    set({ selectedSubscription: subscription }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  setSelectedFilters: (filters) => set({ selectedFilters: filters }),

  clearError: () => set({ error: null }),

  // API Actions - Uses NextAuth session automatically
  fetchSubscriptions: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchPremiumSubscriptions(page, limit);
      set({
        subscriptions: response.data,
        metrics: response.metrics,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      set({ error: errorMessage, loading: false });
      console.error('Subscription fetch error:', error);
    }
  },

  // Computed - Get filtered subscriptions based on search and filters
  getFilteredSubscriptions: () => {
    const { subscriptions, searchTerm, selectedFilters } = get();

    return subscriptions.filter((sub) => {
      // Search filter
      const matchesSearch =
        sub.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesFilter =
        selectedFilters.includes('All') || selectedFilters.includes(sub.status);

      return matchesSearch && matchesFilter;
    });
  },
}));