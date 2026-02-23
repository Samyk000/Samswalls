# Step 7: Authentication Setup

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Set up Supabase Auth with login/register pages
> **Estimated Time:** 45-60 minutes

---

## Context

This is Step 7 of the Sam's Walls project implementation. We'll set up authentication so users can login and the admin can access the admin panel.

**Prerequisites:** 
- Steps 1-6 completed
- Database tables created (users table exists)
- Admin user seeded: `sameer.amor00@gmail.com`

**Documentation Reference:**
- Architecture: `MD/ARCHITECTURE.md` (Section 7 - Security)
- API: `MD/API.md` (Section 3 - Authentication Endpoints)

---

## Tasks

### Task 7.1: Create Auth Context Provider

Create `src/contexts/AuthContext.tsx`:

**Requirements:**
- Wrap the app with Supabase auth state
- Provide `user`, `loading`, `signOut` to components
- Listen to auth state changes

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

### Task 7.2: Create Login Page

Create `src/app/login/page.tsx`:

**Requirements:**
- Email and password inputs
- Form validation with Zod
- Call Supabase auth signInWithPassword
- Redirect to home on success
- Show error messages
- Link to register page

**Design:**
- Centered card layout
- Dark theme
- Use Input and Button components from `@/components/ui`

---

### Task 7.3: Create Register Page

Create `src/app/register/page.tsx`:

**Requirements:**
- Email, password, confirm password, display name inputs
- Form validation with Zod
- Call Supabase auth signUp
- Create user record in users table
- Redirect to login on success
- Show error messages

---

### Task 7.4: Create Auth API Route (Optional)

Create `src/app/api/auth/route.ts`:

**Requirements:**
- GET: Return current user session
- POST: Handle login/register
- DELETE: Handle logout

---

### Task 7.5: Create Zod Validation Schemas

Create `src/lib/validation/auth.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

---

### Task 7.6: Update Root Layout with AuthProvider

Update `src/app/layout.tsx`:

**Wrap children with AuthProvider:**

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

// In the return statement:
<body>
  <AuthProvider>
    <Header />
    <main>{children}</main>
    <Footer />
    <MobileNav />
    <ToastContainer />
  </AuthProvider>
</body>
```

---

### Task 7.7: Update Header with Auth State

Update `src/components/layout/Header.tsx`:

**Requirements:**
- Show "Login" button when not authenticated
- Show user email/menu when authenticated
- Add logout option

---

### Task 7.8: Create Middleware for Protected Routes

Create `src/middleware.ts`:

**Requirements:**
- Protect `/admin/*` routes (check for admin role)
- Protect `/profile` route (check for authentication)
- Redirect to login if not authenticated

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // TODO: Check admin role from users table
  }

  // Protect profile route
  if (pathname === '/profile') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/profile'],
};
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] AuthProvider wraps the app
- [ ] Login page renders at `/login`
- [ ] Register page renders at `/register`
- [ ] Form validation works (shows errors)
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can logout
- [ ] Header shows auth state
- [ ] Protected routes redirect to login

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**What was completed:**
- Task 7.1: Created Auth Context Provider at `src/contexts/AuthContext.tsx`
  - Provides `user`, `loading`, `signOut` to components
  - Listens to Supabase auth state changes
- Task 7.2: Created Login Page at `src/app/login/page.tsx`
  - Email and password inputs with Zod validation
  - Supabase signInWithPassword integration
  - Redirect to home on success
- Task 7.3: Created Register Page at `src/app/register/page.tsx`
  - Email, password, confirm password, display name inputs
  - Password validation (8 chars, uppercase, number)
  - Supabase signUp integration
- Task 7.4: Skipped (Auth API route is optional)
- Task 7.5: Created Zod Validation Schemas at `src/lib/validation/auth.ts`
  - `loginSchema` for login validation
  - `registerSchema` with password strength requirements
- Task 7.6: Updated Root Layout with AuthProvider
  - Wrapped children with AuthProvider in `src/app/layout.tsx`
- Task 7.7: Updated Header with Auth State
  - Shows "Login" button when not authenticated
  - Shows user email dropdown when authenticated
  - Added Profile, Favorites, Sign Out options
- Task 7.8: Created Middleware for Protected Routes at `middleware.ts`
  - Protects `/admin/*` routes
  - Protects `/profile` route
  - Redirects to login if not authenticated

**Files created:**
- `src/contexts/AuthContext.tsx`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/lib/validation/auth.ts`
- `middleware.ts`

**Files modified:**
- `src/app/layout.tsx` - Added AuthProvider wrapper
- `src/components/layout/Header.tsx` - Added auth state display

**Any issues encountered:**
- Import issues with Supabase client (needed to import directly from client.ts, not index.ts which includes server.ts)
- Toast store uses `toast.success/error/info` methods, not `showSuccess/showError`
- Middleware file must be at project root, not in src/

**Decisions made:**
- Used Supabase Auth for authentication
- Used Zod for form validation
- Middleware placed at root level for Next.js 16 compatibility

**Ready for next step:** Yes

---
