"use client";

import React, { useState } from "react";
import { Referral } from "@/types/Referral";
import ReferralEmptyState from "./ReferralEmptyState";
import ReferralDetailModal from "./modal/ReferralDetailModal";
import ResolveRewardModal from "./modal/ResolveRewardModal";
import { Eye, CheckCircle, CircleCheck, Clock, Loader2, AlertTriangle } from "lucide-react";

interface ReferralTableProps {
  referrals: Referral[];
}

const ReferralTable = ({ referrals }: ReferralTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const handleActionClick = (
    referralId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setOpenMenuId(prev => prev === referralId ? null : referralId);
  };

  const openReferralDetail = (referral: Referral) => {
    setSelectedReferral(referral);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };

  const openResolveModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setIsResolveModalOpen(true);
    setOpenMenuId(null);
  };

  const handleActionComplete = () => {
    setIsResolveModalOpen(false);
    setSelectedReferral(null);
  };

  // ✅ NEW: Transaction status badge configuration with icons
  const getTransactionConfig = (status: Referral["firstTransaction"], isMobile: boolean = false) => {
    const iconSize = isMobile ? 14 : 16;
    const normalizedStatus = status?.toUpperCase();
    
    switch (normalizedStatus) {
      case 'COMPLETED':
        return {
          icon: <CircleCheck size={iconSize} className="text-[#1FC16B]" />,
          bgClass: "bg-[#E0F5E6]",
          textClass: "text-[#1FC16B]",
          label: "Completed"
        };
      case 'PENDING':
        return {
          icon: <Clock size={iconSize} className="text-[#9D7F04]" />,
          bgClass: "bg-[#FFF2B9]",
          textClass: "text-[#9D7F04]",
          label: "Pending"
        };
      default:
        return {
          icon: <AlertTriangle size={iconSize} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: status || "Unknown"
        };
    }
  };

  // ✅ NEW: Status badge configuration with icons
  const getStatusConfig = (status: Referral["status"], isMobile: boolean = false) => {
    const iconSize = isMobile ? 14 : 16;
    const normalizedStatus = status?.toUpperCase();
    
    switch (normalizedStatus) {
      case 'PAID':
        return {
          icon: <CircleCheck size={iconSize} className="text-[#1FC16B]" />,
          bgClass: "bg-[#E0F5E6]",
          textClass: "text-[#1FC16B]",
          label: "Paid"
        };
      case 'PENDING':
        return {
          icon: <Clock size={iconSize} className="text-[#9D7F04]" />,
          bgClass: "bg-[#FFF2B9]",
          textClass: "text-[#9D7F04]",
          label: "Pending"
        };
      case 'PROCESSING':
        return {
          icon: <Loader2 size={iconSize} className="text-[#007BFF]" />,
          bgClass: "bg-[#D3E1FF]",
          textClass: "text-[#007BFF]",
          label: "Processing"
        };
      default:
        return {
          icon: <Clock size={iconSize} className="text-[#272727]" />,
          bgClass: "bg-[#E5E5E5]",
          textClass: "text-[#272727]",
          label: status || "Unknown"
        };
    }
  };

  const getRewardIcon = (earned: boolean) => {
    return earned ? (
      <div className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1FC16B]">
          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L5.5 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/>
        </svg>
        <span className="font-dm-sans text-sm font-medium text-[#1FC16B]">Yes</span>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D84040]">
          <path d="M12.22 3.78a.75.75 0 010 1.06L9.06 8l3.16 3.16a.75.75 0 11-1.06 1.06L8 9.06l-3.16 3.16a.75.75 0 11-1.06-1.06L6.94 8 3.78 4.84a.75.75 0 111.06-1.06L8 6.94l3.16-3.16a.75.75 0 011.06 0z" fill="currentColor"/>
        </svg>
        <span className="font-dm-sans text-sm font-medium text-[#D84040]">No</span>
      </div>
    );
  };

  return (
    <>
      {referrals.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#FFFCFC] border-b border-[#E5E5E5]">
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Referral Name</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Referred Name</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">First Transaction</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Sign Date</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Status</th>
                  <th className="py-[18px] px-[25px] font-dm-sans font-medium text-base text-[#646264]">Reward Earned</th>
                  <th className="py-[18px] px-[25px] font-inter font-medium text-base text-[#7B7B7B]">Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => {
                  const transactionConfig = getTransactionConfig(referral.firstTransaction);
                  const statusConfig = getStatusConfig(referral.status);
                  
                  return (
                    <tr key={referral.id} className="bg-white border-b border-[#E5E5E5] hover:bg-[#FAFAFA] relative">
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.referrerName}</td>
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.referredName}</td>
                      <td className="py-[18px] px-[25px]">
                        {/* ✅ NEW: Transaction badge with icon */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-dm-sans ${transactionConfig.bgClass} ${transactionConfig.textClass}`}
                        >
                          {transactionConfig.icon}
                          {transactionConfig.label}
                        </span>
                      </td>
                      <td className="py-[18px] px-[25px] font-dm-sans text-base text-[#303237]">{referral.signDate}</td>
                      <td className="py-[18px] px-[25px]">
                        {/* ✅ NEW: Status badge with icon */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-dm-sans ${statusConfig.bgClass} ${statusConfig.textClass}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-[18px] px-[25px]">
                        {getRewardIcon(referral.rewardEarned)}
                      </td>
                      <td className="py-[18px] px-[25px]">
                        <div className="relative">
                          <button
                            onClick={(e) => handleActionClick(referral.id, e)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                              <circle cx="10" cy="5" r="2" fill="currentColor" />
                              <circle cx="10" cy="10" r="2" fill="currentColor" />
                              <circle cx="10" cy="15" r="2" fill="currentColor" />
                            </svg>
                          </button>

                          {/* Action Menu */}
                          {openMenuId === referral.id && (
                            <div className="absolute right-0 mt-2 w-[169px] bg-white rounded-[20px] shadow-[0px_8px_29px_0px_#5F5E5E30] overflow-hidden z-40">
                              <button
                                onClick={() => openReferralDetail(referral)}
                                className="w-full px-[25px] py-[18px] flex items-center gap-[10px] border-b border-[#E5E7EF] hover:bg-gray-50 transition-colors"
                              >
                                <Eye width={18} height={18} className="text-[#454345]" />
                                <span className="font-dm-sans font-regular text-base text-[#454345]">View Details</span>
                              </button>
                              <button
                                onClick={() => openResolveModal(referral)}
                                className="w-full px-[25px] py-[18px] flex items-center gap-[10px] hover:bg-gray-50 transition-colors"
                              >
                                <CheckCircle width={18} height={18} className="text-[#454345]" />
                                <span className="font-dm-sans font-regular text-base text-[#454345]">Resolve</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {referrals.map((referral) => {
              const transactionConfig = getTransactionConfig(referral.firstTransaction, true);
              const statusConfig = getStatusConfig(referral.status, true);
              
              return (
                <div key={referral.id} className="bg-white border border-[#E8E3E3] rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-dm-sans font-medium text-base text-[#303237]">{referral.referrerName}</span>
                      </div>
                      <p className="font-dm-sans text-sm text-[#454345]">Referred: {referral.referredName}</p>
                    </div>
                    <button
                      onClick={(e) => handleActionClick(referral.id, e)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#303237]">
                        <circle cx="10" cy="5" r="2" fill="currentColor" />
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                        <circle cx="10" cy="15" r="2" fill="currentColor" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* ✅ NEW: Transaction badge with icon */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-dm-sans ${transactionConfig.bgClass} ${transactionConfig.textClass}`}
                    >
                      {transactionConfig.icon}
                      {transactionConfig.label}
                    </span>
                    
                    {/* ✅ NEW: Status badge with icon */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-dm-sans ${statusConfig.bgClass} ${statusConfig.textClass}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Date:</span> {referral.signDate}</p>
                    <p className="font-dm-sans text-[#454345]"><span className="font-medium text-[#303237]">Reward:</span> {referral.rewardEarned ? "Yes" : "No"}</p>
                  </div>

                  {/* Mobile View Details Button */}
                  <button
                    onClick={() => openReferralDetail(referral)}
                    className="w-full px-6 py-2 rounded-full flex items-center justify-center gap-2 text-white font-dm-sans font-medium text-base transition-opacity hover:opacity-90"
                    style={{ background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)' }}
                  >
                    <Eye width={18} height={18} />
                    <span>View Details</span>
                  </button>

                  {/* Mobile Action Menu */}
                  {openMenuId === referral.id && (
                    <div className="mt-3 rounded-[20px] bg-white border border-[#E5E7EF] overflow-hidden">
                      <button
                        onClick={() => openReferralDetail(referral)}
                        className="w-full px-[25px] py-[18px] flex items-center gap-[10px] border-b border-[#E5E7EF] hover:bg-gray-50 transition-colors"
                      >
                        <Eye width={18} height={18} className="text-[#454345]" />
                        <span className="font-dm-sans font-regular text-base text-[#454345]">View Details</span>
                      </button>
                      <button
                        onClick={() => openResolveModal(referral)}
                        className="w-full px-[25px] py-[18px] flex items-center gap-[10px] hover:bg-gray-50 transition-colors"
                      >
                        <CheckCircle width={18} height={18} className="text-[#454345]" />
                        <span className="font-dm-sans font-regular text-base text-[#454345]">Resolve</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <ReferralEmptyState />
      )}

      {/* Referral Detail Modal */}
      {selectedReferral && (
        <ReferralDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReferral(null);
          }}
          referral={selectedReferral}
        />
      )}

      {/* Resolve Reward Modal */}
      {selectedReferral && (
        <ResolveRewardModal
          isOpen={isResolveModalOpen}
          onClose={() => {
            setIsResolveModalOpen(false);
            setSelectedReferral(null);
          }}
          referral={selectedReferral}
          onActionComplete={handleActionComplete}
        />
      )}
    </>
  );
};

export default ReferralTable;