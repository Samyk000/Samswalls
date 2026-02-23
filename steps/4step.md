# Step 4: Supabase Client Setup

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Configure Supabase client connections
> **Estimated Time:** 20-30 minutes

---

## Context

This is Step 4 of the Sam's Walls project implementation. You are the AI Coder responsible for writing all the code. After completing all tasks, write a summary at the bottom of this file for Bunny (Project Architect) to review.

**Prerequisites:** 
- Steps 1-3 completed
- Supabase project created (user will provide credentials)

**Documentation Reference:**
- Architecture: `MD/ARCHITECTURE.md` (Section 5.1 - Supabase Setup)
- Database: `MD/DATABASE.md`

---

## Tasks

### Task 4.1: Install Supabase Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### Task 4.2: Create Browser Client

Create `src/lib/supabase/client.ts`:

**Requirements:**
- Create Supabase client for browser-side usage
- Use environment variables for URL and anon key
- Export singleton client

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

### Task 4.3: Create Server Client

Create `src/lib/supabase/server.ts`:

**Requirements:**
- Create Supabase client for server-side usage (Server Components, API routes)
- Handle cookies for session management
- Export function to create client

```typescript
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
          }
        },
      },
    }
  );
}
```

---

### Task 4.4: Create Admin Client (Optional)

Create `src/lib/supabase/admin.ts`:

**Requirements:**
- Create Supabase client with service role key
- Use for admin operations that bypass RLS
- Only use on server-side

```typescript
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
```

---

### Task 4.5: Create Supabase Index

Create `src/lib/supabase/index.ts`:

```typescript
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
export { createAdminClient } from './admin';
```

---

### Task 4.6: Create Auth Helpers

Create `src/lib/auth/session.ts`:

**Requirements:**
- Function to get current user (server-side)
- Function to check if user is authenticated
- Function to get user role

```typescript
import { createServerClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function getUserRole() {
  const user = await getCurrentUser();
  // Role will be fetched from users table, not auth metadata
  return user ? 'user' : null;
}
```

---

### Task 4.7: Update Environment Variables

Ensure `.env.local` has real placeholder comments for:

```env
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Supabase packages installed
- [ ] Browser client created and exports correctly
- [ ] Server client created with cookie handling
- [ ] Admin client created (service role)
- [ ] Auth helper functions created
- [ ] All exports from index file

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**What was completed:**
- Task 4.1: Installed `@supabase/supabase-js` and `@supabase/ssr` packages (12 packages added)
- Task 4.2: Created browser client at `src/lib/supabase/client.ts`
- Task 4.3: Created server client at `src/lib/supabase/server.ts` with cookie handling
- Task 4.4: Created admin client at `src/lib/supabase/admin.ts` (service role)
- Task 4.5: Created supabase index at `src/lib/supabase/index.ts`
- Task 4.6: Created auth helpers at `src/lib/auth/session.ts` (getCurrentUser, isAuthenticated, getUserRole)
- Task 4.7: Updated `.env.local` with real Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL=https://wvgbtzqvwldwjvjzdhad.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Any issues encountered:**
- Minor import fix in `session.ts`: Changed import from `@/lib/supabase/server` to `@/lib/supabase` to use the re-exported `createServerClient` from the index file

**Decisions made:**
- Used the Supabase MCP to retrieve project URL and anon key automatically
- Service role key placeholder remains in `.env.local` (user needs to add this from Supabase dashboard for admin operations)

**Ready for next step:** Yes

---
