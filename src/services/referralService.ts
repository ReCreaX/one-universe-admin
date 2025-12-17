// src/services/referralService.ts
import { getSession } from "next-auth/react";
import getBaseUrl from "./baseUrl";

const baseUrl = getBaseUrl("live");

export interface ReferralItem {
  id: string;
  referrerId: string;
  referredId: string;
  signupDate: string;
  firstTransactionAmount: number | null;
  firstTransactionStatus: string | null;
  status: "PENDING" | "PROCESSING" | "PAID" | "INELIGIBLE";
  rewardAmount: number | null;
  rewardPaidAt: string | null;
  rewardPaid: boolean;
  rewardTransactionId: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  referralCodeUsed: string | null;
  referrer: {
    id: string;
    fullName: string;
    email: string;
  };
  referred: {
    id: string;
    fullName: string;
    email: string;
  };
  rewardTransaction: any;
  events: Array<{
    id: string;
    referralId: string;
    type: string;
    payload: Record<string, any>;
    createdAt: string;
  }>;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  rewardsPaidCount: number;
  rewardsPaidTotal: number;
  currentRewardRate: number | null;
  rewardEligibilityDays: number | null;
  maxTransactionAmount: number;
}

export interface ReferralProgramSettings {
  id: string;
  active: boolean;
  platformFeePercentage: number;
  maxTransactionAmount: number | null;
  rewardEligibilityDays: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ReferralsResponse {
  items: ReferralItem[];
  total: number;
  page: number;
  limit: number;
}

interface ReferralResolvePayload {
  status: "PAID" | "INELIGIBLE" | "PENDING";
  rewardAmount?: number;
  rewardTransactionId?: string;
  note?: string;
}

class ReferralService {
  /**
   * Generic request method with auth
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

    const fullUrl = `${baseUrl}${endpoint}`;
    console.log("\n🌐 REQUEST START");
    console.log("📍 Full URL:", fullUrl);
    console.log("📝 Method:", options.method || "GET");
    console.log("🔑 Token exists:", !!session.accessToken);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
          ...options.headers,
        },
      });

      console.log("\n📊 RESPONSE");
      console.log("Status:", response.status, response.statusText);
      console.log("URL:", response.url);

      // Clone the response to read it
      const clonedResponse = response.clone();
      const textData = await clonedResponse.text();
      console.log("Raw Response Text:", textData.substring(0, 300));

      // Parse the JSON
      let data = {};
      try {
        data = JSON.parse(textData);
        console.log("Parsed JSON: ✅ Success");
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
      }

      // Handle 401 - Token may have expired even with auto-refresh
      if (response.status === 401) {
        console.error("❌ Unauthorized: Token expired or invalid");
        throw new Error("Unauthorized - Session expired");
      }

      if (response.status === 403) {
        console.error("❌ Forbidden: Access denied");
        throw new Error("Forbidden - Access denied");
      }

      if (!response.ok) {
        console.error("❌ API Error");
        console.error("Status:", response.status, response.statusText);
        console.error("URL:", response.url);
        console.error("Data:", data);
        console.error("Raw Text:", textData);
        
        // Extract error message from various possible formats
        let errorMessage = `API Error: ${response.status}`;
        
        if (typeof data === 'object' && data !== null) {
          if ((data as any).message) errorMessage = (data as any).message;
          else if ((data as any).error) errorMessage = (data as any).error;
          else if ((data as any).detail) errorMessage = (data as any).detail;
        }
        
        throw new Error(errorMessage);
      }

      console.log("✅ Request successful");
      return data;
    } catch (error) {
      console.error(`❌ Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all referrals
   * Backend doesn't support query parameters, returns all data with pagination metadata
   */
  async getAllReferrals(page: number = 1, limit: number = 20) {
    console.log("\n=== getAllReferrals ===");
    console.log("Input - page:", page, "limit:", limit);

    // Backend returns all data with pagination metadata
    const endpoint = `/referrals`;
    console.log("Endpoint:", endpoint);

    return this.request(endpoint) as Promise<ReferralsResponse>;
  }

  /**
   * Get referral statistics
   */
  async getReferralStats(): Promise<ReferralStats> {
    console.log("\n=== getReferralStats ===");
    return this.request("/referrals/stats");
  }

  /**
   * Get referral program settings
   */
  async getReferralSettings(): Promise<ReferralProgramSettings> {
    console.log("\n=== getReferralSettings ===");
    return this.request("/referrals/settings");
  }

  /**
   * Get single referral details
   */
  async getReferralDetails(referralId: string): Promise<ReferralItem> {
    console.log("\n=== getReferralDetails ===");
    console.log("referralId:", referralId);
    return this.request(`/referrals/${encodeURIComponent(referralId)}`);
  }

  /**
   * Resolve a referral reward
   */
  async resolveReferralReward(
    referralId: string,
    payload: ReferralResolvePayload
  ): Promise<ReferralItem> {
    console.log("\n=== resolveReferralReward ===");
    console.log("referralId:", referralId);
    console.log("payload:", payload);
    return this.request(`/referrals/${encodeURIComponent(referralId)}/resolve`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Mark referral as paid
   */
  async markAsPaid(
    referralId: string,
    rewardTransactionId: string,
    rewardAmount: number
  ): Promise<ReferralItem> {
    return this.resolveReferralReward(referralId, {
      status: "PAID",
      rewardAmount,
      rewardTransactionId,
    });
  }

  /**
   * Mark referral as ineligible
   */
  async markAsIneligible(
    referralId: string,
    reason?: string
  ): Promise<ReferralItem> {
    return this.resolveReferralReward(referralId, {
      status: "INELIGIBLE",
      note: reason,
    });
  }

  /**
   * Upsert referral program settings
   * ✅ POST endpoint that handles both create and update
   * Supports partial updates - send only the fields you want to update
   */
  async updateSettings(payload: Partial<{
    active: boolean;
    platformFeePercentage: number;
    maxTransactionAmount: number;
    rewardEligibilityDays: number;
    maxReferralsPerUserPerMonth: number;
  }>): Promise<ReferralProgramSettings> {
    console.log("\n=== updateSettings (POST /referrals/upsert) ===");
    console.log("payload:", payload);

    return this.request("/referrals/upsert", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Recalculate and retry payout for a referral
   * POST /referrals/admin/recalculate-and-retry/{referralId}
   */
  async recalculateAndRetry(referralId: string): Promise<ReferralItem> {
    console.log("\n=== recalculateAndRetry ===");
    console.log("referralId:", referralId);
    return this.request(
      `/referrals/admin/recalculate-and-retry/${encodeURIComponent(referralId)}`,
      { method: "PATCH" }
    );
  }

  /**
   * Mark referral reward as paid (manual override)
   * POST /referrals/admin/mark-paid
   */
  async markAsPaidAdmin(payload: {
    referralId: string;
    overrideAmount: number;
    note?: string;
  }): Promise<ReferralItem> {
    console.log("\n=== markAsPaidAdmin ===");
    console.log("Full Payload:", JSON.stringify(payload, null, 2));
    console.log("Endpoint: PATCH /referrals/admin/mark-paid");
    
    const response = this.request("/referrals/admin/mark-paid", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    
    console.log("Request sent, waiting for response...");
    return response;
  }

  /**
   * Mark referral as ineligible
   * POST /referrals/admin/mark-ineligible
   */
  async markAsIneligibleAdmin(payload: {
    referralId: string;
    reason: string;
  }): Promise<ReferralItem> {
    console.log("\n=== markAsIneligibleAdmin ===");
    console.log("payload:", payload);
    return this.request("/referrals/admin/mark-ineligible", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Export referrals data
   */
  async exportReferrals(format: "csv" | "excel" = "excel"): Promise<Blob> {
    console.log("\n=== exportReferrals ===");
    console.log("format:", format);
    const response = await this.request(`/referrals/export?format=${format}`, {
      method: "GET",
    });

    // If the response is already a Blob, return it
    if (response instanceof Blob) {
      return response;
    }

    // Otherwise convert to Blob
    return new Blob([JSON.stringify(response)], {
      type: format === "csv" ? "text/csv" : "application/vnd.ms-excel",
    });
  }
}

export const referralService = new ReferralService();