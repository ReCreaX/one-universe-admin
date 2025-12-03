// app/admin/settings/page.tsx
"use client";

import React, { useState } from "react";
import {
  User,
  Camera,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Import all dashboards
import SubscriptionDashboard from "./SubscriptionDashboard";
import SponsorAdsDashboard from "./SponsorAdsDashboard";
import PlatformChargesDashboard from "./PlatformChargesDashboard";

// ToggleSwitch
const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({
  enabled,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="relative w-[42px] h-[24px] rounded-full transition-colors"
    style={{
      background: enabled
        ? "linear-gradient(to right, #154751, #04171F)"
        : "#E3E5E5",
    }}
  >
    <div
      className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300"
      style={{ transform: enabled ? "translateX(20px)" : "translateX(2px)" }}
    />
  </button>
);

// NotificationRow
const NotificationRow: React.FC<{ label: string }> = ({ label }) => {
  const [email, setEmail] = useState(false);
  const [inApp, setInApp] = useState(false);

  return (
    <div className="flex items-center justify-between py-4 md:py-0 md:h-[58px]">
      <span className="font-dm-sans text-sm md:text-base leading-[140%] text-[#6B6969] flex-1 md:w-[200px]">
        {label}
      </span>
      <div className="flex gap-8 md:gap-[150px]">
        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={email} onToggle={() => setEmail(!email)} />
        </div>
        <div className="w-[56px] flex justify-center">
          <ToggleSwitch enabled={inApp} onToggle={() => setInApp(!inApp)} />
        </div>
      </div>
    </div>
  );
};

// NotificationTab
const NotificationTab = () => {
  const alertTypes = [
    "Dispute Escalations",
    "Payment Disbursement",
    "Panic Alert",
    "New User Registrations",
    "Pending Verification",
    "Credit Requests",
    "Platform Downtime",
  ];

  return (
    <div className="w-full space-y-6 px-5 md:px-0">
      <div>
        <h2 className="font-dm-sans font-medium text-lg md:text-[20px] text-[#171417] mb-2">
          Notification Preferences
        </h2>
        <p className="font-dm-sans text-sm md:text-base text-[#6B6969]">
          Stay informed without the noise. Choose which alerts matter to you.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between h-[28px] border-b border-[#E3E5E5]">
          <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417]">
            Alert Type
          </span>
          <div className="flex gap-8 md:gap-24">
            <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417] w-14 text-center">Email</span>
            <span className="font-dm-sans font-bold text-sm md:text-base text-[#171417] w-14 text-center">In-app</span>
          </div>
        </div>
        {alertTypes.map((type) => (
          <NotificationRow key={type} label={type} />
        ))}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState("Oloruntomi Dosunmu");
  const [email] = useState("tomi@gmail.com");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* DESKTOP */}
      <div className="hidden md:block w-full max-w-[1200px] mx-auto px-6 py-8">
        <div className="bg-white rounded-[32px] p-10">
          <div className="mb-8">
            <h1 className="font-dm-sans font-bold text-2xl text-[#171417] mb-2">Settings</h1>
            <p className="font-dm-sans text-base text-[#6B6969]">
              Assign and manage what each admin can access, view, and control.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="w-[140px] space-y-5">
              {["account", "notifications", "subscription", "ads", "charges"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left font-dm-sans text-base capitalize transition-colors ${
                    activeTab === tab
                      ? "font-medium bg-gradient-to-br from-[#154751] to-[#04171F] bg-clip-text text-transparent"
                      : "text-[#B5B1B1]"
                  }`}
                >
                  {tab === "account" ? "My account" :
                   tab === "ads" ? "Sponsor ads" :
                   tab === "charges" ? "Platform charges" :
                   tab}
                </button>
              ))}
            </div>

            <div className="flex-1">
              {activeTab === "account" && (
                <div className="max-w-2xl mx-auto space-y-12 text-center">
                  <div>
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                        <User size={48} className="text-white" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center shadow-md">
                        <Camera size={18} className="text-[#154751]" />
                      </button>
                    </div>
                    <h2 className="mt-4 font-dm-sans font-bold text-2xl">Tomi Dosunmu</h2>
                    <p className="text-[#6B6969]">Content Admin</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-dm-sans font-medium mb-2 text-left">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-dm-sans font-medium mb-2 text-left">Email</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && <NotificationTab />}
              {activeTab === "subscription" && <SubscriptionDashboard />}
              {activeTab === "ads" && <SponsorAdsDashboard />}
              {activeTab === "charges" && <PlatformChargesDashboard />}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-5 py-4">
          <h1 className="font-dm-sans font-bold text-xl text-[#171417]">Settings</h1>
        </div>

        <div className="px-5 py-4 space-y-3 bg-white">
          {["account", "notifications", "subscription", "ads", "charges"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base capitalize transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#154751] to-[#04171F] text-white shadow-lg"
                  : "bg-gray-100 text-[#171417]"
              }`}
            >
              {tab === "account" ? "My Account" :
               tab === "ads" ? "Sponsor ads" :
               tab === "charges" ? "Platform charges" :
               tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 min-h-screen">
          {activeTab === "account" && (
            <div className="bg-white px-5 py-8 space-y-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center">
                    <Camera size={18} className="text-[#154751]" />
                  </button>
                </div>
                <h2 className="mt-4 font-dm-sans font-bold text-xl">Tomi Dosunmu</h2>
                <p className="text-[#6B6969] text-sm">Content Admin</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-dm-sans font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#B2B2B4] focus:border-[#154751] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full h-12 px-4 rounded-xl bg-[#E8E8E8] cursor-not-allowed"
                  />
                </div>
                <button className="w-full h-12 rounded-[20px] text-white font-dm-sans font-medium"
                  style={{ background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)" }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && <NotificationTab />}
          {activeTab === "subscription" && <SubscriptionDashboard />}
          {activeTab === "ads" && <SponsorAdsDashboard />}
          {activeTab === "charges" && <PlatformChargesDashboard />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;