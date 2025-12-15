// services/planService.ts
import { getSession } from 'next-auth/react';

const API_BASE_URL = 'https://one-universe-de5673cf0d65.herokuapp.com/api/v1';

export type PlanType = 'MONTHLY' | 'YEARLY';
export type PlanName = 'Premium Plan' | 'Sponsor Ads';

export interface Plan {
  id: string;
  name: PlanName;
  frequency: number;
  isRecurring: boolean;
  description: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  type: PlanType;
}

export interface UpdatePlanPayload {
  price: number;
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
 * Fetch all plans
 */
export const fetchPlans = async (): Promise<Plan[]> => {
  const data = await request('/admin/plan');
  return Array.isArray(data) ? data : data.data || [];
};

/**
 * Update plan price
 */
export const updatePlanPrice = async (
  planId: string,
  price: number
): Promise<Plan> => {
  return request(`/admin/plan/${planId}`, {
    method: 'PATCH',
    body: JSON.stringify({ price }),
  });
};

/**
 * Group plans by type and name
 */
export const groupPlans = (
  plans: Plan[]
): Record<PlanName, Record<PlanType, Plan>> => {
  const grouped: Record<string, Record<string, Plan>> = {};

  plans.forEach((plan) => {
    if (!grouped[plan.name]) {
      grouped[plan.name] = {};
    }
    grouped[plan.name][plan.type] = plan;
  });

  return grouped as Record<PlanName, Record<PlanType, Plan>>;
};

/**
 * Get plan display name
 */
export const getPlanDisplayName = (name: PlanName): string => {
  switch (name) {
    case 'Premium Plan':
      return 'Premium Ranking';
    case 'Sponsor Ads':
      return 'Sponsor Ads';
    default:
      return name;
  }
};

/**
 * Get plan description
 */
export const getPlanDescription = (name: PlanName): string => {
  switch (name) {
    case 'Premium Plan':
      return 'Price for premium ranking subscriptions';
    case 'Sponsor Ads':
      return 'Price for sponsored ads placements';
    default:
      return 'Plan pricing';
  }
};

/**
 * Get plan icon color
 */
export const getPlanIconColor = (name: PlanName): string => {
  switch (name) {
    case 'Premium Plan':
      return '#154751';
    case 'Sponsor Ads':
      return '#1FC16B';
    default:
      return '#154751';
  }
};