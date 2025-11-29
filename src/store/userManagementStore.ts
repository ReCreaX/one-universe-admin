import { UserManagementStatusBadgeProp } from "@/app/admin/users-management/UserManagementStatusBadge";
import { create } from "zustand";

type ModalType = "openBuyer" | "openSeller" | "openAdmin" | null;

export type RoleType = {
  id: string;
  name: string;
  description: string;
};

export type UserRole = {
  id: string;
  userId: string;
  roleId: string;
  role: RoleType;
};

export type ProfileType = {
  id: string;
  userId: string;
  bvn?: string;
  serviceDetails?: string;
  businessName?: string;
  businessDescription?: string;
  portfolioGallery?: string[];
  certifications?: string[];
  aboutYou?: string;
  portfolioLink?: string;
  servicesOffered?: string[];
  deliveryTypes?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type WalletType = {
  id: string;
  userId: string;
  balance: number;
  holdBalance: number;
  createdAt: string;
  updatedAt: string;
};

export type PanicContactType = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userId: string;
};

export type BookingStatsType = {
  totalBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  disputedBookings: number;
};

export type UserType = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  status: UserManagementStatusBadgeProp["status"];
  createdAt: string;
  updatedAt: string;
  profilePicture?: string | null;
  userType: "SELLER" | "BUYER" | "ADMIN";
  profile?: ProfileType;
  Wallet?: WalletType;
  verificationStatus?: boolean;
  userRoles?: UserRole[];
  panicContacts?: PanicContactType[];
  bookingStats?: BookingStatsType;
};

export interface FullUserType {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  profilePicture?: string | null;
  userType?: "SELLER" | "BUYER" | "ADMIN";
  wallet?: any;
  Wallet?: any;
  profile?: any;
  sellerProfile?: any;
  panicContacts?: any[];
  PanicContact?: any[];
  jobDocuments?: any[];
  JobDocument?: any[];
  verificationStatus?: boolean;
  userRoles?: any[];
  bookingStats?: any;
  [key: string]: any;
}

// Filter types
export interface BuyerFilterState {
  status?: "inactive" | "active" | "pending";
  fromDate?: Date;
  toDate?: Date;
}

export interface SellerFilterState {
  status?: "active" | "inactive" | "pending";
  verification?: "verified" | "unverified";
  fromDate?: Date;
  toDate?: Date;
}

export interface AdminFilterState {
  status?: "active" | "inactive" | "pending";
  fromDate?: Date;
  toDate?: Date;
}

interface UserManagementStore {
  modalType: ModalType;
  selectedUser: FullUserType | null;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter state per tab
  buyerFilters: BuyerFilterState;
  sellerFilters: SellerFilterState;
  adminFilters: AdminFilterState;
  setBuyerFilters: (filters: BuyerFilterState) => void;
  setSellerFilters: (filters: SellerFilterState) => void;
  setAdminFilters: (filters: AdminFilterState) => void;
  clearBuyerFilters: () => void;
  clearSellerFilters: () => void;
  clearAdminFilters: () => void;

  // Modal actions
  openModal: (type: ModalType, user?: FullUserType) => void;
  closeModal: () => void;

  // Refetch function for instant table update
  refetchUsers: (() => void) | null;
  setRefetchUsers: (fn: () => void) => void;
}

export const userManagementStore = create<UserManagementStore>((set) => ({
  modalType: null,
  selectedUser: null,

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filters
  buyerFilters: {},
  sellerFilters: {},
  adminFilters: {},
  setBuyerFilters: (filters) => set({ buyerFilters: filters }),
  setSellerFilters: (filters) => set({ sellerFilters: filters }),
  setAdminFilters: (filters) => set({ adminFilters: filters }),
  clearBuyerFilters: () => set({ buyerFilters: {} }),
  clearSellerFilters: () => set({ sellerFilters: {} }),
  clearAdminFilters: () => set({ adminFilters: {} }),

  // Modal controls
  openModal: (type, user) => {
    console.log("openModal CALLED with:", { type, user });
    set({ modalType: type, selectedUser: user || null });
  },

  closeModal: () => {
    console.log("closeModal CALLED");
    set({ modalType: null, selectedUser: null });
  },

  // Refetch users after success
  refetchUsers: null,
  setRefetchUsers: (fn) => set({ refetchUsers: fn }),
}));