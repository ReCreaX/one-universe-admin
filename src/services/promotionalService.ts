// src/services/promotionalService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export interface PromotionalOfferAPI {
  id: string;
  offerTitle: string;
  eligibleUser: string;
  type: string;
  activationTrigger: string;
  status: string;
  startDate: string;
  endDate: string;
  maxRedemptionPerUser: number;
  maxTotalRedemption: number;
  rewardValue: number;
  rewardUnit: string;
  redemptions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionalStats {
  activePromotions: number;
  totalRedemptions: number;
  rewardGiven: number;
  newUsers: number;
}

interface PromotionsListResponse {
  items: PromotionalOfferAPI[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

class PromotionalService {
  /**
   * Generic request method with auth
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const session = await getSession();
    
    if (!session?.accessToken) {
      throw new Error("Unauthorized - Please log in again");
    }

    const fullUrl = `${baseUrl}${endpoint}`;
    console.log("\n🌐 REQUEST:", options.method || "GET", endpoint);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
          ...options.headers,
        },
      });

      const textData = await response.text();
      let data = {};
      try {
        data = JSON.parse(textData);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
      }

      if (!response.ok) {
        let errorMessage = "";
        
        if (typeof data === 'object' && data !== null) {
          if ((data as any).message) errorMessage = (data as any).message;
          else if ((data as any).error) errorMessage = (data as any).error;
          else if ((data as any).detail) errorMessage = (data as any).detail;
        }
        
        if (!errorMessage) {
          switch (response.status) {
            case 400:
              errorMessage = "Invalid request. Please check your input.";
              break;
            case 401:
              errorMessage = "Unauthorized. Please log in again.";
              break;
            case 403:
              errorMessage = "Access denied. You don't have permission.";
              break;
            case 404:
              errorMessage = "Resource not found.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Something went wrong (Error ${response.status})`;
          }
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`❌ Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Validate page and pageSize parameters
   */
  private validatePaginationParams(page: any, pageSize: any): { page: number; pageSize: number } {
    // Validate page
    let validPage = 1;
    if (page !== undefined && page !== null) {
      const pageNum = Number(page);
      if (Number.isInteger(pageNum) && pageNum >= 1) {
        validPage = pageNum;
      } else if (!Number.isInteger(pageNum)) {
        throw new Error("page must be an integer number");
      } else if (pageNum < 1) {
        throw new Error("page must not be less than 1");
      }
    }

    // Validate pageSize
    let validPageSize = 20;
    if (pageSize !== undefined && pageSize !== null) {
      const pageSizeNum = Number(pageSize);
      if (Number.isInteger(pageSizeNum) && pageSizeNum >= 1) {
        validPageSize = pageSizeNum;
      } else if (!Number.isInteger(pageSizeNum)) {
        throw new Error("pageSize must be an integer number");
      } else if (pageSizeNum < 1) {
        throw new Error("pageSize must not be less than 1");
      }
    }

    console.log(`✅ Validated parameters: page=${validPage}, pageSize=${validPageSize}`);
    return { page: validPage, pageSize: validPageSize };
  }

  /**
   * Get all promotional offers
   * GET /promotions
   */
  async getAllPromotions(page: number = 1, pageSize: number = 20): Promise<PromotionsListResponse> {
    console.log("\n=== getAllPromotions ===");
    console.log(`📥 Input parameters: page=${page}, pageSize=${pageSize}`);

    try {
      // Validate parameters
      const { page: validPage, pageSize: validPageSize } = this.validatePaginationParams(page, pageSize);

      const endpoint = `/promotions?page=${validPage}&pageSize=${validPageSize}`;
      console.log(`🔗 Endpoint: ${endpoint}`);

      return await this.request(endpoint);
    } catch (error) {
      console.error("❌ getAllPromotions error:", error);
      throw error;
    }
  }

  /**
   * Get promotional stats
   * GET /promotions/stats/overview
   */
  async getPromotionalStats(): Promise<PromotionalStats> {
    console.log("\n=== getPromotionalStats ===");
    return this.request("/promotions/stats/overview");
  }

  /**
   * Get single promotional offer by ID
   * GET /promotions/{id}
   */
  async getPromotionById(promotionId: string): Promise<PromotionalOfferAPI> {
    console.log("\n=== getPromotionById ===");
    console.log("promotionId:", promotionId);
    return this.request(`/promotions/${encodeURIComponent(promotionId)}`);
  }

  /**
   * Create new promotional offer
   * POST /promotions
   */
  async createPromotion(payload: {
    offerTitle: string;
    eligibleUser: string;
    type: string;
    activationTrigger: string;
    status: string;
    startDate: string;
    endDate: string;
    maxRedemptionPerUser: number;
    maxTotalRedemption: number;
    rewardValue: number;
    rewardUnit: string;
  }): Promise<PromotionalOfferAPI> {
    console.log("\n=== createPromotion ===");
    console.log("payload:", payload);
    return this.request("/promotions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Update promotional offer
   * PATCH /promotions/{id}
   */
  async updatePromotion(
    promotionId: string,
    payload: Partial<PromotionalOfferAPI>
  ): Promise<PromotionalOfferAPI> {
    console.log("\n=== updatePromotion ===");
    console.log("promotionId:", promotionId);
    console.log("payload:", payload);
    return this.request(`/promotions/${encodeURIComponent(promotionId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Delete promotional offer
   * DELETE /promotions/{id}
   */
  async deletePromotion(promotionId: string): Promise<void> {
    console.log("\n=== deletePromotion ===");
    console.log("promotionId:", promotionId);
    return this.request(`/promotions/${encodeURIComponent(promotionId)}`, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const promotionalService = new PromotionalService();