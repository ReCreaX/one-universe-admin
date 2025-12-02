// src/store/paymentManagementStore.ts
import { create } from "zustand";
import { paymentService } from "@/services/paymentService";

// === Types (unchanged) ===
export type PaymentStatus =
  | "PAID"
  | "PENDING"
  | "DISPUTED"
  | "PENDING REFUND"
  | "REFUNDED"
  | "FAILED";

export type BookingStatus =
  | "BUYER_CONFIRM_COMPLETION"
  | "SELLER_CONFIRM_COMPLETION"
  | "COMPLETED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "PENDING";

export type JobStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "CANCELLED";
export type RoleType = "BUYER" | "SELLER";

export interface JobDetails {
  buyerArrived: boolean;
  sellerArrived: boolean;
  buyerCompleted: boolean;
  sellerCompleted: boolean;
  payment30Done: boolean;
  payment65Done: boolean;
  agreedPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseTransaction {
  reference: string;
  serviceTitle: string | null;
  buyerName: string | null;
  buyerUserId: string | null;
  buyerRole: RoleType;
  sellerName: string | null;
  sellerUserId: string | null;
  sellerRole: RoleType;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface DetailedTransaction {
  reference: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  serviceTitle: string;
  bookingId: string;
  bookingStatus: BookingStatus;
  bookingLocation: string;
  bookingDate: string;
  buyerName: string;
  buyerRole: RoleType;
  sellerName: string;
  sellerRole: RoleType;
  sellerBusinessName: string;
  jobStatus: JobStatus;
  jobDetails: JobDetails;
}

interface BaseTransactionsResponse {
  status: string;
  message: string;
  data: BaseTransaction[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

interface DetailedTransactionsResponse {
  status: string;
  message: string;
  data: DetailedTransaction[];
}

export interface PaymentFilterState {
  status?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  userType?: RoleType;
}

// === Helper: Type guard for HttpError ===
interface HttpError {
  error: true;
  message: string;
}

function isHttpError(response: unknown): response is HttpError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    (response as any).error === true
  );
}

// === Store ===
interface PaymentManagementState {
  allPayments: BaseTransaction[];
  allPaymentsLoading: boolean;
  allPaymentsError: string | null;
  allPaymentsMeta: BaseTransactionsResponse["meta"] | null;

  userTransactions: DetailedTransaction[];
  userTransactionsLoading: boolean;
  userTransactionsError: string | null;
  selectedUserId: string | null;

  selectedTransaction: DetailedTransaction | null;

  searchQuery: string;
  filters: PaymentFilterState;

  fetchAllPayments: (page?: number, perPage?: number) => Promise<void>;
  fetchUserTransactions: (userId: string) => Promise<void>;
  setSelectedTransaction: (tx: DetailedTransaction | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: PaymentFilterState) => void;
  clearFilters: () => void;
  clearUserTransactions: () => void;
}

export const paymentManagementStore = create<PaymentManagementState>((set) => ({
  allPayments: [],
  allPaymentsLoading: false,
  allPaymentsError: null,
  allPaymentsMeta: null,

  userTransactions: [],
  userTransactionsLoading: false,
  userTransactionsError: null,
  selectedUserId: null,

  selectedTransaction: null,
  searchQuery: "",
  filters: {},

  fetchAllPayments: async (page = 1, limit = 100) => {
  set({ allPaymentsLoading: true, allPaymentsError: null });

  try {
    const response: unknown = await paymentService.getAllPayments({ page, limit });

    if (isHttpError(response)) {
      throw new Error(response.message);
    }

    // Type assertion after error check
    const typedResponse = response as BaseTransactionsResponse;

    set({
      allPayments: typedResponse.data,
      allPaymentsMeta: typedResponse.meta,
      allPaymentsError: null,
    });
  } catch (err: any) {
    console.error("Failed to fetch all payments:", err);
    set({
      allPayments: [],
      allPaymentsMeta: null,
      allPaymentsError: err.message || "Failed to load payments",
    });
  } finally {
    set({ allPaymentsLoading: false });
  }
},

  fetchUserTransactions: async (userId: string) => {
    set({
      userTransactionsLoading: true,
      userTransactionsError: null,
      selectedUserId: userId,
    });

    try {
      const response: unknown = await paymentService.getUserTransactionHistory(userId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      // Type assertion after error check
      const typedResponse = response as DetailedTransactionsResponse;

      set({
        userTransactions: typedResponse.data,
        userTransactionsError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch user transactions:", err);
      set({
        userTransactions: [],
        userTransactionsError: err.message || "Failed to load transactions",
      });
    } finally {
      set({ userTransactionsLoading: false });
    }
  },

  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearUserTransactions: () =>
    set({
      userTransactions: [],
      selectedUserId: null,
      selectedTransaction: null,
      userTransactionsError: null,
    }),
}));