/**
 * Auth Modal
 *
 * Glassmorphism modal for login/register:
 * - Tab switching between login and register
 * - Form validation with Zod
 * - Closes when clicking outside
 * - Glass morphism styling
 */

'use client';

import { useState, useCallback } from 'react';
import { Modal } from './Modal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/stores/toastStore';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, registerSchema } from '@/lib/validation/auth';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { z } from 'zod';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const { user } = useAuth();

  // Handle login
  const handleLogin = useCallback(async () => {
    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setLoading(true);
    setErrors({});

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({ form: error.message });
      toast.error('Login failed. Please check your credentials.');
    } else {
      toast.success('Welcome back!');
      onClose();
    }

    setLoading(false);
  }, [email, password, onClose]);

  // Handle register
  const handleRegister = useCallback(async () => {
    try {
      registerSchema.parse({ email, password, confirm_password: confirmPassword, display_name: displayName });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setLoading(true);
    setErrors({});

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || null,
        },
      },
    });

    if (error) {
      setErrors({ form: error.message });
      toast.error('Registration failed. Please try again.');
    } else {
      toast.success('Account created! Please check your email to verify.');
      onClose();
    }

    setLoading(false);
  }, [email, password, confirmPassword, displayName, onClose]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  // If user is already logged in, don't show modal
  if (user) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
      size="sm"
      closeOnBackdrop={true}
      className="glass-modal"
    >
      <div className="p-6">
        {/* Tabs */}
        <div className="flex mb-6 bg-[#12121a] rounded-lg p-1">
          <button
            onClick={() => setMode('login')}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-md transition-colors',
              mode === 'login'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-md transition-colors',
              mode === 'register'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-white placeholder:text-[#6b6b7b] focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                />
              </div>
              {errors.display_name && (
                <p className="text-xs text-error mt-1">{errors.display_name}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-white placeholder:text-[#6b6b7b] focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-white placeholder:text-[#6b6b7b] focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (register only) — FIXED: was using JS if() inside JSX */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-white placeholder:text-[#6b6b7b] focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                />
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-error mt-1">{errors.confirm_password}</p>
              )}
            </div>
          )}

          {/* Form Error */}
          {errors.form && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors.form}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-accent"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Forgot Password (login only) */}
        {mode === 'login' && (
          <button className="w-full mt-4 text-sm text-accent-primary hover:underline">
            Forgot password?
          </button>
        )}
      </div>
    </Modal>
  );
}
