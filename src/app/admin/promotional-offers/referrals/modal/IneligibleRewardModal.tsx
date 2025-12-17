// MarkIneligibleModal.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { referralService } from '@/services/referralService';

interface MarkIneligibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralId: string;
  onConfirm: () => void;
}

const MarkIneligibleModal: React.FC<MarkIneligibleModalProps> = ({
  isOpen,
  onClose,
  referralId,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = reason.trim() !== '';

  const handleConfirm = async () => {
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Marking as ineligible...');
      await referralService.markAsIneligibleAdmin({
        referralId,
        reason: reason.trim(),
      });

      console.log('✅ Successfully marked as ineligible');
      onConfirm();
      setReason('');
      onClose();
    } catch (err: any) {
      console.error('❌ Failed to mark as ineligible:', err);
      setError(err.message || 'Failed to mark as ineligible');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[80]" onClick={handleCancel} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        style={{ contain: "none" }}
      >
        <div
          className="w-full max-w-[633px] bg-white rounded-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-hidden"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-8 pt-8 pb-4 border-b border-[#E8E3E3]">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-0 hover:opacity-70 transition"
                disabled={isLoading}
              >
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Mark Reward as Ineligible?
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 flex flex-col gap-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-[#FFE5E5] border border-[#FFB3B3] rounded-lg px-4 py-3">
                <p className="font-dm-sans text-base text-[#D84040]">{error}</p>
              </div>
            )}

            {/* Description */}
            <p className="font-dm-sans font-medium text-base leading-[140%] text-[#171417]">
              This action will disqualify the referral reward and notify internal records.
            </p>

            {/* Form Section */}
            <div className="space-y-2">
              <label className="block font-dm-sans font-medium text-base leading-[140%] text-[#05060D]">
                Reason for Ineligibility
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for ineligibility."
                disabled={isLoading}
                className="w-full h-[106px] rounded-xl border border-[#B2B2B4] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-dm-sans text-base leading-[140%] text-[#171417] placeholder:text-[#B2B2B4] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-8">
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 h-12 rounded-[20px] font-dm-sans font-medium text-base leading-[140%] border transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderImage: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%) 1',
                  color: '#154751',
                }}
              >
                Cancel
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!isValid || isLoading}
                className="flex-1 h-12 rounded-[20px] bg-[#D84040] text-white font-dm-sans font-medium text-base leading-[140%] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Confirm & Mark Ineligible'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkIneligibleModal;