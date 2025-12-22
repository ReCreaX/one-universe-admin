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

// Bulk operation result type
export interface BulkOperationResult {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  summary: {
    total: number;
    successCount: number;
    failureCount: number;
  };
}

// Custom error for bulk operations
export class BulkOperationError extends Error {
  constructor(
    public result: BulkOperationResult,
    message: string
  ) {
    super(message);
    this.name = "BulkOperationError";
  }
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
      // console.error("❌ No access token found in session");
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
        // console.error("❌ Unauthorized: Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      if (response.status === 403) {
        // console.error("❌ Forbidden: Access denied");
        throw new Error("Forbidden - Access denied");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.error(`❌ Request failed for ${endpoint}:`, error);
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
      // console.log(`✅ Approving single service: ${ids[0]}`);
      await this.approveSingleService(ids[0]);
    } else {
      // Multiple services - use bulk endpoint with fallback to individual processing
      // console.log(`✅ Approving ${ids.length} services via bulk endpoint`);
      await this.bulkApproveServicesWithFallback(ids);
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
      // console.log(`✅ Rejecting single service: ${ids[0]}`);
      await this.rejectSingleService(ids[0], reason);
    } else {
      // Multiple services - use bulk endpoint with fallback to individual processing
      // console.log(`✅ Rejecting ${ids.length} services via bulk endpoint`);
      await this.bulkRejectServicesWithFallback(ids, reason);
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
   * Bulk approve with fallback - tries bulk first, then individual services if bulk fails
   */
  private async bulkApproveServicesWithFallback(ids: string[]): Promise<void> {
    try {
      // Try bulk endpoint first
      await this.bulkApproveServices(ids);
      // console.log(`✅ Bulk approved ${ids.length} services successfully`);
    } catch (error) {
      // console.warn(`⚠️ Bulk approval failed, attempting individual approvals...`);
      
      // Fallback to individual approvals
      const result = await this.processIndividualApprovals(ids);
      
      // If all failed, throw original error
      if (result.summary.failureCount === ids.length) {
        throw error;
      }
      
      // If some succeeded, throw BulkOperationError with details
      if (result.summary.failureCount > 0) {
        throw new BulkOperationError(
          result,
          `Partial success: ${result.summary.successCount} approved, ${result.summary.failureCount} failed. ${result.failed.map(f => `${f.id}: ${f.error}`).join("; ")}`
        );
      }
    }
  }

  /**
   * Bulk reject with fallback - tries bulk first, then individual services if bulk fails
   */
  private async bulkRejectServicesWithFallback(ids: string[], reason?: string): Promise<void> {
    try {
      // Try bulk endpoint first
      await this.bulkRejectServices(ids, reason);
      // console.log(`✅ Bulk rejected ${ids.length} services successfully`);
    } catch (error) {
      // console.warn(`⚠️ Bulk rejection failed, attempting individual rejections...`);
      
      // Fallback to individual rejections
      const result = await this.processIndividualRejections(ids, reason);
      
      // If all failed, throw original error
      if (result.summary.failureCount === ids.length) {
        throw error;
      }
      
      // If some succeeded, throw BulkOperationError with details
      if (result.summary.failureCount > 0) {
        throw new BulkOperationError(
          result,
          `Partial success: ${result.summary.successCount} rejected, ${result.summary.failureCount} failed. ${result.failed.map(f => `${f.id}: ${f.error}`).join("; ")}`
        );
      }
    }
  }

  /**
   * Process individual approvals with detailed error tracking
   */
  private async processIndividualApprovals(ids: string[]): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      successful: [],
      failed: [],
      summary: {
        total: ids.length,
        successCount: 0,
        failureCount: 0,
      },
    };

    for (const id of ids) {
      try {
        await this.approveSingleService(id);
        result.successful.push(id);
        result.summary.successCount++;
        // console.log(`✅ Approved service: ${id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        result.failed.push({ id, error: errorMessage });
        result.summary.failureCount++;
        // console.error(`❌ Failed to approve service ${id}: ${errorMessage}`);
      }
    }

    return result;
  }

  /**
   * Process individual rejections with detailed error tracking
   */
  private async processIndividualRejections(
    ids: string[],
    reason?: string
  ): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      successful: [],
      failed: [],
      summary: {
        total: ids.length,
        successCount: 0,
        failureCount: 0,
      },
    };

    for (const id of ids) {
      try {
        await this.rejectSingleService(id, reason);
        result.successful.push(id);
        result.summary.successCount++;
        // console.log(`✅ Rejected service: ${id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        result.failed.push({ id, error: errorMessage });
        result.summary.failureCount++;
        // console.error(`❌ Failed to reject service ${id}: ${errorMessage}`);
      }
    }

    return result;
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