/**
 * Supabase Server Client
 * 
 * For use in Server Components, Server Actions, and Route Handlers only.
 * Uses cookies for session management and the anon key with RLS policies.
 * 
 * IMPORTANT: This file uses "next/headers" which CANNOT be imported in client components.
 * Always import directly from this file in server contexts:
 * 
 * Usage:
 * ```tsx
 * // In a Server Component or Server Action
 * import { createClient } from '@/lib/supabase/server';
 * 
 * const supabase = await createClient();
 * const { data } = await supabase.from('wallpapers').select('*');
 * ```
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle cookie error in middleware
            // This can happen when the response headers have already been sent
          }
        },
      },
    }
  );
}
