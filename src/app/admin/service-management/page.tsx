"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  X,
  Clock,
  ChevronDown,
  ListFilter,
  MoveUp,
  Search,
} from "lucide-react";
import EmptyApprovedService from "../components/empty-service/EmptyApprovedService";
import EmptyRejectedService from "../components/empty-service/EmptyRejectedService";
import EmptyPendingService from "../components/empty-service/EmptyPendingService";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface Service {
  title: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  sellerProfiles: { name?: string }[];
}

const ServiceManagementPage = () => {
  const [activeTab, setActiveTab] = useState<ServiceStatus>("Pending");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const res = await fetch(
          "https://one-universe-de5673cf0d65.herokuapp.com/api/v1/master-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    fetchServices();
  }, []);

  // Detect click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAllServices = () => {
    const filtered = filteredServices;
    if (selectedServices.length === filtered.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filtered.map((_, idx) => String(idx)));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getServiceCount = (status: ServiceStatus) => {
    const statusMap = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };
    return services.filter((s) => s.status === statusMap[status]).length;
  };

  const filteredServices = services.filter((s) => {
    const statusMap = {
      Pending: "PENDING",
      Approved: "APPROVED",
      Rejected: "REJECTED",
    };
    return s.status === statusMap[activeTab];
  });

  const stats = [
    {
      label: "Pending Requests",
      color: "bg-gradient-to-br from-purple-500 to-blue-600",
      total: getServiceCount("Pending"),
      growth: 12,
      growthType: "positive",
    },
    {
      label: "Approved Today",
      color: "bg-[#67A344]",
      total: getServiceCount("Approved"),
      growth: 8,
      growthType: "positive",
    },
    {
      label: "Total Services",
      color: "bg-[#3621EE]",
      total: services.length,
      growth: 5,
      growthType: "positive",
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, color, total, growth, growthType }) => {
          const isPositive = growthType === "positive";
          return (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`${color} w-5 h-5 p-1 rounded flex items-center justify-center`}
                  >
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <h3 className="text-gray-900 font-medium text-base">
                    {label}
                  </h3>
                </div>
                <h3 className="font-bold text-gray-900 text-xl">
                  {total.toLocaleString()}
                </h3>
              </div>
              <div className="w-full h-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div
                  className={`p-0.5 rounded ${
                    isPositive ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <MoveUp
                    size={10}
                    className={`${
                      isPositive ? "text-green-600" : "text-red-600 rotate-180"
                    }`}
                  />
                </div>
                <p className="text-gray-900 text-xs font-normal">
                  <span
                    className={isPositive ? "text-green-600" : "text-red-600"}
                  >
                    {isPositive ? "+" : "-"}
                    {growth}%
                  </span>{" "}
                  from last month
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Service Requests Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-4 md:p-6">
          <h3 className="text-gray-900 font-medium text-xl mb-6">
            Service Requests
          </h3>

          {/* Tabs */}
          <div className="flex items-center gap-0 mb-6 overflow-x-auto">
            {(["Pending", "Approved", "Rejected"] as ServiceStatus[]).map(
              (tab) => {
                const count = getServiceCount(tab);
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab} Requests ({count})
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1 relative max-w-xl">
              <input
                type="text"
                placeholder="Search by name, email, service, or phone..."
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:border-gray-400 text-gray-700 placeholder:text-gray-500 text-sm"
              />
              <Search
                size={16}
                className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="border border-gray-300 flex items-center justify-center h-12 px-4 rounded-lg gap-2 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <ListFilter size={16} className="text-gray-700" />
              <span className="text-gray-900 text-sm font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div
            ref={filterRef}
            className="border-b border-gray-200 p-4 bg-gray-50"
          >
            <p className="text-sm text-gray-600">
              Filter options would go here...
            </p>
          </div>
        )}

        {/* Table / Mobile List */}
        {filteredServices.length === 0 ? (
          <>
            {activeTab === "Pending" && <EmptyPendingService />}
            {activeTab === "Approved" && <EmptyApprovedService />}
            {activeTab === "Rejected" && <EmptyRejectedService />}
          </>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedServices.length === filteredServices.length &&
                          filteredServices.length > 0
                        }
                        onChange={toggleAllServices}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Seller Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Submitted Service
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Submitted
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, idx) => {
                    const sellerName =
                      service.sellerProfiles.length > 0
                        ? service.sellerProfiles[0].name || "Admin"
                        : "Admin";

                    return (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(String(idx))}
                            onChange={() => toggleService(String(idx))}
                            className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full ${getAvatarColor(
                                sellerName
                              )} flex items-center justify-center text-white text-sm font-medium`}
                            >
                              {getInitials(sellerName)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {sellerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {service.title}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <Clock size={14} className="text-gray-600" />
                            <span className="text-sm text-gray-700">
                              {service.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">
                              <Check size={16} />
                              Approve
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                              <X size={16} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden p-4 space-y-3">
              {filteredServices.map((service, idx) => {
                const sellerName =
                  service.sellerProfiles.length > 0
                    ? service.sellerProfiles[0].name || "Unknown Seller"
                    : "Unknown Seller";

                return (
                  <div key={idx}>
                    <div
                      className={`border rounded-lg transition-all ${
                        expandedService === String(idx)
                          ? "border-gray-300 shadow-sm"
                          : "border-gray-200"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 p-4 cursor-pointer"
                        onClick={() => toggleExpand(String(idx))}
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(
                            sellerName
                          )} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
                        >
                          {getInitials(sellerName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {sellerName}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {service.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                            <Clock size={12} className="text-gray-600" />
                            <span className="text-xs text-gray-700">
                              {service.status}
                            </span>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform ${
                              expandedService === String(idx)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>

                      {expandedService === String(idx) && (
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">
                            <Check size={16} />
                            Approve
                          </button>
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceManagementPage;
