// store/planStore.ts
import { create } from 'zustand';
import {
  fetchPlans,
  updatePlanPrice,
  groupPlans,
  Plan,
  PlanName,
  PlanType,
} from '@/services/planService';

interface PlanState {
  // State
  plans: Plan[];
  groupedPlans: Partial<Record<PlanName, Partial<Record<PlanType, Plan>>>>;
  loading: boolean;
  error: string | null;
  updating: Record<string, boolean>; // Track loading per plan ID
  updateError: Record<string, string | null>; // Track errors per plan ID

  // Actions
  setPlans: (plans: Plan[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // API Actions
  fetchPlans: () => Promise<void>;
  updatePlanPrice: (planId: string, price: number) => Promise<boolean>;

  // Helpers
  getPlanByName: (name: PlanName) => Partial<Record<PlanType, Plan>> | null;
  getPlanPrice: (name: PlanName, type: PlanType) => number | null;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  // Initial State
  plans: [],
  groupedPlans: {
    'Premium Plan': {},
    'Sponsor Ads': {},
  } as Partial<Record<PlanName, Partial<Record<PlanType, Plan>>>>,
  loading: false,
  error: null,
  updating: {},
  updateError: {},

  // Basic Actions
  setPlans: (plans) => {
    const grouped = groupPlans(plans);
    set({ plans, groupedPlans: grouped });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // API Actions
  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const plansData = await fetchPlans();
      console.log('✅ Plans fetched:', plansData);

      const grouped = groupPlans(plansData);
      set({
        plans: plansData,
        groupedPlans: grouped,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch plans';
      set({ error: errorMessage, loading: false });
      console.error('Fetch plans error:', error);
    }
  },

  // Update single plan price
  updatePlanPrice: async (planId, price) => {
    set((state) => ({
      updating: { ...state.updating, [planId]: true },
      updateError: { ...state.updateError, [planId]: null },
    }));

    try {
      const updatedPlan = await updatePlanPrice(planId, price);
      console.log(`✅ Plan updated: ${planId} price = ${price}`);

      // Update local state
      set((state) => ({
        plans: state.plans.map((plan) =>
          plan.id === planId ? { ...plan, price: updatedPlan.price } : plan
        ),
        groupedPlans: {
          ...state.groupedPlans,
          [updatedPlan.name]: {
            ...state.groupedPlans[updatedPlan.name],
            [updatedPlan.type]: updatedPlan,
          },
        },
        updating: { ...state.updating, [planId]: false },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update plan';
      set((state) => ({
        updating: { ...state.updating, [planId]: false },
        updateError: { ...state.updateError, [planId]: errorMessage },
      }));
      console.error('Update plan error:', error);
      return false;
    }
  },

  // Get plan by name
  getPlanByName: (name) => {
    const { groupedPlans } = get();
    return groupedPlans[name] || null;
  },

  // Get specific plan price
  getPlanPrice: (name, type) => {
    const { groupedPlans } = get();
    return groupedPlans[name]?.[type]?.price || null;
  },
}));