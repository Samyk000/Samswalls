/**
 * Base Modal Component
 * 
 * A reusable modal component with:
 * - Backdrop click to close
 * - ESC key to close
 * - Smooth animations
 * - Focus trap
 * - Portal rendering
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  size = 'md',
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the modal
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      // Restore focus
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-fade"
    >
      {/* Backdrop — glassmorphism, click to close */}
      <div
        className="absolute inset-0 glass-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Content — stop propagation so clicks inside don't close */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full bg-bg-primary rounded-2xl shadow-2xl',
          'modal-scale-enter',
          'focus:outline-none',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-border-primary">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );

  // Render in portal
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

/**
 * Full Screen Modal
 * For browse, categories, search modals
 */
interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  /** If true, back button always shows and calls onClose when no onBack is provided */
  alwaysShowBack?: boolean;
}

export function FullScreenModal({
  isOpen,
  onClose,
  children,
  title,
  showBackButton,
  onBack,
  alwaysShowBack = true,
}: FullScreenModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const shouldShowBack = alwaysShowBack || (showBackButton && onBack);

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-bg-primary modal-slide-enter">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border-primary">
        {/* Back/Close button at top-left */}
        {shouldShowBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            aria-label={onBack ? 'Go back' : 'Close'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h2 className="text-lg font-semibold text-text-primary flex-1">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div ref={modalRef} className="overflow-auto h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );

  // Render in portal
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
