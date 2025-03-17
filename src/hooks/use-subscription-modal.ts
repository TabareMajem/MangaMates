import { create } from 'zustand';

interface SubscriptionModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSubscriptionModal = create<SubscriptionModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false })
}));
