// @/services/serviceManagement.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export type ServiceStatus = "Pending" | "Approved" | "Rejected";

export interface SellerUser {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface SellerProfile {
  user?: SellerUser;
}

export interface Service {
  id: string;
  title: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectedAt?: string | null;
  rejectedReason?: string | null;
  sellerProfiles: SellerProfile[];
}

// API Response Type
interface ServicesByStatusResponse {
  status: string;
  message: string;
  approved: { data: Service[]; meta: { total: number } };
  pending: { data: Service[]; meta: { total: number } };
  rejected: { data: Service[]; meta: { total: number } };
}

class ServiceManagementService {
  /**
   * Generic request method with NextAuth session
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const session = await getSession();

    if (!session?.accessToken) {
      console.error("❌ No access token found in session");
      throw new Error("Unauthorized - Please log in again");
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
          ...options.headers,
        },
      });

      // Handle 401 - Token may have expired
      if (response.status === 401) {
        console.error("❌ Unauthorized: Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      if (response.status === 403) {
        console.error("❌ Forbidden: Access denied");
        throw new Error("Forbidden - Access denied");
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
   * Fetch services by status (Pending, Approved, Rejected)
   */
  async fetchServicesByStatus(): Promise<Service[]> {
    const endpoint = "/master-services/by-status?page=1&limit=100";
    const data: ServicesByStatusResponse = await this.request(endpoint);

    // Flatten all services into one array with consistent id
    const allServices: Service[] = [
      ...data.pending.data.map((s) => ({ ...s, id: s.id })),
      ...data.approved.data.map((s) => ({ ...s, id: s.id })),
      ...data.rejected.data.map((s) => ({ ...s, id: s.id })),
    ];

    return allServices;
  }

  /**
   * Approve a single service
   */
  async approveService(id: string): Promise<void> {
    const endpoint = `/master-services/${encodeURIComponent(id)}/approve`;
    await this.request(endpoint, {
      method: "PATCH",
    });
  }

  /**
   * Reject a single service with reason
   */
  async rejectService(id: string, reason?: string): Promise<void> {
    const endpoint = `/master-services/${encodeURIComponent(id)}/reject`;
    await this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Bulk approve multiple services
   */
  async bulkApprove(ids: string[]): Promise<void> {
    const endpoint = "/master-services/bulk-approve";
    await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  }

  /**
   * Bulk reject multiple services with reason
   */
  async bulkReject(ids: string[], reason?: string): Promise<void> {
    const endpoint = "/master-services/bulk-reject";
    await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ ids, reason }),
    });
  }
}

// Export singleton instance
export const serviceManagementService = new ServiceManagementService();

// Export legacy function names for backward compatibility
export const fetchServicesByStatus = () =>
  serviceManagementService.fetchServicesByStatus();

export const approveService = (id: string) =>
  serviceManagementService.approveService(id);

export const rejectService = (id: string, reason?: string) =>
  serviceManagementService.rejectService(id, reason);

export const bulkApprove = (ids: string[]) =>
  serviceManagementService.bulkApprove(ids);

export const bulkReject = (ids: string[], reason?: string) =>
  serviceManagementService.bulkReject(ids, reason);