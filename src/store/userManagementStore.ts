import { UserManagementStatusBadgeProp } from "@/app/admin/users-management/UserManagementStatusBadge";
import { create } from "zustand";

type ModalType = "openBuyer" | "openSeller" | "openAdmin" | null;

// Keep your existing types...
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

// MAIN STORE — NOW WITH REFETCH!
interface UserManagementStore {
  modalType: ModalType;
  selectedUser: FullUserType | null;

  // Modal actions
  openModal: (type: ModalType, user?: FullUserType) => void;
  closeModal: () => void;

  // NEW: Refetch function for instant table update
  refetchUsers: (() => void) | null;
  setRefetchUsers: (fn: () => void) => void;
}

export const userManagementStore = create<UserManagementStore>((set) => ({
  modalType: null,
  selectedUser: null,

  // Modal controls
  openModal: (type, user) => {
    console.log("openModal CALLED with:", { type, user });
    set({ modalType: type, selectedUser: user || null });
  },

  closeModal: () => {
    console.log("closeModal CALLED");
    set({ modalType: null, selectedUser: null });
  },

  // Refetch users after success (deactivate, warning, etc.)
  refetchUsers: null,
  setRefetchUsers: (fn) => set({ refetchUsers: fn }),
}));