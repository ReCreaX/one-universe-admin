// MarkAsPaidModal.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { referralService } from '@/services/referralService';

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralId: string;
  onConfirm: () => void;
}

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  isOpen,
  onClose,
  referralId,
  onConfirm,
}) => {
  const [overrideAmount, setOverrideAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = overrideAmount !== '';

  const handleConfirm = async () => {
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        referralId,
        overrideAmount: parseFloat(overrideAmount),
        note: note || undefined,
      };
      
      console.log('📤 Sending mark as paid request...');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Referral ID:', referralId);
      console.log('Override Amount:', overrideAmount);
      
      await referralService.markAsPaidAdmin(payload);

      console.log('✅ Successfully marked as paid');
      onConfirm();
      setOverrideAmount('');
      setNote('');
      onClose();
    } catch (err: any) {
      console.error('❌ Failed to mark as paid:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || 'Failed to mark as paid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOverrideAmount('');
    setNote('');
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
              >
                <ArrowLeft className="w-6 h-6 text-[#171417]" />
              </button>
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Mark Reward as Paid?
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
            <div className="space-y-4">
              <p className="font-dm-sans font-medium text-base leading-[140%] text-[#171417]">
                You're about to mark this referral reward as manually paid outside the system.
              </p>
              <p className="font-dm-sans font-normal text-base leading-[140%] text-[#454345]">
                This action is irreversible and will be logged for audit purposes.
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              {/* Override Amount */}
              <div className="space-y-2">
                <label className="block font-dm-sans font-medium text-base leading-[140%] text-[#05060D]">
                  Override Amount (₦)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={overrideAmount}
                  onChange={(e) => setOverrideAmount(e.target.value)}
                  placeholder="Enter amount to credit"
                  className="w-full h-11 rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="font-dm-sans font-normal text-xs text-[#454345]">
                  The amount that will be credited to the user's wallet
                </p>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="block font-dm-sans font-medium text-base leading-[140%] text-[#05060D]">
                  Notes (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any additional notes about this payment"
                  className="w-full h-[80px] rounded-xl border border-[#B2B2B4] px-4 py-3 resize-none font-dm-sans text-base text-[#171417] placeholder:text-[#B7B6B7] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
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
                className="flex-1 h-12 rounded-[20px] text-white font-dm-sans font-medium text-base leading-[140%] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)' }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Confirm & Mark as Paid'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAsPaidModal;