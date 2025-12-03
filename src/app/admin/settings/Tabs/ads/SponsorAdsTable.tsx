// components/ads/SponsorAdsTable.tsx
"use client";

import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import SettingsEmptyState from "../../SettingsEmptyState";

interface SponsorAd {
  id: string;
  sellerName: string;
  email: string;
  endDate: string;
  planType: string;
  status: "Active" | "Expired" | "Suspended";
}

const SponsorAdsTable = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const ads: SponsorAd[] = [
    { id: "1", sellerName: "Chioma Eze", email: "chioma@brand.ng", endDate: "30 Dec 2025", planType: "Premium Ad Slot", status: "Active" },
    { id: "2", sellerName: "TechMart NG", email: "ads@techmart.com", endDate: "15 Jan 2026", planType: "Featured Banner", status: "Active" },
    { id: "3", sellerName: "FashionHub", email: "sponsor@fashionhub.co", endDate: "01 Oct 2025", planType: "Premium Ad Slot", status: "Expired" },
  ];

  const handleActionClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right - 200,
    });
    setOpenMenuId(prev => prev === id ? null : id);
  };

  const getStatusColor = (status: SponsorAd["status"]) => {
    switch (status) {
      case "Active": return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired": return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended": return "bg-[#FFF2B9] text-[#B76E00]";
    }
  };

  if (ads.length === 0) return <SettingsEmptyState />;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
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
              <tr key={ad.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
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
                  <button onClick={(e) => handleActionClick(ad.id, e)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={20} className="text-[#303237]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - same as subscription */}
      <div className="md:hidden space-y-4 p-4">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white border border-[#E8E3E3] rounded-lg p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-dm-sans font-medium text-base text-[#171417]">{ad.sellerName}</h4>
                <p className="font-dm-sans text-sm text-[#6B6969]">{ad.email}</p>
              </div>
              <button onClick={(e) => handleActionClick(ad.id, e)} className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><p className="text-[#6B6969]">End Date</p><p className="font-medium">{ad.endDate}</p></div>
              <div><p className="text-[#6B6969]">Ad Type</p><p className="font-medium">{ad.planType}</p></div>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              {ad.status}
            </span>
          </div>
        ))}
      </div>

      {/* Action Menu */}
      {openMenuId && (
        <div className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#E8E3E3] py-2 w-48" style={{ top: menuPosition.top, left: menuPosition.left }}>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">View Details</button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 opacity-50">Edit Ad Slot</button>
        </div>
      )}
    </>
  );
};

export default SponsorAdsTable;