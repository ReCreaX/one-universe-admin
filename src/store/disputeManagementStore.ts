import { create } from "zustand";

type ModalType = "openDispute" | null;

export type DisputeStatusType = "New" | "Under review" | "Resolved" | "Open";

export interface disputeType {
  id: string;
  service: string;
  jobStatus: "In Progress" | "Completed" | "Pending";
  buyer: string;
  seller: string;
  date: string; // could also use Date if your API returns actual date objects
  time: string;
  status: DisputeStatusType;
}


interface ModalState {
  modalType: ModalType;
  selectedDispute: disputeType | null;
  openModal: (type: ModalType, support?: disputeType) => void;
  closeModal: () => void;
}

export const disputeModalStore = create<ModalState>((set) => ({
  modalType: null,
  selectedDispute: null,

  openModal: (type, ticket) =>
    set({ modalType: type, selectedDispute: ticket || null }),

  closeModal: () => set({ modalType: null, selectedDispute: null }),
}));
