import { BaseTransaction, PaymentFilterState } from "@/store/paymentManagementStore";

// Utility function for filtering payments
export const filterPayments = (
  payments: BaseTransaction[],
  filters: PaymentFilterState,
  searchQuery: string
): BaseTransaction[] => {
  let filtered = [...payments];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (payment) =>
        payment.reference?.toLowerCase().includes(query) ||
        payment.serviceTitle?.toLowerCase().includes(query) ||
        payment.buyerName?.toLowerCase().includes(query) ||
        payment.sellerName?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((payment) => payment.status === filters.status);
  }

  // Date range filter
  if (filters.fromDate) {
    filtered = filtered.filter(
      (payment) => new Date(payment.createdAt) >= filters.fromDate!
    );
  }

  if (filters.toDate) {
    filtered = filtered.filter(
      (payment) => new Date(payment.createdAt) <= filters.toDate!
    );
  }

  // Amount range filter
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((payment) => payment.amount >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((payment) => payment.amount <= filters.maxAmount!);
  }

  // User type filter
  if (filters.userType) {
    filtered = filtered.filter(
      (payment) => 
        payment.buyerRole === filters.userType || 
        payment.sellerRole === filters.userType
    );
  }

  return filtered;
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date helper
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};