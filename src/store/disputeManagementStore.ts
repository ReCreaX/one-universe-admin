// src/store/disputeManagementStore.ts
import { create } from "zustand";
import { disputeService } from "@/services/Disputeservice";
import { Dispute, type ApiStatus } from "@/app/admin/utils/disputeStatusMapper";

// === Types ===
export type DisputeStatus = ApiStatus;
export type BookingStatus = string;
export type OpenedByRole = "BUYER" | "SELLER";

// Re-export Dispute type for backwards compatibility
export type { Dispute };

export interface DisputeFilterState {
  disputeStatus?: "open" | "under review" | "resolved";
  jobStatus?: BookingStatus;
  fromDate?: Date;
  toDate?: Date;
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
interface DisputeManagementState {
  disputes: Dispute[];
  disputesLoading: boolean;
  disputesError: string | null;
  disputesMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  selectedDispute: Dispute | null;
  selectedDisputeLoading: boolean;
  selectedDisputeError: string | null;

  searchQuery: string;
  filters: DisputeFilterState;

  modalType: "openDispute" | null;
  isModalOpen: boolean;

  fetchDisputes: (page?: number, limit?: number) => Promise<void>;
  fetchDisputeById: (id: string) => Promise<void>;
  resolveDispute: (
    id: string,
    resolution: string,
    comment: string
  ) => Promise<void>;

  setSelectedDispute: (dispute: Dispute | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: DisputeFilterState) => void;
  clearFilters: () => void;

  openModal: (type: "openDispute", dispute?: Dispute) => void;
  closeModal: () => void;
}

export const disputeModalStore = create<DisputeManagementState>((set) => ({
  disputes: [],
  disputesLoading: false,
  disputesError: null,
  disputesMeta: null,

  selectedDispute: null,
  selectedDisputeLoading: false,
  selectedDisputeError: null,

  searchQuery: "",
  filters: {},

  modalType: null,
  isModalOpen: false,

  fetchDisputes: async (page = 1, limit = 50) => {
    set({ disputesLoading: true, disputesError: null });

    try {
      const response: unknown = await disputeService.getDisputes({
        page,
        limit,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      // Type assertion after error check
      const typedResponse = response as {
        data: Dispute[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      };

      set({
        disputes: typedResponse.data,
        disputesMeta: typedResponse.meta,
        disputesError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch disputes:", err);
      set({
        disputes: [],
        disputesMeta: null,
        disputesError: err.message || "Failed to load disputes",
      });
    } finally {
      set({ disputesLoading: false });
    }
  },

  fetchDisputeById: async (id: string) => {
    set({ selectedDisputeLoading: true, selectedDisputeError: null });

    try {
      const response: unknown = await disputeService.getDisputeById(id);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      // Type assertion after error check
      const typedResponse = response as Dispute;

      set({
        selectedDispute: typedResponse,
        selectedDisputeError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch dispute:", err);
      set({
        selectedDispute: null,
        selectedDisputeError: err.message || "Failed to load dispute details",
      });
    } finally {
      set({ selectedDisputeLoading: false });
    }
  },

  resolveDispute: async (id: string, resolution: string, comment: string) => {
    try {
      await disputeService.resolveDispute(id, resolution, comment);

      // Refetch disputes after resolving
      const state = disputeModalStore.getState();
      await state.fetchDisputes(
        state.disputesMeta?.page || 1,
        state.disputesMeta?.limit || 50
      );

      set({ modalType: null, isModalOpen: false });
    } catch (err: any) {
      console.error("Failed to resolve dispute:", err);
      throw err;
    }
  },

  setSelectedDispute: (dispute) => set({ selectedDispute: dispute }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),

  openModal: (type, dispute) => {
    set({
      modalType: type,
      isModalOpen: true,
      selectedDispute: dispute || null,
    });
  },

  closeModal: () => {
    set({
      modalType: null,
      isModalOpen: false,
      selectedDispute: null,
    });
  },
}));

// For backwards compatibility with old API
export type disputeType = Dispute;