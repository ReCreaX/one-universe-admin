"use client";

import React, { useState } from "react";
import { MoreVertical, ArrowUpRight } from "lucide-react";
import SettingsEmptyState from "../../SettingsEmptyState"; // Update path if needed

interface Subscription {
  id: string;
  sellerName: string;
  email: string;
  endDate: string;
  planType: string;
  status: "Active" | "Expired" | "Suspended";
}

const SubscriptionTable = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Sample data — replace with real API data later
  const subscriptions: Subscription[] = [
    {
      id: "1",
      sellerName: "Tomi Dosunmu",
      email: "tomi@example.com",
      endDate: "25 Dec 2025",
      planType: "Premium Pro",
      status: "Active",
    },
    {
      id: "2",
      sellerName: "Sarah Johnson",
      email: "sarah@shop.com",
      endDate: "10 Nov 2025",
      planType: "Standard Plus",
      status: "Active",
    },
    {
      id: "3",
      sellerName: "Mike Ade",
      email: "mikeade@gmail.com",
      endDate: "05 Oct 2025",
      planType: "Premium Pro",
      status: "Expired",
    },
    {
      id: "4",
      sellerName: "Grace Okon",
      email: "grace.okon@business.ng",
      endDate: "18 Jan 2026",
      planType: "Enterprise",
      status: "Suspended",
    },
  ];

  const handleActionClick = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const menuWidth = 200;
    const menuHeight = 100;
    const padding = 16;

    let left = rect.right - menuWidth + 10;
    if (left < padding) left = padding;

    let top = rect.bottom + window.scrollY + 8;
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    setMenuPosition({ top, left });
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  const handleViewDetails = (subscription: Subscription) => {
    alert(`View details for ${subscription.sellerName}`);
    setOpenMenuId(null);
    // Later: open modal with full subscription details
  };

  const getStatusStyles = (status: Subscription["status"]) => {
    switch (status) {
      case "Active":
        return "bg-[#D7FFE9] text-[#00AB47]";
      case "Expired":
        return "bg-[#FFE6E6] text-[#D84040]";
      case "Suspended":
        return "bg-[#FFF2B9] text-[#B76E00]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const openSubscription = openMenuId
    ? subscriptions.find(s => s.id === openMenuId)
    : null;

  if (subscriptions.length === 0) {
    return <SettingsEmptyState />;
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                Seller Name
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                Email Address
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                End Date
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                Plan Type
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">
                Status
              </th>
              <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#7B7B7B]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                  {sub.sellerName}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                  {sub.email}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                  {sub.endDate}
                </td>
                <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">
                  {sub.planType}
                </td>
                <td className="py-[18px] px-[25px]">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      sub.status
                    )}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {sub.status}
                  </span>
                </td>
                <td className="py-[18px] px-[25px]">
                  <button
                    onClick={(e) => handleActionClick(sub.id, e)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} className="text-[#303237]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white border border-[#E8E3E3] rounded-lg p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-dm-sans font-medium text-base text-[#171417]">
                  {sub.sellerName}
                </h4>
                <p className="font-dm-sans text-sm text-[#6B6969] mt-1">{sub.email}</p>
              </div>
              <button
                onClick={(e) => handleActionClick(sub.id, e)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical size={20} className="text-[#303237]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-[#6B6969]">End Date</p>
                <p className="font-medium text-[#171417] mt-1">{sub.endDate}</p>
              </div>
              <div>
                <p className="text-[#6B6969]">Plan</p>
                <p className="font-medium text-[#171417] mt-1">{sub.planType}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                  sub.status
                )}`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                {sub.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Menu (same style as tickets) */}
      {openSubscription && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#E8E3E3] py-2 w-48"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            onClick={() => handleViewDetails(openSubscription)}
            className="w-full px-4 py-2 text-left font-dm-sans text-sm text-[#171417] hover:bg-[#F5F5F5] transition-colors"
          >
            View Details
          </button>
          <button className="w-full px-4 py-2 text-left font-dm-sans text-sm text-[#171417] hover:bg-[#F5F5F5] transition-colors opacity-50 cursor-not-allowed">
            Renew Plan (Coming soon)
          </button>
        </div>
      )}
    </>
  );
};

export default SubscriptionTable;