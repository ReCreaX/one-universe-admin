// src/utils/bookingStatus.ts

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

/**
 * Defines which statuses count as "ongoing"
 * Ongoing bookings are those that are currently active or awaiting action
 */
export const ONGOING_BOOKING_STATUSES = [
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
] as const;

/**
 * Check if a booking status represents an ongoing booking
 */
export const isOngoingBooking = (status: string | BookingStatus): boolean => {
  return ONGOING_BOOKING_STATUSES.includes(status as any);
};

/**
 * Check if a booking status represents a completed booking
 */
export const isCompletedBooking = (status: string | BookingStatus): boolean => {
  return status === BookingStatus.COMPLETED;
};

/**
 * Check if a booking status represents a disputed booking
 */
export const isDisputedBooking = (status: string | BookingStatus): boolean => {
  return status === BookingStatus.DISPUTE;
};

/**
 * Check if a booking status represents a cancelled booking
 */
export const isCancelledBooking = (status: string | BookingStatus): boolean => {
  return status === BookingStatus.CANCELLED;
};

/**
 * Check if a booking status represents a pending booking (not yet quoted)
 */
export const isPendingBooking = (status: string | BookingStatus): boolean => {
  return status === BookingStatus.PENDING;
};

/**
 * Get the count of bookings in each category
 */
export interface BookingStatsSummary {
  totalBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  disputedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}

export const calculateBookingStats = (
  bookings: Array<{ status: string | BookingStatus }>
): BookingStatsSummary => {
  return {
    totalBookings: bookings.length,
    ongoingBookings: bookings.filter((b) => isOngoingBooking(b.status)).length,
    completedBookings: bookings.filter((b) => isCompletedBooking(b.status)).length,
    disputedBookings: bookings.filter((b) => isDisputedBooking(b.status)).length,
    cancelledBookings: bookings.filter((b) => isCancelledBooking(b.status)).length,
    pendingBookings: bookings.filter((b) => isPendingBooking(b.status)).length,
  };
};

/**
 * Booking status display configuration
 * Contains label, colors, and styling for each status
 */
export const BOOKING_STATUS_CONFIG = {
  [BookingStatus.PENDING]: {
    label: "Pending",
    description: "Awaiting quotes from sellers",
    color: "bg-[#FFF4D6] text-[#F59E0B]",
    bgColor: "bg-[#FFF4D6]",
    textColor: "text-[#F59E0B]",
    icon: "⏳",
  },
  [BookingStatus.QUOTED]: {
    label: "Quoted",
    description: "Seller has provided a quote",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "💬",
  },
  [BookingStatus.ACCEPTED_BY_BUYER]: {
    label: "Accepted by Buyer",
    description: "Buyer has accepted the quote",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bgColor: "bg-[#D7FFE9]",
    textColor: "text-[#1FC16B]",
    icon: "✅",
  },
  [BookingStatus.DECLINED_BY_BUYER]: {
    label: "Declined by Buyer",
    description: "Buyer has declined the quote",
    color: "bg-[#FDEDED] text-[#D00416]",
    bgColor: "bg-[#FDEDED]",
    textColor: "text-[#D00416]",
    icon: "❌",
  },
  [BookingStatus.ACCEPTED_BY_SELLER]: {
    label: "Accepted by Seller",
    description: "Seller has accepted the terms",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bgColor: "bg-[#D7FFE9]",
    textColor: "text-[#1FC16B]",
    icon: "✅",
  },
  [BookingStatus.DECLINED_BY_SELLER]: {
    label: "Declined by Seller",
    description: "Seller has declined",
    color: "bg-[#FDEDED] text-[#D00416]",
    bgColor: "bg-[#FDEDED]",
    textColor: "text-[#D00416]",
    icon: "❌",
  },
  [BookingStatus.NEGOTIATING]: {
    label: "Negotiating",
    description: "Terms are being negotiated",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "🤝",
  },
  [BookingStatus.ACTIVE]: {
    label: "Active",
    description: "Booking is active and in progress",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "⚙️",
  },
  [BookingStatus.COMPLETED]: {
    label: "Completed",
    description: "Booking has been completed",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bgColor: "bg-[#D7FFE9]",
    textColor: "text-[#1FC16B]",
    icon: "✓",
  },
  [BookingStatus.CANCELLED]: {
    label: "Cancelled",
    description: "Booking has been cancelled",
    color: "bg-[#FFF2B9] text-[#9D7F04]",
    bgColor: "bg-[#FFF2B9]",
    textColor: "text-[#9D7F04]",
    icon: "⊘",
  },
  [BookingStatus.DISPUTE]: {
    label: "Disputed",
    description: "Booking is under dispute",
    color: "bg-[#FDEDED] text-[#D00416]",
    bgColor: "bg-[#FDEDED]",
    textColor: "text-[#D00416]",
    icon: "⚠️",
  },
  [BookingStatus.ARRIVAL]: {
    label: "Arrival",
    description: "Service provider has arrived",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "📍",
  },
  [BookingStatus.BUYER_CONFIRM_COMPLETION]: {
    label: "Awaiting Completion",
    description: "Awaiting buyer confirmation of completion",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "⏳",
  },
  [BookingStatus.BUYER_CONFIRM_START]: {
    label: "Awaiting Start",
    description: "Awaiting buyer confirmation to start",
    color: "bg-[#E5F3FF] text-[#0066CC]",
    bgColor: "bg-[#E5F3FF]",
    textColor: "text-[#0066CC]",
    icon: "⏳",
  },
  [BookingStatus.PENDING_PAYMENT]: {
    label: "Pending Payment",
    description: "Awaiting payment",
    color: "bg-[#FFF4D6] text-[#F59E0B]",
    bgColor: "bg-[#FFF4D6]",
    textColor: "text-[#F59E0B]",
    icon: "💳",
  },
  [BookingStatus.PAID]: {
    label: "Paid",
    description: "Payment has been received",
    color: "bg-[#D7FFE9] text-[#1FC16B]",
    bgColor: "bg-[#D7FFE9]",
    textColor: "text-[#1FC16B]",
    icon: "✓",
  },
} as const;

/**
 * Get status config for a given booking status
 */
export const getBookingStatusConfig = (status: string | BookingStatus) => {
  return (
    BOOKING_STATUS_CONFIG[status as BookingStatus] || {
      label: String(status),
      description: "Unknown status",
      color: "bg-gray-200 text-gray-600",
      bgColor: "bg-gray-200",
      textColor: "text-gray-600",
      icon: "❓",
    }
  );
};

/**
 * Get all possible status transitions for a booking
 * This can be used to validate what state a booking can transition to
 */
export const getValidTransitions = (
  currentStatus: string | BookingStatus
): BookingStatus[] => {
  const transitions: Record<string, BookingStatus[]> = {
    [BookingStatus.PENDING]: [BookingStatus.QUOTED, BookingStatus.CANCELLED],
    [BookingStatus.QUOTED]: [
      BookingStatus.ACCEPTED_BY_BUYER,
      BookingStatus.DECLINED_BY_BUYER,
      BookingStatus.NEGOTIATING,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.ACCEPTED_BY_BUYER]: [
      BookingStatus.NEGOTIATING,
      BookingStatus.ACTIVE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.DECLINED_BY_BUYER]: [BookingStatus.CANCELLED],
    [BookingStatus.ACCEPTED_BY_SELLER]: [
      BookingStatus.ACTIVE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.DECLINED_BY_SELLER]: [BookingStatus.CANCELLED],
    [BookingStatus.NEGOTIATING]: [
      BookingStatus.ACCEPTED_BY_BUYER,
      BookingStatus.ACCEPTED_BY_SELLER,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.ACTIVE]: [
      BookingStatus.ARRIVAL,
      BookingStatus.BUYER_CONFIRM_COMPLETION,
      BookingStatus.DISPUTE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.ARRIVAL]: [
      BookingStatus.BUYER_CONFIRM_START,
      BookingStatus.DISPUTE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.BUYER_CONFIRM_START]: [
      BookingStatus.ACTIVE,
      BookingStatus.DISPUTE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.BUYER_CONFIRM_COMPLETION]: [
      BookingStatus.COMPLETED,
      BookingStatus.DISPUTE,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.COMPLETED]: [BookingStatus.PENDING_PAYMENT],
    [BookingStatus.PENDING_PAYMENT]: [BookingStatus.PAID, BookingStatus.DISPUTE],
    [BookingStatus.PAID]: [BookingStatus.DISPUTE],
    [BookingStatus.DISPUTE]: [
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
      BookingStatus.PENDING_PAYMENT,
    ],
    [BookingStatus.CANCELLED]: [],
  };

  return transitions[currentStatus as string] || [];
};