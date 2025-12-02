// src/services/paymentService.ts
import { HttpService } from "./httpService";

class PaymentService {
  private request = new HttpService();

  /**
   * Get all payments with pagination
   */
  async getAllPayments(params?: { page?: number; limit?: number }) {
    let query = "";

    if (params) {
      const searchParams = new URLSearchParams();
      
      if (params.page !== undefined) {
        searchParams.append("page", String(params.page));
      }
      if (params.limit !== undefined) {
        searchParams.append("limit", String(params.limit));
      }

      query = searchParams.toString();
      if (query) query = `?${query}`;
    }

    return this.request.get(`/payments${query}`, true);
  }

  /**
   * Get transaction history for a specific user
   */
  async getUserTransactionHistory(userId: string) {
    return this.request.get(`/payments/history?userId=${encodeURIComponent(userId)}`, true);
  }
}

export const paymentService = new PaymentService();