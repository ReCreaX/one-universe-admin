// services/subscriptionService.ts
import { getSession } from 'next-auth/react';
import { Subscription, Pagination, Metrics } from '@/store/subscriptionStore';

const API_BASE_URL = 'https://one-universe-de5673cf0d65.herokuapp.com/api/v1';

interface SubscriptionResponse {
  plan: string;
  pagination: Pagination;
  metrics: Metrics;
  data: Subscription[];
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
 * Fetch premium subscriptions from the API
 */
export const fetchPremiumSubscriptions = async (
  page: number = 1,
  limit: number = 10
): Promise<SubscriptionResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('page', String(page));
  searchParams.append('limit', String(limit));

  const query = searchParams.toString();
  const endpoint = `/subscription/admin/premium${query ? `?${query}` : ''}`;

  return request(endpoint);
};

/**
 * Calculate metrics from subscriptions array
 */
export const getSubscriptionMetrics = (subscriptions: Subscription[]): Metrics => {
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'ACTIVE'
  ).length;
  const expiredSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'EXPIRED'
  ).length;
  const totalRevenue = subscriptions.reduce(
    (sum, sub) => sum + (sub.planPriceSnapshot || 0),
    0
  );

  return {
    totalSubscriptions,
    activeSubscriptions,
    yetToRenew: expiredSubscriptions,
    totalRevenue,
  };
};

/**
 * Format subscription dates to readable format
 */
export const formatSubscriptionData = (subscription: Subscription) => {
  const startDate = new Date(subscription.startDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const endDate = new Date(subscription.endDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    ...subscription,
    startDate,
    endDate,
  };
};

/**
 * Check if user is a seller
 */
export const isSeller = (user: any): boolean => {
  return (
    user.role === 'SELLER' ||
    user.userRoles?.some((ur: any) => ur.role?.name === 'SELLER') ||
    false
  );
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
 * Filter subscriptions by search term
 */
export const filterSubscriptionsBySearch = (
  subscriptions: Subscription[],
  searchTerm: string
): Subscription[] => {
  if (!searchTerm.trim()) return subscriptions;

  const term = searchTerm.toLowerCase();
  return subscriptions.filter((sub) =>
    sub.user.fullName.toLowerCase().includes(term) ||
    sub.user.email.toLowerCase().includes(term) ||
    sub.user.phone.toLowerCase().includes(term) ||
    sub.plan.name.toLowerCase().includes(term)
  );
};

/**
 * Filter subscriptions by status
 */
export const filterSubscriptionsByStatus = (
  subscriptions: Subscription[],
  statuses: string[]
): Subscription[] => {
  if (statuses.includes('All')) return subscriptions;
  return subscriptions.filter((sub) => statuses.includes(sub.status));
};

/**
 * Sort subscriptions by field
 */
export const sortSubscriptions = (
  subscriptions: Subscription[],
  sortBy: 'name' | 'date' | 'revenue' = 'date',
  ascending: boolean = true
): Subscription[] => {
  const sorted = [...subscriptions];

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
 * Export subscriptions to CSV format
 */
export const exportToCSV = (subscriptions: Subscription[]): string => {
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

  const rows = subscriptions.map((sub) => [
    sub.user.fullName,
    sub.user.email,
    sub.user.phone,
    sub.plan.name,
    formatSubscriptionData(sub).startDate,
    formatSubscriptionData(sub).endDate,
    sub.planPriceSnapshot,
    sub.status,
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
  subscriptions: Subscription[],
  filename: string = 'subscriptions.csv'
) => {
  const csv = exportToCSV(subscriptions);
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