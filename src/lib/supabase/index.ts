/**
 * Supabase Client Exports
 * 
 * IMPORTANT: Import paths matter for Next.js App Router!
 * 
 * - Client Components: import { createClient } from '@/lib/supabase/client'
 * - Server Components: import { createClient } from '@/lib/supabase/server'
 * - Admin Operations: import { createAdminClient } from '@/lib/supabase/admin'
 * 
 * This index file ONLY exports the browser client for convenience.
 * Server and admin clients must be imported directly to avoid
 * "next/headers" errors in client components.
 */

// Only export browser client from index - safe for client components
export { createClient as createBrowserClient } from './client';

// Note: Server and admin clients are NOT re-exported here.
// Import them directly from their respective files:
// - Server: import { createClient } from '@/lib/supabase/server'
// - Admin: import { createAdminClient } from '@/lib/supabase/admin'
