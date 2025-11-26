"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import getBaseUrl from "@/services/baseUrl";
import useToastStore from "@/store/useToastStore"; // ← FIXED: Full correct import
import { userManagementStore } from "@/store/userManagementStore";

import {
  SendWarningModal,
  ReactivateModal,
  DeactivateModal,
} from "./modals/UserActionModals";

interface UserAdminActionsProps {
  userId: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
  onSuccess?: () => void;
}

export default function UserAdminActions({
  userId,
  userName,
  userEmail,
  isActive,
  onSuccess,
}: UserAdminActionsProps) {
  const { data: session } = useSession();
  const baseUrl = getBaseUrl();
  const { showToast } = useToastStore(); // ← Now properly imported and used
  const { refetchUsers } = userManagementStore();

  const [showWarning, setShowWarning] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [loadingWarning, setLoadingWarning] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  // Send Warning
  const handleSendWarning = async () => {
    if (!warningMessage.trim()) return;

    setLoadingWarning(true);
    try {
      await axios.post(
        `${baseUrl}/admin/users/send-warning`,
        {
          email: userEmail,
          message: warningMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("success", "Warning Sent", `Warning sent to ${userName}`, 4000);
      setShowWarning(false);
      setWarningMessage("");
      onSuccess?.();
      refetchUsers?.();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send warning";
      showToast("error", "Failed to Send Warning", msg, 5000);
    } finally {
      setLoadingWarning(false);
    }
  };

  // Toggle Activation/Deactivation
  const handleToggleActivation = async () => {
    setLoadingToggle(true);
    try {
      const newStatus = isActive ? "DEACTIVATED" : "ACTIVE";

      const response = await axios.patch(
        `${baseUrl}/admin/users/${userId}/activate-deactivate`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const action = isActive ? "deactivated" : "reactivated";
      const message =
        response.data.message || `User has been ${action} successfully`;

      showToast(
        "success",
        isActive ? "User Deactivated" : "User Reactivated",
        message,
        4000
      );

      setShowDeactivate(false);
      setShowReactivate(false);
      onSuccess?.();
      refetchUsers?.();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to ${isActive ? "deactivate" : "reactivate"} user`;
      showToast("error", "Action Failed", msg, 5000);
    } finally {
      setLoadingToggle(false);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end px-5 md:pr-8">
        {isActive ? (
          <button
            onClick={() => setShowDeactivate(true)}
            className="bg-[#D84040] px-6 py-1.5 rounded-[36px] text-white text-sm font-medium transition hover:bg-red-700"
          >
            Deactivate User
          </button>
        ) : (
          <button
            onClick={() => setShowReactivate(true)}
            className="bg-green-600 px-6 py-1.5 rounded-[36px] text-white text-sm font-medium transition hover:bg-green-700"
          >
            Reactivate User
          </button>
        )}

        <button
          onClick={() => setShowWarning(true)}
          className="border border-[#D84040] px-6 py-1.5 rounded-[36px] text-[#D84040] text-sm font-medium hover:bg-red-50 transition"
        >
          Send Warning
        </button>

        <button
          onClick={onSuccess}
          className="border border-[#04171F] px-6 py-1.5 rounded-[36px] text-[#04171F] text-sm font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      {/* Modals */}
      <SendWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        warningMessage={warningMessage}
        setWarningMessage={setWarningMessage}
        onSend={handleSendWarning}
        loading={loadingWarning}
      />

      <DeactivateModal
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        onConfirm={handleToggleActivation}
        loading={loadingToggle}
        userName={userName}
      />

      <ReactivateModal
        isOpen={showReactivate}
        onClose={() => setShowReactivate(false)}
        onConfirm={handleToggleActivation}
        loading={loadingToggle}
        userName={userName}
      />
    </>
  );
}