import { HttpService } from "./httpService";

// Define the BookingStatus enum to match your backend
export enum BookingStatus {
  PENDING = "PENDING",
  QUOTED = "QUOTED",
  ACCEPTED_BY_BUYER = "ACCEPTED_BY_BUYER",
  DECLINED_BY_BUYER = "DECLINED_BY_BUYER",
  ACCEPTED_BY_SELLER = "ACCEPTED_BY_SELLER",
  DECLINED_BY_SELLER = "DECLINED_BY_SELLER",
  NEGOTIATING = "NEGOTIATING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DISPUTE = "DISPUTE",
  ARRIVAL = "ARRIVAL",
  BUYER_CONFIRM_COMPLETION = "BUYER_CONFIRM_COMPLETION",
  BUYER_CONFIRM_START = "BUYER_CONFIRM_START",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
}

// Helper function to determine if a booking is "ongoing"
export const isOngoingBooking = (status: BookingStatus | string): boolean => {
  const ongoingStatuses = [
    BookingStatus.QUOTED,
    BookingStatus.ACCEPTED_BY_BUYER,
    BookingStatus.ACCEPTED_BY_SELLER,
    BookingStatus.NEGOTIATING,
    BookingStatus.ACTIVE,
    BookingStatus.ARRIVAL,
    BookingStatus.BUYER_CONFIRM_COMPLETION,
    BookingStatus.BUYER_CONFIRM_START,
    BookingStatus.PENDING_PAYMENT,
    BookingStatus.PAID,
  ];

  return ongoingStatuses.includes(status as BookingStatus);
};

// Helper function to determine if a booking is "completed"
export const isCompletedBooking = (status: BookingStatus | string): boolean => {
  return status === BookingStatus.COMPLETED;
};

// Helper function to determine if a booking is "disputed"
export const isDisputedBooking = (status: BookingStatus | string): boolean => {
  return status === BookingStatus.DISPUTE;
};

// Helper function to determine if a booking is "cancelled"
export const isCancelledBooking = (status: BookingStatus | string): boolean => {
  return status === BookingStatus.CANCELLED;
};

// Helper function to determine if a booking is "pending"
export const isPendingBooking = (status: BookingStatus | string): boolean => {
  return status === BookingStatus.PENDING;
};

// Booking stats calculator
export interface BookingStatsCalculated {
  totalBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  disputedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}

export const calculateBookingStats = (
  bookings: Array<{ status: BookingStatus | string }>
): BookingStatsCalculated => {
  return {
    totalBookings: bookings.length,
    ongoingBookings: bookings.filter((b) => isOngoingBooking(b.status)).length,
    completedBookings: bookings.filter((b) => isCompletedBooking(b.status)).length,
    disputedBookings: bookings.filter((b) => isDisputedBooking(b.status)).length,
    cancelledBookings: bookings.filter((b) => isCancelledBooking(b.status)).length,
    pendingBookings: bookings.filter((b) => isPendingBooking(b.status)).length,
  };
};

// Booking status display config
export const bookingStatusConfig = {
  [BookingStatus.PENDING]: {
    label: "Pending",
    color: "bg-[#FFF4D6] text-[#F59E0B]",
    bg: "bg-[#FFF4D6]",
    text: "text-[#F59E0B]",
  },
  [BookingStatus.QUOTED]: {
    label: "Quoted",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.ACCEPTED_BY_BUYER]: {
    label: "Accepted by Buyer",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bg: "bg-[#D7FFE9]",
    text: "text-[#1FC16B]",
  },
  [BookingStatus.DECLINED_BY_BUYER]: {
    label: "Declined by Buyer",
    color: "bg-[#FDEDED] text-[#D00416]",
    bg: "bg-[#FDEDED]",
    text: "text-[#D00416]",
  },
  [BookingStatus.ACCEPTED_BY_SELLER]: {
    label: "Accepted by Seller",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bg: "bg-[#D7FFE9]",
    text: "text-[#1FC16B]",
  },
  [BookingStatus.DECLINED_BY_SELLER]: {
    label: "Declined by Seller",
    color: "bg-[#FDEDED] text-[#D00416]",
    bg: "bg-[#FDEDED]",
    text: "text-[#D00416]",
  },
  [BookingStatus.NEGOTIATING]: {
    label: "Negotiating",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.ACTIVE]: {
    label: "Active",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.COMPLETED]: {
    label: "Completed",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bg: "bg-[#D7FFE9]",
    text: "text-[#1FC16B]",
  },
  [BookingStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-[#FFF2B9] text-[#9D7F04]",
    bg: "bg-[#FFF2B9]",
    text: "text-[#9D7F04]",
  },
  [BookingStatus.DISPUTE]: {
    label: "Disputed",
    color: "bg-[#FDEDED] text-[#D00416]",
    bg: "bg-[#FDEDED]",
    text: "text-[#D00416]",
  },
  [BookingStatus.ARRIVAL]: {
    label: "Arrival",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.BUYER_CONFIRM_COMPLETION]: {
    label: "Awaiting Confirmation",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.BUYER_CONFIRM_START]: {
    label: "Awaiting Start Confirmation",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bg: "bg-[#E5F3FF]",
    text: "text-[#0066CC]",
  },
  [BookingStatus.PENDING_PAYMENT]: {
    label: "Pending Payment",
    color: "bg-[#FFF4D6] text-[#F59E0B]",
    bg: "bg-[#FFF4D6]",
    text: "text-[#F59E0B]",
  },
  [BookingStatus.PAID]: {
    label: "Paid",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bg: "bg-[#D7FFE9]",
    text: "text-[#1FC16B]",
  },
};

class UserManagementService {
  private request = new HttpService();

  async getListOfBuyers(pagination: { page: number; limit: number }) {
    return this.request.get(
      `/admin/users/admin-buyers?page=${pagination.page}&limit=${pagination.limit}`
    );
  }

  async getListOfSellers(pagination: { page: number; limit: number }) {
    return this.request.get(
      `/admin/users/admin-sellers?page=${pagination.page}&limit=${pagination.limit}`
    );
  }

  async getListOfAdmins(pagination: { page: number; limit: number }) {
    return this.request.get(
      `/admin/users/admin-admins?page=${pagination.page}&limit=${pagination.limit}`
    );
  }

  // Helper method to calculate booking stats from actual booking data
  calculateStatsFromBookings(bookings: Array<{ status: string }>) {
    return calculateBookingStats(bookings);
  }

  // Get booking status display config
  getBookingStatusConfig(status: BookingStatus | string) {
    return (
      bookingStatusConfig[status as BookingStatus] || {
        label: status,
        color: "bg-gray-200 text-gray-600",
        bg: "bg-gray-200",
        text: "text-gray-600",
      }
    );
  }
}

const userManagementService = new UserManagementService();
export default userManagementService;