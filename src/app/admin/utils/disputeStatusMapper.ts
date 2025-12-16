// src/utils/disputeStatusMapper.ts

export type DisplayStatus = "open" | "under review" | "resolved";
export type ApiStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";
export type BookingStatus = "DISPUTE" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "PENDING";

// Export Dispute type for use across components
export interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface BookingDetails {
  id: string;
  serviceTitle: string;
  status: BookingStatus;
  Job?: unknown;
}

export interface Dispute {
  id: string;
  bookingId: string;
  openedById: string;
  openedByRole: "BUYER" | "SELLER";
  sellerId?: string;
  buyerId: string;
  reason: string;
  description: string;
  evidenceUrls: string[];
  status: ApiStatus;
  resolveComment?: string;
  resolvedAt?: string;
  createdAt: string;
  buyer: UserDetails;
  seller?: UserDetails;
  booking: BookingDetails;
}

const apiToDisplayMap: Record<ApiStatus, DisplayStatus> = {
  OPEN: "open",
  UNDER_REVIEW: "under review",
  RESOLVED: "resolved",
};

const displayToApiMap: Record<DisplayStatus, ApiStatus> = {
  open: "OPEN",
  "under review": "UNDER_REVIEW",
  resolved: "RESOLVED",
};

/**
 * Convert API status to display status
 * @param status - API status (OPEN, UNDER_REVIEW, RESOLVED) or display status
 * @returns Display status (open, under review, resolved)
 */
export function mapApiToDisplay(status: ApiStatus | DisplayStatus): DisplayStatus {
  // If it's already a display status, return as is
  if (status in displayToApiMap) {
    return status as DisplayStatus;
  }

  // Otherwise map from API status
  return apiToDisplayMap[status as ApiStatus];
}

/**
 * Convert display status to API status
 * @param status - Display status (open, under review, resolved) or API status
 * @returns API status (OPEN, UNDER_REVIEW, RESOLVED)
 */
export function mapDisplayToApi(status: DisplayStatus | ApiStatus): ApiStatus {
  // If it's already an API status, return as is
  if (status in apiToDisplayMap) {
    return status as ApiStatus;
  }

  // Otherwise map from display status
  return displayToApiMap[status as DisplayStatus];
}

/**
 * Get display label for status (for UI display with capital first letter)
 * @param status - Any dispute status
 * @returns Formatted label for display
 */
export function getStatusLabel(status: ApiStatus | DisplayStatus): string {
  const display = mapApiToDisplay(status);
  return display.charAt(0).toUpperCase() + display.slice(1);
}