/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { X } from "lucide-react";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { userManagementStore, UserType, FullUserType } from "@/store/userManagementStore";
import { formatDate } from "@/utils/formatTime";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import getBaseUrl from "@/services/baseUrl";

interface SellersTableProps {
  currentPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

interface ApiResponse {
  data: UserType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function SellersTable({ currentPage, onTotalPagesChange }: SellersTableProps) {
  const { openModal } = userManagementStore();
  const { data: session, status } = useSession();

  const [sellers, setSellers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert UserType to FullUserType when opening modal
  const handleSelectUser = (user: UserType) => {
    console.log("🟦 handleSelectUser CALLED with user:", user);
    
    // Convert UserType to FullUserType
    const fullUser: FullUserType = {
      ...user,
      wallet: user.Wallet || null,
      Wallet: user.Wallet || null,
      profile: user.profile || null,
      sellerProfile: user.profile || null,
      panicContacts: user.panicContacts || [],
      PanicContact: user.panicContacts || [],
      jobDocuments: [],
      JobDocument: [],
      userRoles: user.userRoles || [],
      bookingStats: user.bookingStats || null,
    };
    
    openModal("openSeller", fullUser);
  };

  const stableTotalPagesCallback = useCallback(onTotalPagesChange, []);

  useEffect(() => {
    if (status === "loading" || !session?.accessToken) return;

    const fetchSellers = async () => {
      try {
        setLoading(true);
        setError(null);

        const BASE_URL = getBaseUrl();

        const response = await axios.get<ApiResponse>(
          `${BASE_URL}/admin/sellers?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        setSellers(response.data.data || []);

        if (response.data.pagination?.pages) {
          stableTotalPagesCallback(response.data.pagination.pages);
        }
      } catch (error: any) {
        console.error("Error fetching sellers:", error);
        setError(
          error.response?.status === 401
            ? "Session expired. Please login again."
            : "Failed to load sellers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [currentPage, session?.accessToken, status, stableTotalPagesCallback]);

  if (status === "loading" || !session?.accessToken) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-gray-500">Authenticating...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-gray-500">Loading sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-500 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        No sellers found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FFFCFC] text-[#646264] text-left border-b border-[#E5E5E5] h-[60px]">
            <tr>
              <th className="py-3 px-4 font-medium">
                <div className="flex items-center gap-2">
                  <FaUserCircle size={18} />
                  <p>Full Name</p>
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Email Address</th>
              <th className="py-3 px-4 font-medium">Phone Number</th>
              <th className="py-3 px-4 font-medium">Account Status</th>
              <th className="py-3 px-4 font-medium">Registration Date</th>
              <th className="py-3 px-4 font-medium">Time</th>
            </tr>
          </thead>

          <tbody className="text-[#303237]">
            {sellers.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t border-gray-100 hover:bg-gray-50 transition h-[60px] cursor-pointer"
                )}
                onClick={() => handleSelectUser(item)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 relative group">
                    <div className="relative size-6 rounded-full overflow-hidden bg-gray-200">
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.fullName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>

                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {item.fullName}
                    </p>

                    {item.verificationStatus === true ? (
                      <div className="bg-[#1FC16B] size-[17px] rounded-full flex items-center justify-center">
                        <FaCheck className="text-white" size={12} />
                      </div>
                    ) : (
                      <div className="bg-[#D00416] size-[17px] rounded-full flex items-center justify-center">
                        <X className="text-white" size={12} />
                      </div>
                    )}

                    <div className="absolute left-0 top-8 z-50 hidden group-hover:flex items-center gap-2 bg-white border border-gray-200 shadow-md rounded-[8px] p-2 w-64">
                      {item.verificationStatus === true ? (
                        <div className="bg-[#1FC16B] w-5 h-5 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white" size={12} />
                        </div>
                      ) : (
                        <div className="bg-[#D00416] w-5 h-5 rounded-full flex items-center justify-center">
                          <X className="text-white" size={12} />
                        </div>
                      )}
                      <p className="text-xs text-gray-800">
                        {item.verificationStatus === true
                          ? "Seller account information have been verified"
                          : "Seller account is not verified"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.phone}</td>
                <td className="py-3 px-4">
                  <UserManagementStatusBadge status={item.status} />
                </td>
                <td className="py-3 px-4">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).date : "N/A"}
                </td>
                <td className="py-3 px-4">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).time : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden px-4 py-6">
        {sellers.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm cursor-pointer"
            onClick={() => handleSelectUser(item)}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {item.profilePicture ? (
                  <img
                    src={item.profilePicture}
                    alt={item.fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400" size={40} />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).date : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.verificationStatus === true ? (
                <div className="bg-[#1FC16B] size-8 rounded-full flex items-center justify-center">
                  <FaCheck className="text-white" size={16} />
                </div>
              ) : (
                <div className="bg-[#D00416] size-8 rounded-full flex items-center justify-center">
                  <X className="text-white" size={16} />
                </div>
              )}
              <UserManagementStatusBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}