'use client';

import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import { useToastStore } from '@/stores/toastStore';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (typeof window === 'undefined' || toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>,
    document.body
  );
}