// store/sponsorAdsStore.ts
import { create } from 'zustand';
import { fetchSponsorAds } from '@/services/sponsorAdsService';

interface Transaction {
  id: string;
  reference: string;
  serviceTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerUserId: string;
  buyerRole: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerUserId: string;
  sellerRole: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
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
  id: string;
  email: string;
  phone: string;
  fullName: string;
  userRoles: UserRole[];
  role: string;
}

export interface SponsorAd {
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
  transaction: Transaction | Transaction[] | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Metrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingRenewals: number;
  totalRevenue: number;
}

interface SponsorAdsState {
  // State
  ads: SponsorAd[];
  metrics: Metrics | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  selectedAd: SponsorAd | null;
  searchTerm: string;
  selectedFilters: string[];

  // Actions
  setAds: (data: {
    data: SponsorAd[];
    metrics: Metrics;
    pagination: Pagination;
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedAd: (ad: SponsorAd | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedFilters: (filters: string[]) => void;
  clearError: () => void;

  // API Actions
  fetchAds: (page?: number, limit?: number) => Promise<void>;

  // Computed
  getFilteredAds: () => SponsorAd[];
}

export const useSponsorAdsStore = create<SponsorAdsState>((set, get) => ({
  // Initial State
  ads: [],
  metrics: null,
  pagination: null,
  loading: false,
  error: null,
  selectedAd: null,
  searchTerm: '',
  selectedFilters: ['All'],

  // Basic Actions
  setAds: (data) =>
    set({
      ads: data.data,
      metrics: data.metrics,
      pagination: data.pagination,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedAd: (ad) => set({ selectedAd: ad }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  setSelectedFilters: (filters) => set({ selectedFilters: filters }),

  clearError: () => set({ error: null }),

  // API Actions - Uses NextAuth session automatically
  fetchAds: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchSponsorAds(page, limit);
      set({
        ads: response.data,
        metrics: response.metrics,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch sponsor ads';
      set({ error: errorMessage, loading: false });
      console.error('Sponsor ads fetch error:', error);
    }
  },

  // Computed - Get filtered ads based on search and filters
  getFilteredAds: () => {
    const { ads, searchTerm, selectedFilters } = get();

    return ads.filter((ad) => {
      // Search filter
      const matchesSearch =
        ad.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.plan.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesFilter =
        selectedFilters.includes('All') || selectedFilters.includes(ad.status);

      return matchesSearch && matchesFilter;
    });
  },
}));