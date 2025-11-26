import { create } from "zustand";
import axios from "axios";
import getBaseUrl from "@/services/baseUrl";
import { FullUserType } from "@/store/userManagementStore"; // <- use FullUserType

interface UserDetailsState {
  fullUser: FullUserType | null; // <- use FullUserType
  loading: boolean;
  fetchUser: (userId: string, token: string) => Promise<void>;
}

export const userDetailsStore = create<UserDetailsState>((set) => ({
  fullUser: null,
  loading: false,
  fetchUser: async (userId, token) => {
    set({ loading: true });
    try {
      const BASE = getBaseUrl();
      const { data } = await axios.get<FullUserType>(`${BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // normalize backend inconsistencies
      const normalized: FullUserType = {
        ...data,
        wallet: data.wallet || data.Wallet || null,
        profile: data.profile || data.sellerProfile || null,
        panicContacts: data.panicContacts || data.PanicContact || [],
        jobDocuments: data.jobDocuments || data.JobDocument || [],
      };

      set({ fullUser: normalized });
    } catch (err) {
      console.error("Failed to fetch full user:", err);
      set({ fullUser: null });
    } finally {
      set({ loading: false });
    }
  },
}));
