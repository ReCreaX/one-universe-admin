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
   * Approve service(s) - intelligently chooses single or bulk endpoint
   */
  async approveServices(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      throw new Error("No services selected for approval");
    }

    // Single service - use individual endpoint
    if (ids.length === 1) {
      console.log(`✅ Approving single service: ${ids[0]}`);
      await this.approveSingleService(ids[0]);
    } else {
      // Multiple services - use bulk endpoint
      console.log(`✅ Approving ${ids.length} services via bulk endpoint`);
      await this.bulkApproveServices(ids);
    }
  }

  /**
   * Reject service(s) - intelligently chooses single or bulk endpoint
   */
  async rejectServices(ids: string[], reason?: string): Promise<void> {
    if (ids.length === 0) {
      throw new Error("No services selected for rejection");
    }

    // Single service - use individual endpoint
    if (ids.length === 1) {
      console.log(`✅ Rejecting single service: ${ids[0]}`);
      await this.rejectSingleService(ids[0], reason);
    } else {
      // Multiple services - use bulk endpoint
      console.log(`✅ Rejecting ${ids.length} services via bulk endpoint`);
      await this.bulkRejectServices(ids, reason);
    }
  }

  /**
   * Approve a single service
   */
  private async approveSingleService(id: string): Promise<void> {
    const endpoint = `/master-services/${encodeURIComponent(id)}/approve`;
    await this.request(endpoint, {
      method: "PATCH",
    });
  }

  /**
   * Reject a single service with reason
   */
  private async rejectSingleService(id: string, reason?: string): Promise<void> {
    const endpoint = `/master-services/${encodeURIComponent(id)}/reject`;
    await this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Bulk approve multiple services
   */
  async bulkApproveServices(ids: string[]): Promise<void> {
    const endpoint = "/master-services/bulk-approve";
    await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  }

  /**
   * Bulk reject multiple services with reason
   */
  async bulkRejectServices(ids: string[], reason?: string): Promise<void> {
    const endpoint = "/master-services/bulk-reject";
    await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ ids, reason }),
    });
  }

  /**
   * Public methods for backward compatibility
   */
  async approveService(id: string): Promise<void> {
    return this.approveSingleService(id);
  }

  async rejectService(id: string, reason?: string): Promise<void> {
    return this.rejectSingleService(id, reason);
  }

  async bulkApprove(ids: string[]): Promise<void> {
    return this.bulkApproveServices(ids);
  }

  async bulkReject(ids: string[], reason?: string): Promise<void> {
    return this.bulkRejectServices(ids, reason);
  }
}

// Export singleton instance
export const serviceManagementService = new ServiceManagementService();

// ============================================
// PUBLIC EXPORTS - BACKWARD COMPATIBLE
// ============================================

export const fetchServicesByStatus = () =>
  serviceManagementService.fetchServicesByStatus();

// Single service operations
export const approveService = (id: string) =>
  serviceManagementService.approveService(id);

export const rejectService = (id: string, reason?: string) =>
  serviceManagementService.rejectService(id, reason);

// Bulk operations
export const bulkApprove = (ids: string[]) =>
  serviceManagementService.bulkApprove(ids);

export const bulkReject = (ids: string[], reason?: string) =>
  serviceManagementService.bulkReject(ids, reason);

// NEW - Smart routing (uses correct endpoint based on count)
export const approveServices = (ids: string[]) =>
  serviceManagementService.approveServices(ids);

export const rejectServices = (ids: string[], reason?: string) =>
  serviceManagementService.rejectServices(ids, reason);