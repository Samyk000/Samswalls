# Step 1: Next.js Project Initialization

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Create and configure Next.js project with TypeScript and Tailwind CSS
> **Estimated Time:** 30-45 minutes

---

## Context

This is Step 1 of the Sam's Walls project implementation. You are the AI Coder responsible for writing all the code. After completing all tasks, write a summary at the bottom of this file for Bunny (Project Architect) to review.

**Documentation Reference:**
- Full project docs: `/MD/` folder
- Architecture: `MD/ARCHITECTURE.md`
- UI/UX: `MD/UI-UX.md`

---

## Tasks

### Task 1.1: Create Next.js Project

Initialize a new Next.js 14 project in the `samswalls` directory with:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Options to select:**
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: `@/*`

**Location:** Run inside `/mnt/c/Users/Samee/Desktop/samswalls/`

---

### Task 1.2: Configure Tailwind CSS with Design Tokens

Update `tailwind.config.ts` to include the design tokens from `MD/UI-UX.md`:

**Colors (Dark Theme):**
```typescript
colors: {
  // Backgrounds
  bg: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a25',
    hover: '#222230',
  },
  // Text
  text: {
    primary: '#f0f0f5',
    secondary: '#a0a0b0',
    tertiary: '#6b6b7b',
  },
  // Accent
  accent: {
    primary: '#6366f1',
    hover: '#818cf8',
    muted: '#4f46e5',
  },
  // Semantic
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  // Borders
  border: {
    primary: '#2a2a35',
    secondary: '#1f1f28',
  },
  // Premium
  premium: {
    gold: '#fbbf24',
  },
}
```

**Font Family:**
```typescript
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: ['Cal Sans', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```

**Border Radius:**
```typescript
borderRadius: {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
}
```

---

### Task 1.3: Install Additional Dependencies

Install the required packages from `MD/ARCHITECTURE.md`:

```bash
npm install framer-motion zustand @tanstack/react-query react-hook-form zod @hookform/resolvers
npm install -D @types/node
```

---

### Task 1.4: Create Base Folder Structure

Create the following directory structure inside `src/`:

```
src/
├── app/                    # (already created by Next.js)
├── components/
│   └── ui/                 # Base UI components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── r2/                 # R2 client
│   ├── auth/               # Auth utilities
│   ├── validation/         # Zod schemas
│   └── utils/              # Helper functions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
└── types/                  # TypeScript types
```

Create a `.gitkeep` file in each empty folder to preserve them in git.

---

### Task 1.5: Create Utility Functions

Create `src/lib/utils/cn.ts` (className merger utility):

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install the required packages:
```bash
npm install clsx tailwind-merge
```

---

### Task 1.6: Configure Path Aliases

Ensure `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Task 1.7: Create Base Types

Create `src/types/index.ts` with base types:

```typescript
// API Response types
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// User types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_banned: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Wallpaper types
export interface Wallpaper {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  image_url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  category_id: string | null;
  created_by: string | null;
  is_premium: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Like types
export interface Like {
  id: string;
  wallpaper_id: string;
  user_id: string | null;
  anon_fingerprint: string | null;
  ip_hash: string | null;
  created_at: string;
}
```

---

### Task 1.8: Create Environment Variables File

Create `.env.local` with placeholder values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=samswalls-images
R2_PUBLIC_URL=your-r2-public-url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth
JWT_SECRET=your-jwt-secret-min-32-characters

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@samswalls.com

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Admin
ADMIN_EMAIL=admin@samswalls.com
```

Update `.gitignore` to include `.env.local` (should already be there from Next.js).

---

### Task 1.9: Update Global Styles

Update `src/app/globals.css` to use design tokens:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Dark theme (default) */
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --bg-tertiary: #1a1a25;
    --bg-hover: #222230;
    
    --text-primary: #f0f0f5;
    --text-secondary: #a0a0b0;
    --text-tertiary: #6b6b7b;
    
    --accent-primary: #6366f1;
    --accent-hover: #818cf8;
    
    --border-primary: #2a2a35;
    --border-secondary: #1f1f28;
  }

  body {
    @apply bg-bg-primary text-text-primary antialiased;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus visible styles */
  :focus-visible {
    @apply outline-2 outline-accent-primary outline-offset-2;
  }
}

/* Light theme (optional toggle) */
[data-theme="light"] {
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f5f5;
  --bg-hover: #eeeeee;
  
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  
  --border-primary: #e5e5e5;
  --border-secondary: #f0f0f0;
}
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Next.js project runs with `npm run dev`
- [ ] Tailwind CSS is configured with design tokens
- [ ] All dependencies installed
- [ ] Folder structure created
- [ ] Utility functions working
- [ ] Base types defined
- [ ] Environment variables file created
- [ ] Global styles applied

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**Completed by:** AI Coder
**Date:** 2026-02-22

#### What was completed:

1. **Task 1.1: Create Next.js Project** ✅
   - Next.js 16.1.6 project created with TypeScript, Tailwind CSS v4, ESLint, App Router, src/ directory
   - React 19.2.3 installed (newer than documented)

2. **Task 1.2: Configure Tailwind CSS with Design Tokens** ✅
   - Adapted for Tailwind CSS v4 using `@theme` directive in globals.css
   - All design tokens added: colors (bg, text, accent, semantic, border, premium), fonts, border-radius
   - Custom scrollbar and selection styles added

3. **Task 1.3: Install Additional Dependencies** ✅
   - Installed: framer-motion, zustand, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, clsx, tailwind-merge

4. **Task 1.4: Create Base Folder Structure** ✅
   - Created: src/components/ui/, src/lib/supabase/, src/lib/r2/, src/lib/auth/, src/lib/validation/, src/lib/utils/, src/hooks/, src/stores/, src/types/
   - Added .gitkeep files to preserve empty directories

5. **Task 1.5: Create Utility Functions** ✅
   - Created src/lib/utils/cn.ts - className merger utility using clsx and tailwind-merge

6. **Task 1.6: Configure Path Aliases** ✅
   - Already configured by create-next-app: `@/*` maps to `./src/*`

7. **Task 1.7: Create Base Types** ✅
   - Created src/types/index.ts with: ApiResponse, ApiError, User, Category, Wallpaper, Like, PaginationParams, PaginatedResponse, LoginCredentials, RegisterCredentials, AnalyticsEvent

8. **Task 1.8: Create Environment Variables File** ✅
   - Created .env.local with placeholder values for: Supabase, Cloudflare R2, App URL, Auth, Email (Resend), Sentry, Admin

9. **Task 1.9: Update Global Styles** ✅
   - Updated src/app/globals.css with Tailwind v4 @theme directive
   - Added dark theme (default) and light theme (optional toggle via data-theme)
   - Added smooth scrolling, focus visible styles, custom scrollbar

#### Any issues encountered:

1. **create-next-app conflict**: The directory already contained files (.env, MD/, plans/, steps/), so the command failed. User manually created the Next.js project in a temp folder and renamed it.

2. **Tailwind CSS v4 differences**: The project uses Tailwind CSS v4 which has a different configuration approach - no tailwind.config.ts file, instead uses `@theme` directive in CSS. Adapted the design tokens accordingly.

3. **Version differences**: The installed versions are newer than documented:
   - Next.js: 16.1.6 (documented: 14.x)
   - React: 19.2.3 (documented: 18.x)
   - Tailwind: v4 (documented: v3)

#### Decisions made:

1. Used Tailwind CSS v4 `@theme` directive instead of creating tailwind.config.ts
2. Added extra types (PaginationParams, PaginatedResponse, AnalyticsEvent) for better type safety
3. Added custom scrollbar styles for better UX
4. Added light theme variables for future theme toggle feature

#### Verification:

- [x] Next.js project runs with `npm run dev` (HTTP 200 at localhost:3000)
- [x] Tailwind CSS is configured with design tokens
- [x] All dependencies installed
- [x] Folder structure created
- [x] Utility functions working
- [x] Base types defined
- [x] Environment variables file created
- [x] Global styles applied

#### Ready for next step: **Yes**

---
