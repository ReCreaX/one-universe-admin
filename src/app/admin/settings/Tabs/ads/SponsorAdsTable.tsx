"use client";

import React, { useState, useMemo } from "react";
import AdsSubscriberDetailsModal from "./AdsSubscriberDetailsModal";
import { SponsorAd, Pagination } from "@/store/sponsorAdsStore";
import { useSponsorAdsStore } from "@/store/sponsorAdsStore";
import { SponsorAdsFilterState } from "../../components/filters/SponsorAdsFilter";

interface SponsorAdsTableProps {
  ads: SponsorAd[];
  filters?: SponsorAdsFilterState;
  pagination?: Pagination | null;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

const SponsorAdsTable: React.FC<SponsorAdsTableProps> = ({ 
  ads, 
  filters = {}, 
  pagination = null,
  loading = false,
  onPageChange = () => {},
}) => {
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const { searchTerm, selectedFilters } = useSponsorAdsStore();

  const formattedAds = useMemo(() => {
    return ads.map((ad) => {
      const isSeller = ad.user.role === "SELLER" || 
        ad.user.userRoles.some(ur => ur.role.name === "SELLER");
      
      return {
        ...ad,
        sellerName: ad.user.fullName,
        email: ad.user.email,
        phone: ad.user.phone,
        endDate: new Date(ad.endDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        startDate: new Date(ad.startDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        planType: ad.plan.name,
        statusLabel: ad.status === 'ACTIVE' ? 'Active' : 
                    ad.status === 'EXPIRED' ? 'Expired' : 
                    ad.status === 'SUSPENDED' ? 'Suspended' : ad.status,
        isSeller,
      };
    });
  }, [ads]);

  const filteredAds = useMemo(() => {
    return formattedAds.filter((ad) => {
      // Search filter - search name, email, phone, or plan
      const matchesSearch =
        ad.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.planType.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter from store - match All or specific status
      const matchesStatusFilter =
        selectedFilters.includes('All') || selectedFilters.includes(ad.status);

      // Subscription Status filter from filter panel
      if (filters.subscriptionStatus && ad.statusLabel !== filters.subscriptionStatus) {
        return false;
      }

      // Plan Type filter from filter panel
      if (filters.planType && !ad.planType.toLowerCase().includes(filters.planType.toLowerCase())) {
        return false;
      }

      // Date range filter from filter panel
      if (filters.fromDate || filters.toDate) {
        const adDate = new Date(ad.endDate);
        if (filters.fromDate && adDate < filters.fromDate) return false;
        if (filters.toDate && adDate > filters.toDate) return false;
      }

      // All filters must match
      return matchesSearch && matchesStatusFilter;
    });
  }, [formattedAds, searchTerm, selectedFilters, filters]);

  const handleViewDetails = (ad: typeof formattedAds[0]) => {
    const payments = ad.transaction ? 
      Array.isArray(ad.transaction) ? 
        ad.transaction.map((txn: any) => ({
          date: new Date(txn.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: `₦${txn.amount.toLocaleString()}`,
          status: txn.status === 'PAID' ? 'Paid' : txn.status === 'PENDING' ? 'Pending' : 'Failed',
          transactionId: txn.reference || txn.id,
        }))
      : [
        {
          date: new Date(ad.transaction.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          amount: `₦${ad.transaction.amount.toLocaleString()}`,
          status: ad.transaction.status === 'PAID' ? 'Paid' : ad.transaction.status === 'PENDING' ? 'Pending' : 'Failed',
          transactionId: ad.transaction.reference || ad.transaction.id,
        }
      ]
    : [];

    setSelectedSubscriber({
      id: ad.id,
      userId: ad.userId || ad.user.id,
      sellerName: ad.sellerName,
      businessName: ad.sellerName,
      email: ad.email,
      phone: ad.phone,
      planType: ad.planType,
      startDate: ad.startDate,
      endDate: ad.endDate,
      status: ad.statusLabel,
      payments: payments,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired": return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended": return "bg-[#FFF2B9] text-[#B76E00]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (filteredAds.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#757575] font-dm-sans text-lg">
          {Object.values(filters).some(Boolean) || searchTerm || !selectedFilters.includes('All')
            ? "No ads match your current filters"
            : "No sponsored ads found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Seller Name</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Email Address</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">End Date</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Ad Type</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#7B7B7B]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.map((ad) => (
              <tr
                key={ad.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.sellerName}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.email}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.endDate}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.planType}</td>
                <td className="py-[18px] px-[25px]">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.statusLabel)}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {ad.statusLabel}
                  </span>
                </td>
                <td className="py-[18px] px-[25px]">
                  <button
                    onClick={() => handleViewDetails(ad)}
                    className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 p-4">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="bg-white border border-[#E8E3E3] rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-dm-sans font-medium text-base text-[#171417]">{ad.sellerName}</h4>
                <p className="font-dm-sans text-sm text-[#6B6969] mt-1">{ad.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-[#6B6969]">End Date</p>
                <p className="font-medium text-[#171417] mt-1">{ad.endDate}</p>
              </div>
              <div>
                <p className="text-[#6B6969]">Ad Type</p>
                <p className="font-medium text-[#171417] mt-1">{ad.planType}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.statusLabel)}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {ad.statusLabel}
              </span>

              <button
                onClick={() => handleViewDetails(ad)}
                className="font-dm-sans text-sm font-medium text-[#154751] hover:text-[#04171F] underline-offset-2 hover:underline"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-3 px-6 py-6 border-t border-[#E5E5E5] bg-white">
          <button
            onClick={() => {
              if (pagination.page > 1 && !loading) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onPageChange(pagination.page - 1);
              }
            }}
            disabled={pagination.page === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#171417] font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-[#646264] font-dm-sans font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => {
              if (pagination.page < pagination.pages && !loading) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onPageChange(pagination.page + 1);
              }
            }}
            disabled={pagination.page === pagination.pages || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E5E5] text-[#171417] font-dm-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <AdsSubscriberDetailsModal
        isOpen={!!selectedSubscriber}
        onClose={() => setSelectedSubscriber(null)}
        subscriber={selectedSubscriber}
      />
    </>
  );
};

export default SponsorAdsTable;