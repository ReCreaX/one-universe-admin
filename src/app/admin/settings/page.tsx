"use client";

import React, { useState } from "react";
import { User, Camera } from "lucide-react";
import { NotificationTab } from "./Tabs/NotificationTab";


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [fullName, setFullName] = useState("Oloruntomi Dosunmu");
  const [email] = useState("tomi@gmail.com");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block w-full max-w-[1200px] mx-auto px-10 py-6">
        <div className="bg-white rounded-[32px] p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-dm-sans font-bold text-2xl leading-[120%] text-[#171417] mb-2">
              Settings
            </h1>
            <p className="font-dm-sans text-base leading-[140%] text-[#6B6969]">
              Assign and manage what each admin can access, view, and control.
            </p>
          </div>

          <div className="flex gap-16">
            {/* Left Sidebar Navigation */}
            <div className="w-[128px] space-y-4 pt-2">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left font-dm-sans text-xl leading-[140%] ${
                  activeTab === "account"
                    ? "font-medium bg-gradient-to-br from-[#154751] to-[#04171F] bg-clip-text text-transparent"
                    : "font-normal text-[#B5B1B1]"
                }`}
              >
                My account
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className="w-full text-left font-dm-sans font-normal text-base leading-[140%] text-[#B5B1B1]"
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className="w-full text-left font-dm-sans font-normal text-base leading-[140%] text-[#B5B1B1]"
              >
                Subscription
              </button>
              <button
                onClick={() => setActiveTab("ads")}
                className="w-full text-left font-dm-sans font-normal text-base leading-[140%] text-[#B5B1B1]"
              >
                Sponsored Ads
              </button>
              <button
                onClick={() => setActiveTab("charges")}
                className="w-full text-left font-dm-sans font-normal text-base leading-[140%] text-[#B5B1B1]"
              >
                Platform Charges
              </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 max-w-[878px]">
              {activeTab === "account" && (
                <div className="space-y-20">
                  {/* Profile Section */}
                  <div className="space-y-16">
                    {/* Avatar and Name - Centered */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-[100px] h-[100px] mb-4">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                          <User size={48} className="text-white" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center border-2 border-[#154751] shadow-sm">
                          <Camera size={18} className="text-[#154751]" />
                        </button>
                      </div>
                      <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417] mb-1">
                        Tomi Dosunmu
                      </h2>
                      <p className="font-dm-sans text-xs leading-[140%] text-center text-[#6B6969]">
                        Content Admin
                      </p>
                    </div>

                    {/* Form Fields */}
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1 max-w-[390px]">
                        <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-[46px] px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-[#171417] focus:outline-none focus:border-[#154751] bg-white mb-6"
                        />
                        <button
                          disabled
                          className="px-6 py-3 h-[48px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-[#FFFEFE] bg-[#ACC5CF] cursor-not-allowed"
                        >
                          Save Changes
                        </button>
                      </div>

                      <div className="flex-1 max-w-[390px]">
                        <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full h-[46px] px-4 rounded-xl font-dm-sans text-base text-[#171417] bg-[#E8E8E8] cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                    <div className="max-w-[354px]">
                      <h3 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417] mb-2">
                        Password
                      </h3>
                      <p className="font-dm-sans text-base leading-[140%] text-[#454345]">
                        Change your password to login to your account.
                      </p>
                    </div>
                    <button className="px-6 py-4 h-[48px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                      }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {activeTab === "notifications" && <NotificationTab />}
              {activeTab !== "account" && activeTab !== "notifications" && (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <p className="font-dm-sans text-lg">Coming Soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden bg-white min-h-screen">
        {/* Header */}
        <div className="px-5 py-4 bg-white">
          <h1 className="font-dm-sans font-bold text-xl text-[#171417]">Settings</h1>
        </div>

        {/* Profile Card */}
        <div className="px-5 py-4 bg-white">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-[100px] h-[100px] mb-2">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center border-2 border-[#154751] shadow-sm">
                <Camera size={14} className="text-[#154751]" />
              </button>
            </div>
            <h2 className="font-dm-sans font-bold text-base leading-[140%] text-[#171417]">
              Tomi Dosunmu
            </h2>
            <p className="font-dm-sans text-xs leading-[140%] text-[#6B6969]">
              Content Admin
            </p>
          </div>
        </div>

        {/* Tabs - Mobile */}
        <div className="px-5 py-4 bg-white space-y-2">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base ${
              activeTab === "account"
                ? "bg-gradient-to-br from-[#154751] to-[#04171F] text-white"
                : "bg-gray-50 text-[#171417]"
            }`}
          >
            My Account
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className="w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base bg-gray-50 text-[#171417]"
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className="w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base bg-gray-50 text-[#171417]"
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className="w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base bg-gray-50 text-[#171417]"
          >
            Sponsored Ads
          </button>
          <button
            onClick={() => setActiveTab("charges")}
            className="w-full px-5 py-4 rounded-xl text-left font-dm-sans font-medium text-base bg-gray-50 text-[#171417]"
          >
            Platform Charges
          </button>
        </div>

        {/* Mobile Form Content */}
        {activeTab === "account" && (
          <div className="px-5 py-6 bg-white space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[46px] px-4 rounded-xl border border-[#B2B2B4] font-dm-sans text-base text-[#171417] focus:outline-none focus:border-[#154751] bg-white"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="font-dm-sans font-medium text-base leading-[140%] text-[#05060D] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-[46px] px-4 rounded-xl font-dm-sans text-base text-[#171417] bg-[#E8E8E8] cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            <button
              className="w-full py-3 h-[46px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
              }}
            >
              Save Changes
            </button>

            {/* Password Section - Mobile */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="font-dm-sans font-bold text-lg leading-[140%] text-[#171417] mb-2">
                Password
              </h3>
              <p className="font-dm-sans text-sm leading-[140%] text-[#454345] mb-4">
                Change your password to login to your account.
              </p>
              <button
                className="w-full py-3 h-[46px] rounded-[20px] font-dm-sans font-medium text-base leading-[140%] text-white flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)"
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {activeTab !== "account" && (
          <div className="px-5 py-12 text-center text-gray-400">
            <p className="font-dm-sans text-base">Coming Soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;