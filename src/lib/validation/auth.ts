/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for validating authentication form inputs.
 * Used in login and register pages for client-side validation.
 * 
 * Usage:
 * ```tsx
 * import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validation/auth';
 * 
 * // Validate form data
 * const result = loginSchema.safeParse({ email, password });
 * if (!result.success) {
 *   console.log(result.error.issues); // Validation errors
 * }
 * ```
 */

import { z } from 'zod';

/**
 * Login form validation schema
 * - Email: valid email format required
 * - Password: minimum 8 characters
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Registration form validation schema
 * - Email: valid email format required
 * - Password: minimum 8 characters, must contain uppercase letter and number
 * - Confirm Password: must match password
 * - Display Name: optional, minimum 2 characters if provided
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
  display_name: z.string().min(2, 'Display name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

/** Type for login form input */
export type LoginInput = z.infer<typeof loginSchema>;

/** Type for registration form input */
export type RegisterInput = z.infer<typeof registerSchema>;
