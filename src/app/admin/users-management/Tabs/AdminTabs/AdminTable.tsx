"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaUserCircle } from "react-icons/fa";
import UserManagementStatusBadge from "../../UserManagementStatusBadge";
import { userManagementStore, UserType } from "@/store/userManagementStore";
import { formatDate } from "@/utils/formatTime";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import getBaseUrl from "@/services/baseUrl";

const BASE_URL = getBaseUrl();

export default function BuyersTable() {
  const { openModal } = userManagementStore();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelectUser = (user: UserType) => {
    openModal("openBuyer", user);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setError("Please log in again.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);

        // ALWAYS use NextAuth token first (it contains refreshed tokens)
        const token = session?.accessToken 
          || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        if (!token) {
          setError("No valid authentication found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/admin/others`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.data);
      } catch (err: any) {
        console.error("User fetch error:", err);

        if (err.response?.status === 401) {
          setError("Session expired. Please sign in again.");
        } else {
          setError("Failed to fetch users.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, status]);

  if (loading || status === "loading") {
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
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden bg-gray-200">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-gray-400" size={30} />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 hover:underline cursor-pointer">
                      {item.fullName}
                    </p>
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