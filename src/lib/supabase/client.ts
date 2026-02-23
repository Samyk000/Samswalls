/**
 * Supabase Browser Client (Singleton)
 * 
 * For use in Client Components only.
 * Uses a singleton pattern to prevent multiple auth lock acquisitions
 * which cause "Navigator LockManager lock timed out" errors.
 */

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
