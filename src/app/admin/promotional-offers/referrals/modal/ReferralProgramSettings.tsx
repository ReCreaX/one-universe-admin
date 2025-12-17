// ReferralProgramSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { referralManagementStore } from '@/store/referralManagementStore';

interface ReferralProgramSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings?: (settings: any) => void;
  onUpdateRules?: (rules: any) => void;
}

const ReferralProgramSettings: React.FC<ReferralProgramSettingsProps> = ({
  isOpen,
  onClose,
  onSaveSettings,
  onUpdateRules,
}) => {
  // State for form fields
  const [isProgramActive, setIsProgramActive] = useState(false);
  const [platformFeePercentage, setPlatformFeePercentage] = useState('');
  const [maxReferralsPerMonth, setMaxReferralsPerMonth] = useState('');
  const [minTransactionAmount, setMinTransactionAmount] = useState('');
  const [eligibilityPeriod, setEligibilityPeriod] = useState('');

  // Loading states for each section
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingRewards, setIsSavingRewards] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);

  // Success/Error states
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rewardsMessage, setRewardsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rulesMessage, setRulesMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get updateSettings from store
  const { updateSettings, settings } = referralManagementStore();

  // Load existing settings when modal opens
  useEffect(() => {
    if (isOpen && settings) {
      setIsProgramActive(settings.active || false);
      setPlatformFeePercentage(settings.platformFeePercentage?.toString() || '');
      // Note: Backend doesn't return maxReferralsPerUserPerMonth in settings response
      // So we leave it empty - user needs to set it
      setMaxReferralsPerMonth('');
      setMinTransactionAmount(settings.maxTransactionAmount?.toString() || '');
      setEligibilityPeriod(settings.rewardEligibilityDays?.toString() || '');
    }
  }, [isOpen, settings]);

  // Validation
  const isRewardConfigValid = platformFeePercentage !== '' && maxReferralsPerMonth !== '';
  const isRulesConfigValid = minTransactionAmount !== '' && eligibilityPeriod !== '';

  // Show message for 3 seconds
  const showMessage = (
    setter: (msg: { type: 'success' | 'error'; text: string } | null) => void,
    type: 'success' | 'error',
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter(null), 3000);
  };

  // Save Program Status
  const handleSaveProgramStatus = async () => {
    setIsSavingStatus(true);

    try {
      const payload = { active: isProgramActive };
      console.log('Saving program status:', payload);
      await updateSettings(payload);
      showMessage(setStatusMessage, 'success', '✅ Program status updated');
      if (onSaveSettings) onSaveSettings(payload);
    } catch (err: any) {
      console.error('Failed to save program status:', err);
      showMessage(setStatusMessage, 'error', err.message || 'Failed to save');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Save Reward Configuration
  const handleSaveRewardConfig = async () => {
    if (!isRewardConfigValid) return;
    setIsSavingRewards(true);

    try {
      const payload = {
        platformFeePercentage: parseInt(platformFeePercentage, 10),
        maxReferralsPerUserPerMonth: parseInt(maxReferralsPerMonth, 10),
      };
      console.log('Saving reward config:', payload);
      await updateSettings(payload);
      showMessage(setRewardsMessage, 'success', '✅ Reward settings saved');
      if (onSaveSettings) onSaveSettings(payload);
    } catch (err: any) {
      console.error('Failed to save reward config:', err);
      showMessage(setRewardsMessage, 'error', err.message || 'Failed to save');
    } finally {
      setIsSavingRewards(false);
    }
  };

  // Save Rules & Requirements
  const handleSaveRules = async () => {
    if (!isRulesConfigValid) return;
    setIsSavingRules(true);

    try {
      const payload = {
        maxTransactionAmount: parseInt(minTransactionAmount, 10),
        rewardEligibilityDays: parseInt(eligibilityPeriod, 10),
      };
      console.log('Saving rules:', payload);
      await updateSettings(payload);
      showMessage(setRulesMessage, 'success', '✅ Rules updated');
      if (onUpdateRules) onUpdateRules(payload);
    } catch (err: any) {
      console.error('Failed to save rules:', err);
      showMessage(setRulesMessage, 'error', err.message || 'Failed to save');
    } finally {
      setIsSavingRules(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Settings Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center pt-4 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[671px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden mb-4"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3]">
            <div className="flex items-center justify-between">
              <h2 className="font-dm-sans font-bold text-[26px] leading-[120%] text-[#171417]">
                Referral Program Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-6 h-6 text-[#171417]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 flex flex-col gap-8">
            {/* Program Status Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              {/* Alert */}
              {statusMessage && (
                <div className={`rounded-lg px-4 py-3 mb-2 ${
                  statusMessage.type === 'success' 
                    ? 'bg-[#E0F5E6] border border-[#1FC16B]' 
                    : 'bg-[#FFE5E5] border border-[#FFB3B3]'
                }`}>
                  <p className={`font-dm-sans text-base ${
                    statusMessage.type === 'success' ? 'text-[#1FC16B]' : 'text-[#D84040]'
                  }`}>
                    {statusMessage.text}
                  </p>
                </div>
              )}

              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Program Status
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsProgramActive(!isProgramActive)}
                  className={`w-[42px] h-6 rounded-full transition-colors ${
                    isProgramActive ? 'bg-teal-600' : 'bg-[#E3E5E5]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isProgramActive ? 'translate-x-[22px]' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <p className="font-dm-sans font-medium text-base text-[#171417]">
                    Referral Program Active
                  </p>
                  <p className="font-dm-sans font-normal text-sm text-[#454345]">
                    Toggle to enable or disable the entire referral program
                  </p>
                </div>
              </div>

              {/* Save Status Button */}
              <button
                onClick={handleSaveProgramStatus}
                disabled={isSavingStatus}
                className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                style={{
                  background: !isSavingStatus
                    ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                    : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
                }}
              >
                {isSavingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Status'
                )}
              </button>
            </div>

            {/* Reward Configuration Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              {/* Alert */}
              {rewardsMessage && (
                <div className={`rounded-lg px-4 py-3 mb-2 ${
                  rewardsMessage.type === 'success' 
                    ? 'bg-[#E0F5E6] border border-[#1FC16B]' 
                    : 'bg-[#FFE5E5] border border-[#FFB3B3]'
                }`}>
                  <p className={`font-dm-sans text-base ${
                    rewardsMessage.type === 'success' ? 'text-[#1FC16B]' : 'text-[#D84040]'
                  }`}>
                    {rewardsMessage.text}
                  </p>
                </div>
              )}

              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Reward Configuration
              </h3>
              <div className="border-t border-[#E8E3E3]" />
              
              <div className="flex flex-col gap-4 mt-2">
                {/* Platform Fee Percentage */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Platform Fee Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={platformFeePercentage}
                    onChange={(e) => setPlatformFeePercentage(e.target.value)}
                    placeholder="Enter percentage"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Percentage of transaction value given as referral reward
                  </p>
                </div>

                {/* Maximum Referrals per User per Month */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Maximum Referrals per User per Month
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxReferralsPerMonth}
                    onChange={(e) => setMaxReferralsPerMonth(e.target.value)}
                    placeholder="Enter number"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Limit on referral rewards a user can earn monthly
                  </p>
                </div>

                {/* Save Rewards Button */}
                <button
                  onClick={handleSaveRewardConfig}
                  disabled={!isRewardConfigValid || isSavingRewards}
                  className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: isRewardConfigValid && !isSavingRewards
                      ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                      : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
                  }}
                >
                  {isSavingRewards ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Reward Settings'
                  )}
                </button>
              </div>
            </div>

            {/* Referral Rules & Requirements Section */}
            <div className="bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] p-4 flex flex-col gap-3">
              {/* Alert */}
              {rulesMessage && (
                <div className={`rounded-lg px-4 py-3 mb-2 ${
                  rulesMessage.type === 'success' 
                    ? 'bg-[#E0F5E6] border border-[#1FC16B]' 
                    : 'bg-[#FFE5E5] border border-[#FFB3B3]'
                }`}>
                  <p className={`font-dm-sans text-base ${
                    rulesMessage.type === 'success' ? 'text-[#1FC16B]' : 'text-[#D84040]'
                  }`}>
                    {rulesMessage.text}
                  </p>
                </div>
              )}

              <h3 className="font-dm-sans font-bold text-base text-[#171417]">
                Referral Rules & Requirements
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Minimum Transaction Amount for Reward */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Minimum Transaction Amount for Reward (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minTransactionAmount}
                    onChange={(e) => setMinTransactionAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Minimum amount of referred user's first transaction to qualify for reward
                  </p>
                </div>

                {/* Reward Eligibility Period */}
                <div className="flex flex-col gap-1">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Reward Eligibility Period (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={eligibilityPeriod}
                    onChange={(e) => setEligibilityPeriod(e.target.value)}
                    placeholder="Enter days number"
                    className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="font-dm-sans font-normal text-xs text-[#454345]">
                    Number of days referred user has to complete first transaction
                  </p>
                </div>

                {/* Save Rules Button */}
                <button
                  onClick={handleSaveRules}
                  disabled={!isRulesConfigValid || isSavingRules}
                  className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: isRulesConfigValid && !isSavingRules
                      ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                      : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
                  }}
                >
                  {isSavingRules ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Rules'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgramSettings;