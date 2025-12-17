// types/Referral.ts

export type ReferralStatus = "Paid" | "Pending" | "Processing" | "Ineligible";
export type TransactionStatus = "Pending" | "Completed";

export interface Referral {
  id: string;
  referralId: string;
  referrerName: string;
  referredName: string;
  firstTransaction: TransactionStatus;
  signDate: string;
  status: ReferralStatus;
  rewardEarned: boolean;
  rewardAmount?: number;
}