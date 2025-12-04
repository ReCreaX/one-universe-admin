"use client";

import React, { useState } from "react";
import AdsSubscriberDetailsModal from "./AdsSubscriberDetailsModal"; 

interface SponsorAd {
  id: string;
  sellerName: string;
  businessName: string;
  email: string;
  endDate: string;
  planType: string;
  status: "Active" | "Expired" | "Suspended";
}

const SponsorAdsTable = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);

  const ads: SponsorAd[] = [
    {
      id: "1",
      sellerName: "Chioma Eze",
      businessName: "Chioma Beauty Empire",
      email: "chioma@brand.ng",
      endDate: "30 Dec 2025",
      planType: "Premium Ad Slot",
      status: "Active",
    },
    {
      id: "2",
      sellerName: "TechMart NG",
      businessName: "TechMart Nigeria Ltd",
      email: "ads@techmart.com",
      endDate: "15 Jan 2026",
      planType: "Featured Banner",
      status: "Active",
    },
    {
      id: "3",
      sellerName: "FashionHub",
      businessName: "FashionHub Co",
      email: "sponsor@fashionhub.co",
      endDate: "01 Oct 2025",
      planType: "Premium Ad Slot",
      status: "Expired",
    },
  ];

  const handleViewDetails = (ad: SponsorAd) => {
    setSelectedSubscriber({
      ...ad,
      phone: "+2349012345678",
      startDate: "01/06/2025",
      payments: [
        { date: "01/06/2025", amount: "₦15,000", status: "Paid" as const, transactionId: "TXN8877665544" },
        { date: "01/05/2025", amount: "₦15,000", status: "Failed" as const, transactionId: "TXN1122334455" },
        { date: "01/04/2025", amount: "₦15,000", status: "Paid" as const, transactionId: "TXN9988776655" },
      ],
    });
  };

  const getStatusColor = (status: SponsorAd["status"]) => {
    switch (status) {
      case "Active": return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired": return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended": return "bg-[#FFF2B9] text-[#B76E00]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (ads.length === 0) {
    return <div className="py-20 text-center text-gray-500">No ads found</div>;
  }

  return (
    <>
      {/* Desktop Table */}
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
            {ads.map((ad) => (
              <tr
                key={ad.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.sellerName}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.email}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.endDate}</td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{ad.planType}</td>
                <td className="py-[18px] px-[25px]">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {ad.status}
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-[#E8E3E3] rounded-lg p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-dm-sans font-medium text-base text-[#171417]">
                  {ad.sellerName}
                </h4>
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
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {ad.status}
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

      {/* Beautiful Modal */}
      <AdsSubscriberDetailsModal
        isOpen={!!selectedSubscriber}
        onClose={() => setSelectedSubscriber(null)}
        subscriber={selectedSubscriber}
      />
    </>
  );
};

export default SponsorAdsTable;