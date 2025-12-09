// src/store/promotionalStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type PromotionalFilterState = {
  status?: "Active" | "Draft" | "Completed" | "Expired";
  type?: ("Discount" | "Free Shipping" | "Bundle" | "Cashback")[];
  eligibleUser?: ("All Users" | "Premium Members" | "First-time Buyers" | "Existing Users")[];
  fromDate?: Date | null;
  toDate?: Date | null;
};

type PromotionalStore = {
  PromotionalFilter: PromotionalFilterState;
  setPromotionalFilter: (filter: PromotionalFilterState) => void;  // ← Add this
  clearPromotionalFilter: () => void;
};

export const promotionalStore = create<PromotionalStore>()(
  devtools((set) => ({
    PromotionalFilter: {},
    setPromotionalFilter: (filter) => set({ PromotionalFilter: filter }),
    clearPromotionalFilter: () => set({ PromotionalFilter: {} }),
  }))
);

export const usePromotionalStore = promotionalStore;