/**
 * Modal Store
 * 
 * Zustand store for managing modal state across the app.
 * Supports modal stack for nested modals and back navigation.
 */

import { create } from 'zustand';

export type ModalType = 'browse' | 'categories' | 'wallpaper' | 'search' | 'auth' | null;

interface ModalData {
  wallpaperId?: string;
  categorySlug?: string;
  authMode?: 'login' | 'register';
  [key: string]: unknown;
}

interface ModalState {
  currentModal: ModalType;
  modalData: ModalData;
  history: Array<{ type: ModalType; data: ModalData }>;
  
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  goBack: () => void;
  clearHistory: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  currentModal: null,
  modalData: {},
  history: [],

  openModal: (modal, data = {}) => {
    const { currentModal, modalData, history } = get();
    
    // If there's a current modal, add it to history
    if (currentModal) {
      set({
        history: [...history, { type: currentModal, data: modalData }],
        currentModal: modal,
        modalData: data,
      });
    } else {
      set({
        currentModal: modal,
        modalData: data,
      });
    }
  },

  closeModal: () => {
    set({
      currentModal: null,
      modalData: {},
    });
  },

  goBack: () => {
    const { history } = get();
    
    if (history.length > 0) {
      const previous = history[history.length - 1];
      set({
        currentModal: previous.type,
        modalData: previous.data,
        history: history.slice(0, -1),
      });
    } else {
      set({
        currentModal: null,
        modalData: {},
      });
    }
  },

  clearHistory: () => {
    set({ history: [] });
  },
}));
