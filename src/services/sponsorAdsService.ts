// services/sponsorAdsService.ts
import { getSession } from 'next-auth/react';
import { SponsorAd, Pagination, Metrics } from '@/store/sponsorAdsStore';

const API_BASE_URL = 'https://one-universe-de5673cf0d65.herokuapp.com/api/v1';

interface SponsorAdsResponse {
  metrics: Metrics;
  pagination: Pagination;
  data: SponsorAd[];
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
 * Fetch sponsor ads subscriptions from the API
 */
export const fetchSponsorAds = async (
  page: number = 1,
  limit: number = 10
): Promise<SponsorAdsResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('page', String(page));
  searchParams.append('limit', String(limit));

  const query = searchParams.toString();
  const endpoint = `/subscription/admin/sponsor${query ? `?${query}` : ''}`;

  return request(endpoint);
};

/**
 * Calculate metrics from sponsor ads array
 */
export const getSponsorAdsMetrics = (ads: SponsorAd[]): Metrics => {
  const totalSubscriptions = ads.length;
  const activeSubscriptions = ads.filter(
    (ad) => ad.status === 'ACTIVE'
  ).length;
  const pendingRenewals = ads.filter(
    (ad) => ad.status === 'EXPIRED'
  ).length;
  const totalRevenue = ads.reduce(
    (sum, ad) => sum + (ad.planPriceSnapshot || 0),
    0
  );

  return {
    totalSubscriptions,
    activeSubscriptions,
    pendingRenewals,
    totalRevenue,
  };
};

/**
 * Format ad dates to readable format
 */
export const formatAdData = (ad: SponsorAd) => {
  const startDate = new Date(ad.startDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const endDate = new Date(ad.endDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    ...ad,
    startDate,
    endDate,
  };
};

/**
 * Get human-readable status label
 */
export const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    SUSPENDED: 'Suspended',
  };
  return statusMap[status] || status;
};

/**
 * Filter sponsor ads by search term
 */
export const filterAdsBySearch = (
  ads: SponsorAd[],
  searchTerm: string
): SponsorAd[] => {
  if (!searchTerm.trim()) return ads;

  const term = searchTerm.toLowerCase();
  return ads.filter((ad) =>
    ad.user.fullName.toLowerCase().includes(term) ||
    ad.user.email.toLowerCase().includes(term) ||
    ad.user.phone.toLowerCase().includes(term) ||
    ad.plan.name.toLowerCase().includes(term)
  );
};

/**
 * Filter sponsor ads by status
 */
export const filterAdsByStatus = (
  ads: SponsorAd[],
  statuses: string[]
): SponsorAd[] => {
  if (statuses.includes('All')) return ads;
  return ads.filter((ad) => statuses.includes(ad.status));
};

/**
 * Sort sponsor ads by field
 */
export const sortAds = (
  ads: SponsorAd[],
  sortBy: 'name' | 'date' | 'revenue' = 'date',
  ascending: boolean = true
): SponsorAd[] => {
  const sorted = [...ads];

  sorted.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.user.fullName;
        bValue = b.user.fullName;
        return ascending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);

      case 'revenue':
        aValue = a.planPriceSnapshot;
        bValue = b.planPriceSnapshot;
        return ascending ? aValue - bValue : bValue - aValue;

      case 'date':
      default:
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
        return ascending ? aValue - bValue : bValue - aValue;
    }
  });

  return sorted;
};

/**
 * Export sponsor ads to CSV format
 */
export const exportToCSV = (ads: SponsorAd[]): string => {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Plan',
    'Start Date',
    'End Date',
    'Price',
    'Status',
  ];

  const rows = ads.map((ad) => [
    ad.user.fullName,
    ad.user.email,
    ad.user.phone,
    ad.plan.name,
    formatAdData(ad).startDate,
    formatAdData(ad).endDate,
    ad.planPriceSnapshot,
    ad.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Download CSV file to user's computer
 */
export const downloadCSV = (
  ads: SponsorAd[],
  filename: string = 'sponsor-ads.csv'
) => {
  const csv = exportToCSV(ads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};