/**
 * Server-Side Auth Session Helpers
 * 
 * For use in Server Components, Server Actions, and Route Handlers only.
 * Provides convenient helpers for accessing the current user session.
 * 
 * Usage:
 * ```tsx
 * import { getCurrentUser, isAuthenticated } from '@/lib/auth/session';
 * 
 * const user = await getCurrentUser();
 * const isAuth = await isAuthenticated();
 * ```
 */

import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Get the current authenticated user from the server context
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if the current request has an authenticated session
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get the user's role from the database
 * @returns The user's role or null if not authenticated
 */
export async function getUserRole() {
  const user = await getCurrentUser();
  // Role will be fetched from users table, not auth metadata
  return user ? 'user' : null;
}
