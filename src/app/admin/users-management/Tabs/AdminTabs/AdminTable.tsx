"use client";

import { cn } from "@/lib/utils";
import { FaUserCircle } from "react-icons/fa";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { formatDate } from "@/utils/formatTime";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import getBaseUrl from "@/services/baseUrl";

const BASE_URL = getBaseUrl();

interface AdminTableProps {
  currentPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

interface ApiResponse {
  data: UserType[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function AdminTable({ currentPage, onTotalPagesChange }: AdminTableProps) {
  const { openModal } = userManagementStore();
  const { data: session, status } = useSession();

  const [admins, setAdmins] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelectAdmin = (admin: UserType) => {
    openModal("openAdmin", admin);
  };

  // Stable callback to prevent unnecessary re-renders
  const stableCallback = useCallback(onTotalPagesChange, []);

  useEffect(() => {
    // Wait for session to be ready
    if (status === "loading" || !session?.accessToken) return;

    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = session.accessToken;

        const response = await axios.get<ApiResponse>(
          `${BASE_URL}/admin/others?page=${currentPage}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data || [];
        setAdmins(data);

        // Only trust backend's pagination.pages
        if (response.data.pagination?.pages !== undefined) {
          stableCallback(response.data.pagination.pages);
        } else {
          // Safe fallback: if backend doesn't send pagination, assume current page exists
          stableCallback(Math.max(currentPage, 1));
        }
      } catch (err: any) {
        console.error("Failed to fetch admins:", err);
        setError(
          err.response?.status === 401
            ? "Session expired. Please sign in again."
            : "Failed to load admin users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [currentPage, session?.accessToken, status, stableCallback]);

  // Loading or authenticating
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
        <p className="text-gray-500">Loading admin users...</p>
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

  if (admins.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        No admin users found.
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
            {admins.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t border-gray-100 hover:bg-gray-50 transition h-[60px] cursor-pointer"
                )}
                onClick={() => handleSelectAdmin(item)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.fullName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-gray-400" size={32} />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {item.fullName}
                    </p>
                  </div>
                </td>

                <td className="py-3 px-4">{item.email}</td>
                <td className="py-3 px-4">{item.phone || "N/A"}</td>
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
        {admins.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
            onClick={() => handleSelectAdmin(item)}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {item.profilePicture ? (
                  <img
                    src={item.profilePicture}
                    alt={item.fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.createdAt ? formatDate(new Date(item.createdAt)).date : "N/A"}
                </p>
              </div>
            </div>

            <UserManagementStatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}