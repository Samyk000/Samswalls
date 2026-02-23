'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-accent-primary text-white hover:bg-accent-hover active:bg-accent-muted disabled:bg-accent-muted/50',
  secondary: 'bg-bg-tertiary text-text-primary border border-border-primary hover:bg-bg-hover active:bg-bg-tertiary disabled:bg-bg-tertiary/50',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover active:bg-bg-tertiary disabled:text-text-tertiary',
  danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:bg-error/50',
  icon: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover active:bg-bg-tertiary disabled:text-text-tertiary p-2',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Variant styles
          variantStyles[variant],
          // Size styles (icon variant has its own padding)
          variant !== 'icon' && sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';