'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full px-4 py-2.5 rounded-lg text-text-primary bg-bg-secondary',
            'border border-border-primary transition-all duration-200',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
            // Placeholder
            'placeholder:text-text-tertiary',
            // Disabled
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-tertiary',
            // Error state
            error && 'border-error focus:ring-error',
            // Resize
            'resize-y min-h-[100px]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
