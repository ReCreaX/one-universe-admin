// components/tabs/ProfileTab.tsx
import React, { useState } from "react";
import { User, Camera } from "lucide-react";

export const ProfileTab = () => {
  const [fullName, setFullName] = useState("Oloruntomi Dosunmu");

  return (
    <div className="w-[878px] space-y-20">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <div className="relative w-[100px] h-[100px] mb-6">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#154751] to-[#04171F] flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-[#154751] flex items-center justify-center shadow-sm hover:shadow-md transition">
            <Camera size={18} className="text-[#154751]" />
          </button>
        </div>
        <h2 className="font-dm-sans font-bold text-xl leading-[140%] text-[#171417]">
          Tomi Dosunmu
        </h2>
        <p className="font-dm-sans text-xs leading-[140%] text-[#6B6969]">Content Admin</p>
      </div>

      {/* Form Fields */}
      <div className="flex gap-8">
        <div className="flex-1 max-w-[390px] space-y-6">
          <div>
            <label className="block font-dm-sans font-medium text-base text-[#05060D] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-[46px] px-4 rounded-xl border border-[#B2B2B4] focus:outline-none focus:border-[#154751] font-dm-sans text-base"
            />
          </div>
          <button
            disabled
            className="w-full h-12 rounded-[20px] bg-[#ACC5CF] text-white font-dm-sans font-medium cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>

        <div className="flex-1 max-w-[390px]">
          <label className="block font-dm-sans font-medium text-base text-[#05060D] mb-2">
            Email
          </label>
          <input
            type="email"
            value="tomi@gmail.com"
            disabled
            className="w-full h-[46px] px-4 rounded-xl bg-[#E8E8E8] font-dm-sans text-base cursor-not-allowed"
          />
        </div>
      </div>

      {/* Password Section */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <div className="max-w-[354px]">
          <h3 className="font-dm-sans font-bold text-xl text-[#171417] mb-2">Password</h3>
          <p className="font-dm-sans text-base text-[#454345]">
            Change your password to login to your account.
          </p>
        </div>
        <button
          className="px-6 h-12 rounded-[20px] text-white font-dm-sans font-medium"
          style={{
            background: "radial-gradient(circle at center, #154751 37%, #04171F 100%)",
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};