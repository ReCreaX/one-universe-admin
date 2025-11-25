/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { X } from "lucide-react";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { formatDate } from "@/utils/formatTime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const SellersTable = () => {
  const { openModal } = userManagementStore();
  const { data: session } = useSession();

  const handleSelectUser = (user: UserType) => {
    openModal("openSeller", user);
  };

  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/admin/sellers",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        setUser(response.data.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401) {
          setError(
            "Authentication failed. Please login again or refresh your token."
          );
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session?.accessToken]);

  if (!session?.accessToken) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-gray-500">Authenticating... Please wait.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
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
            {user.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t border-gray-100 hover:bg-gray-50 transition h-[60px] cursor-pointer"
                )}
                onClick={() => handleSelectUser(item)}
              >
                <td className="py-3 px-4 gap-3">
                  <div className="flex items-center gap-2 relative group">
                    {/* Avatar */}
                    <div className="relative size-6 rounded-full overflow-hidden bg-gray-200">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>

                    {/* Full Name */}
                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {item.fullName}
                    </p>

                    {/* Small Badge (Always Visible) */}
                    {item.isVerified ? (
                      <div className="bg-[#1FC16B] size-[17px] rounded-full flex items-center justify-center">
                        <FaCheck className="text-white" size={12} />
                      </div>
                    ) : (
                      <div className="bg-[#D00416] size-[17px] rounded-full flex items-center justify-center">
                        <X className="text-white" size={12} />
                      </div>
                    )}

                    {/* Hover Tooltip */}
                    <div className="absolute left-0 top-8 z-50 hidden group-hover:flex items-center gap-2 bg-white border border-gray-200 shadow-md rounded-[8px] p-[8px] w-[258px] h-[50px]">
                      {item.isVerified ? (
                        <div className="bg-[#1FC16B] w-[20px] h-[20px] rounded-full flex items-center justify-center">
                          <FaCheck className="text-white" size={12} />
                        </div>
                      ) : (
                        <div className="bg-[#D00416] w-[20px] h-[20px] rounded-full flex items-center justify-center">
                          <X className="text-white" size={12} />
                        </div>
                      )}

                      <p className="text-[13px] text-gray-800 leading-tight">
                        {item.isVerified
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
                  {item.createdAt
                    ? formatDate(new Date(item.createdAt)).date
                    : "N/A"}
                </td>
                <td className="py-3 px-4">
                  {item.createdAt
                    ? formatDate(new Date(item.createdAt)).time
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {user.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm cursor-pointer"
            onClick={() => handleSelectUser(item)}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt={item.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserCircle className="text-gray-400" size={40} />
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.createdAt
                    ? formatDate(new Date(item.createdAt)).date
                    : "N/A"}
                </p>
              </div>
            </div>

            <UserManagementStatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersTable;
