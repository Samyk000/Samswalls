# Step 12: Hero Section, Page Transitions & Search Polish

## Overview

This step focuses on three main areas:
1. **Premium Hero Section** - Create a stunning hero with SVG animations
2. **Fast Page Transitions** - Smooth, instant-feel navigation between pages
3. **Search Polish** - Connect to API, server-side with Supabase, debounced results

**Priority Order:**
1. Page Transitions (HIGHEST) - Critical UX issue
2. Hero Section (HIGH) - Premium feel
3. Search Functionality (LOWEST) - Polish only

---

## Part 1: Fast Page Transitions (CRITICAL)

### Problem
- Current navigation feels like "going to a next page"
- Transitions are too slow
- Breaks the app-like feel

### Solution: Implement View Transitions API + Instant Navigation

#### 1.1 Enable View Transitions in Next.js

**File: `src/app/layout.tsx`**

Add View Transitions API support:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// View Transition types
type ViewTransition = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => ViewTransition;
  }
}

export function useViewTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only trigger on actual navigation, not initial load
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      
      // View Transitions API is available
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          // This is handled by React's render
        });
      }
    }
  }, [pathname, searchParams]);
}
```

#### 1.2 Add CSS View Transition Classes

**File: `src/app/globals.css`**

Add to the end of the file:

```css
/* ========================================
   VIEW TRANSITIONS (Page Navigation)
   ======================================== */

/* Default view transition name for page content */
::view-transition-old(root) {
  animation: 300ms ease-out both fade-out;
}

::view-transition-new(root) {
  animation: 300ms ease-out both fade-in;
}

/* Custom keyframes for view transitions */
@keyframes fade-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Instant-feel transition variant */
@keyframes instant-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Category filter view transition */
.category-pill {
  view-transition-name: category-pill;
}

/* Wallpaper card view transitions - unique names for each */
.wallpaper-card {
  view-transition-name: wallpaper-card;
}

/* Smooth page content transitions */
.page-content {
  view-transition-name: page-content;
}

/* Override for instant-feel navigation */
.instant-transition ::view-transition-old(root),
.instant-transition ::view-transition-new(root) {
  animation-duration: 150ms;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms !important;
  }
}
```

#### 1.3 Update Layout with View Transition Hook

**File: `src/app/layout.tsx`**

Add the ViewTransition component:

```tsx
import { ViewTransitionHandler } from '@/components/view-transition-handler';

// Inside the ThemeProvider div, wrap children:
<main className="pt-16 md:pt-16 flex-1">
  <ViewTransitionHandler />
  {children}
</main>
```

#### 1.4 Create View Transition Handler Component

**New File: `src/components/view-transition-handler.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ViewTransitionHandler() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Skip on initial load
    if (prevPathnameRef.current === pathname) return;
    
    prevPathnameRef.current = pathname;

    // Trigger view transition if supported
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        // React handles the DOM update
      });
    }
  }, [pathname]);

  return null;
}
```

#### 1.5 Add Page Transition Class to Category Filter

**File: `src/components/category-filter.tsx`**

Update the router.push to use instant transition:

```tsx
const handleCategoryClick = (slug: string | null) => {
  // Add instant transition class temporarily
  document.documentElement.classList.add('instant-transition');
  
  const params = new URLSearchParams(searchParams.toString());
  if (slug) {
    params.set('category', slug);
  } else {
    params.delete('category');
  }
  params.delete('page');

  const queryString = params.toString();
  router.push(queryString ? `${pathname}?${queryString}` : pathname);
  
  // Remove class after transition
  setTimeout(() => {
    document.documentElement.classList.remove('instant-transition');
  }, 200);
};
```

#### 1.6 Add Prefetch for Instant Navigation Feel

**File: `src/components/category-filter.tsx`**

Add prefetch on hover for categories:

```tsx
<button
  onMouseEnter={() => {
    // Prefetch the category page
    const params = new URLSearchParams(searchParams.toString());
    if (category.slug) params.set('category', category.slug);
    params.delete('page');
    const queryString = params.toString();
    router.prefetch(queryString ? `${pathname}?${queryString}` : pathname);
  }}
  onClick={() => handleCategoryClick(category.slug)}
  // ... rest of props
>
```

---

## Part 2: Premium Hero Section

### Requirements
- No search input (already in header)
- Stunning SVG animations
- Premium, modern feel
- Eye-catching but not distracting
- Must load fast

### 2.1 Create Hero Component

**New File: `src/components/hero-section.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// SVG Animation Paths - Abstract flowing shapes
const FLOWING_PATHS = [
  'M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,200 L0,200 Z',
  'M0,150 C100,100 200,200 300,150 C400,100 500,200 600,150 C700,100 800,200 900,150 L1000,150 L1000,250 L0,250 Z',
  'M0,80 Q250,180 500,80 T1000,80 L1000,180 L0,180 Z',
];

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-[200%] h-full opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            animation: 'wave-flow 20s linear infinite',
          }}
        >
          <defs>
            <linearGradient id="hero-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="hero-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hero-gradient-1)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="hero-wave-1"
          />
          <path
            fill="url(#hero-gradient-2)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="hero-wave-2"
          />
        </svg>

        {/* Floating Particles SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={15 + (i * 10)}
              cy={20 + (i % 3) * 20}
              r={0.3 + (i % 2) * 0.2}
              fill="url(#particle-glow)"
              className="hero-particle"
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
        </svg>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl hero-orb-1" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl hero-orb-2" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--accent)]">Premium HD Wallpapers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-[var(--text-primary)]">Discover Your Perfect</span>
            <br />
            <span className="text-gradient">Wallpaper</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Curated collection of stunning HD wallpapers for your desktop, phone, and tablet. Updated daily.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[var(--shadow-glow)] btn-press"
            >
              <Link href="/explore" className="gap-2">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-xl border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] btn-press"
            >
              <Link href="/category/nature">
                <span>Browse by Category</span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-[var(--border-default)]/50">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">10K+</div>
              <div className="text-sm text-[var(--text-muted)]">Wallpapers</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-default)]" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">4K</div>
              <div className="text-sm text-[var(--text-muted)]">Resolution</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-default)]" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Daily</div>
              <div className="text-sm text-[var(--text-muted)]">Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 2.2 Add Hero Animations to CSS

**File: `src/app/globals.css`**

Add these animation keyframes:

```css
/* ========================================
   HERO SECTION ANIMATIONS
   ======================================== */

/* Wave flow animation */
@keyframes wave-flow {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Hero wave paths */
.hero-wave-1 {
  animation: hero-wave-float 8s ease-in-out infinite;
}

.hero-wave-2 {
  animation: hero-wave-float 10s ease-in-out infinite reverse;
}

@keyframes hero-wave-float {
  0%, 100% {
    d: path("M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z");
  }
  50% {
    d: path("M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z");
  }
}

/* Floating particles */
.hero-particle {
  animation: hero-particle-float 4s ease-in-out infinite;
}

@keyframes hero-particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

/* Gradient orbs */
.hero-orb-1 {
  animation: hero-orb-pulse 8s ease-in-out infinite;
}

.hero-orb-2 {
  animation: hero-orb-pulse 10s ease-in-out infinite reverse;
}

@keyframes hero-orb-pulse {
  0%, 100% {
    transform: scale(1) translate(0, 0);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1) translate(10px, -10px);
    opacity: 0.8;
  }
}

/* Hero entrance animation */
@keyframes hero-content-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content-enter {
  animation: hero-content-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Staggered children */
.hero-stagger > *:nth-child(1) { animation-delay: 0ms; }
.hero-stagger > *:nth-child(2) { animation-delay: 100ms; }
.hero-stagger > *:nth-child(3) { animation-delay: 200ms; }
.hero-stagger > *:nth-child(4) { animation-delay: 300ms; }
.hero-stagger > *:nth-child(5) { animation-delay: 400ms; }
```

### 2.3 Update Home Page to Use Hero

**File: `src/app/page.tsx`**

Add the HeroSection at the top:

```tsx
import { HeroSection } from '@/components/hero-section';

// At the beginning of the return, before CategoryFilter:
return (
  <div className="space-y-6">
    {/* Hero Section - Only on first page with no filters */}
    {!category && !search && page === 1 && (
      <HeroSection />
    )}
    
    {/* Rest of the existing content */}
    <CategoryFilter ... />
    // ...
  </div>
);
```

---

## Part 3: Search Functionality (LOWEST PRIORITY)

### Current State
- Search UI exists in header (`SearchBar` component)
- Uses URL params for search state
- Has debouncing (300ms)

### Tasks

#### 3.1 Connect to Supabase Server-Side Search

The search already works with the existing `getWallpapers` query. Verify it's optimized:

**File: `src/lib/queries.ts`**

Ensure the search is using Supabase full-text search:

```ts
// In getWallpapers function, the search should use ilike or full-text:
if (search) {
  query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
}
```

#### 3.2 Add Search Suggestions (Optional Enhancement)

**New File: `src/components/search-suggestions.tsx`**

Only implement if time permits. This is LOW priority.

#### 3.3 Remove Any Cmd+K Shortcuts

**Files to check:**
- `src/components/search-bar.tsx` - Ensure no Cmd+K listener
- `src/components/header.tsx` - Ensure no global keyboard shortcut
- Any global keyboard handlers in layout

The current SearchBar component does NOT have Cmd+K - verify this remains removed.

---

## File Changes Summary

### New Files to Create
1. `src/components/hero-section.tsx` - Premium hero with SVG animations
2. `src/components/view-transition-handler.tsx` - View Transitions API handler

### Files to Modify
1. `src/app/page.tsx` - Add HeroSection, conditional rendering
2. `src/app/layout.tsx` - Add ViewTransitionHandler
3. `src/app/globals.css` - Add View Transitions CSS, Hero animations
4. `src/components/category-filter.tsx` - Add prefetch, instant transitions
5. `src/lib/queries.ts` - Verify search optimization (if needed)

---

## Testing Checklist

### Page Transitions
- [ ] Click category pill - transition should feel instant (150-300ms)
- [ ] Navigate from home to category - smooth fade
- [ ] Browser back/forward - no janky reload
- [ ] Mobile navigation - same smooth feel
- [ ] Prefetch on hover works (check Network tab)

### Hero Section
- [ ] Hero only shows on home page (no category/search)
- [ ] SVG waves animate smoothly
- [ ] Particles float without jank
- [ ] Gradient orbs pulse subtly
- [ ] CTA buttons work and navigate correctly
- [ ] Stats section displays properly
- [ ] Dark mode looks premium
- [ ] Light mode looks premium
- [ ] Mobile responsive (stack elements)

### Search
- [ ] Search in header works
- [ ] Debounce works (300ms delay)
- [ ] No Cmd+K shortcut exists
- [ ] Clear button works
- [ ] Results update correctly
- [ ] URL params update correctly

### Performance
- [ ] Lighthouse score >= 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

---

## Important Notes

1. **NO search in hero section** - Search is only in the header
2. **NO Cmd+K keyboard shortcut** - Not needed
3. **Search is lowest priority** - Focus on transitions and hero first
4. **Transitions must feel instant** - Not like navigating to a new page
5. **Hero must be premium** - SVG animations should be smooth, not distracting

---

## Summary Section (AI Coder to Fill After Implementation)

### What Was Implemented
*Fill in after completion*

### Files Created
*List all new files*

### Files Modified
*List all modified files with brief change description*

### Known Issues / Follow-ups Needed
*List any issues encountered or remaining work*

### Performance Results
*Include Lighthouse scores or other metrics*

---
