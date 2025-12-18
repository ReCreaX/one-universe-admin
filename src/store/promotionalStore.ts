// src/store/promotionalStore.ts
import { create } from "zustand";
import { promotionalService, PromotionalOfferAPI, PromotionalStats } from "@/services/promotionalService";

// ✅ EXPORT THIS INTERFACE FOR USE IN DASHBOARD
export interface PromotionalFilterState {
  status?: "Active" | "Draft" | "Expired";
  type?: string[];
  eligibleUser?: string[];
  fromDate?: Date;
  toDate?: Date;
}

interface PromotionalManagementState {
  // Promotions list state
  allPromotions: PromotionalOfferAPI[];
  allPromotionsLoading: boolean;
  allPromotionsError: string | null;
  allPromotionsMeta: {
    total: number;
    page: number;
    pageSize: number;
  } | null;

  // Stats state
  stats: PromotionalStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Selected promotion
  selectedPromotion: PromotionalOfferAPI | null;

  // UI state
  searchQuery: string;
  filters: PromotionalFilterState;
  
  // ✅ ADD THIS - For advanced filter panel
  PromotionalFilter: PromotionalFilterState;

  // Actions
  fetchAllPromotions: (page?: number, pageSize?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchPromotionById: (promotionId: string) => Promise<void>;
  
  createPromotion: (data: any) => Promise<PromotionalOfferAPI>;
  updatePromotion: (promotionId: string, data: any) => Promise<PromotionalOfferAPI>;
  deletePromotion: (promotionId: string) => Promise<void>;
  
  setSelectedPromotion: (promotion: PromotionalOfferAPI | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: PromotionalFilterState) => void;
  clearFilters: () => void;
  clearAllPromotions: () => void;
  
  // ✅ ADD THESE - For advanced filter panel
  setPromotionalFilter: (filter: PromotionalFilterState) => void;
  clearPromotionalFilter: () => void;
}

const usePromotionalStore = create<PromotionalManagementState>((set) => ({
  // === State ===
  allPromotions: [],
  allPromotionsLoading: false,
  allPromotionsError: null,
  allPromotionsMeta: null,

  stats: null,
  statsLoading: false,
  statsError: null,

  selectedPromotion: null,
  searchQuery: "",
  filters: {},
  
  // ✅ ADD THIS - Initialize empty filter state
  PromotionalFilter: {},

  // === Actions ===

  /**
   * Fetch all promotions with bulletproof parameter validation
   */
  fetchAllPromotions: async (page = 1, pageSize = 20) => {
    set({ allPromotionsLoading: true, allPromotionsError: null });

    try {
      console.log(`\n📦 Store: fetchAllPromotions called with page=${page}, pageSize=${pageSize}`);
      
      // BULLETPROOF VALIDATION - Ensures parameters are ALWAYS valid
      let validPage: number;
      let validPageSize: number;

      // Validate and convert page parameter
      try {
        const pageNum = Number(page);
        if (Number.isInteger(pageNum) && pageNum >= 1) {
          validPage = pageNum;
        } else {
          console.warn(`⚠️ Invalid page parameter: ${page}, using default: 1`);
          validPage = 1;
        }
      } catch (e) {
        console.warn(`⚠️ Error parsing page parameter: ${page}, using default: 1`);
        validPage = 1;
      }

      // Validate and convert pageSize parameter
      try {
        const pageSizeNum = Number(pageSize);
        if (Number.isInteger(pageSizeNum) && pageSizeNum >= 1) {
          validPageSize = pageSizeNum;
        } else {
          console.warn(`⚠️ Invalid pageSize parameter: ${pageSize}, using default: 20`);
          validPageSize = 20;
        }
      } catch (e) {
        console.warn(`⚠️ Error parsing pageSize parameter: ${pageSize}, using default: 20`);
        validPageSize = 20;
      }

      console.log(`✅ Store: Final validated parameters - page=${validPage}, pageSize=${validPageSize}`);

      // Call service with guaranteed valid parameters
      const response = await promotionalService.getAllPromotions(validPage, validPageSize);

      set({
        allPromotions: response.items,
        allPromotionsMeta: {
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
        },
        allPromotionsError: null,
      });

      console.log(`✅ Store: Fetched ${response.items.length} promotions`);
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch promotions:", err);
      set({
        allPromotions: [],
        allPromotionsMeta: null,
        allPromotionsError: err.message || "Failed to load promotions",
      });
      
      // Re-throw to propagate to caller
      throw err;
    } finally {
      set({ allPromotionsLoading: false });
    }
  },

  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });

    try {
      console.log("\n📦 Store: fetchStats called");
      const response = await promotionalService.getPromotionalStats();
      set({
        stats: response,
        statsError: null,
      });
      console.log("✅ Store: Stats fetched");
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch stats:", err);
      set({
        stats: null,
        statsError: err.message || "Failed to load stats",
      });
      
      // Don't throw - stats is non-critical
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchPromotionById: async (promotionId: string) => {
    try {
      console.log("\n📦 Store: fetchPromotionById called");
      const response = await promotionalService.getPromotionById(promotionId);
      set({ selectedPromotion: response });
      console.log("✅ Store: Promotion fetched");
    } catch (err: any) {
      console.error("❌ Store: Failed to fetch promotion:", err);
      throw err;
    }
  },

  createPromotion: async (data: any) => {
    try {
      console.log("\n📦 Store: createPromotion called");
      console.log("Payload:", JSON.stringify(data, null, 2));
      const response = await promotionalService.createPromotion(data);
      console.log("✅ Store: Promotion created");
      return response;
    } catch (err: any) {
      console.error("❌ Store: Failed to create promotion:", err);
      throw err;
    }
  },

  updatePromotion: async (promotionId: string, data: any) => {
    try {
      console.log("\n📦 Store: updatePromotion called");
      const response = await promotionalService.updatePromotion(promotionId, data);
      console.log("✅ Store: Promotion updated");
      return response;
    } catch (err: any) {
      console.error("❌ Store: Failed to update promotion:", err);
      throw err;
    }
  },

  deletePromotion: async (promotionId: string) => {
    try {
      console.log("\n📦 Store: deletePromotion called");
      await promotionalService.deletePromotion(promotionId);
      console.log("✅ Store: Promotion deleted");
    } catch (err: any) {
      console.error("❌ Store: Failed to delete promotion:", err);
      throw err;
    }
  },

  // === UI Actions ===
  setSelectedPromotion: (promotion) => set({ selectedPromotion: promotion }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearAllPromotions: () => set({ allPromotions: [], allPromotionsMeta: null }),
  
  // ✅ ADD THESE - Advanced filter panel actions
  setPromotionalFilter: (filter: PromotionalFilterState) => {
    console.log("📋 Setting promotional filter:", filter);
    set({ PromotionalFilter: filter });
  },
  
  clearPromotionalFilter: () => {
    console.log("🗑️ Clearing promotional filter");
    set({ PromotionalFilter: {} });
  },
}));

export { usePromotionalStore };