'use client'
import React, { useState } from "react";
import { Check, X, Clock, ChevronDown } from "lucide-react";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface ServiceType {
  id: string;
  title: string;
  sellerName: string;
  status: ServiceStatus;
  createdAt: string | Date;
}

interface ServiceTableProps {
  services: ServiceType[];
  activeTab: ServiceStatus;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, activeTab }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // --- SAFE DATE FORMATTER ---
  const formatDate = (value: string | Date) => {
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAllServices = () => {
    const filteredServices = services.filter((s) => s.status === activeTab);
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map((s) => s.id));
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

  const filteredServices = services.filter((s) => s.status === activeTab);

  if (filteredServices.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white mt-6">
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
            {filteredServices.map((service) => (
              <tr
                key={service.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${getAvatarColor(
                        service.sellerName
                      )} flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {getInitials(service.sellerName)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {service.sellerName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {service.title}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {formatDate(service.createdAt)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden px-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="mb-3">
            <div
              className={`border rounded-lg transition-all ${
                expandedService === service.id
                  ? "border-gray-300 shadow-sm"
                  : "border-gray-200"
              }`}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => toggleExpand(service.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(
                    service.sellerName
                  )} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
                >
                  {getInitials(service.sellerName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {service.sellerName}
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
                      expandedService === service.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedService === service.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                  <div className="pt-3">
                    <p className="text-xs text-gray-600 mb-1">
                      Date submitted:
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(service.createdAt)}
                    </p>
                  </div>
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
        ))}
      </div>
    </div>
  );
};

export default ServiceTable;
