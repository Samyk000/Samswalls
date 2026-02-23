/**
 * Supabase Admin Client
 * 
 * For use in Server Components, Server Actions, and Route Handlers only.
 * Uses the service role key which BYPASSES all RLS policies.
 * 
 * SECURITY WARNING:
 * - NEVER use this client in client-side code
 * - NEVER expose the service role key to the browser
 * - Only use for admin operations that require elevated permissions
 * 
 * Usage:
 * ```tsx
 * // In a Server Component, Server Action, or API Route
 * import { createAdminClient } from '@/lib/supabase/admin';
 * 
 * const supabase = createAdminClient();
 * // Can perform admin operations like user management, bypassing RLS
 * ```
 */

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
