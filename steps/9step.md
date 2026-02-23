# Step 9: Home Page

> **Phase:** 1 (Public Pages)
> **Focus:** Premium home page with hero, categories, trending
> **Time:** 60-90 min

---

## Context

Step 9 of Sam's Walls. Create premium home page.

**Prerequisites:** Steps 1-8 complete.

---

## Tasks

### 9.1: Create Premium Components

- [x] `src/components/home/HeroCarousel.tsx` — Featured wallpapers carousel
- [x] `src/components/home/CategoryCard.tsx` — Category cards with hover effects
- [x] `src/components/home/WallpaperCard.tsx` — Wallpaper cards with animations
- [x] `src/components/home/WallpaperGrid.tsx` — Redesigned grid with lucide-react icons
- [x] `src/components/home/CategoryPills.tsx` — Quick navigation pills with icons
- [x] `src/components/home/index.ts` — Exports

### 9.2: Create Home Page

- [x] `src/app/page.tsx` — Redesigned premium home with lucide-react

### 9.3: Add Server Actions

- [x] `src/app/actions/wallpapers.ts` — Fetch wallpapers server-side
- [x] `src/app/actions/categories.ts` — Fetch categories server-side

### 9.4: Create Step Document

- [x] `steps/9step.md` — Document the step

---

## Verification

- [x] Home page shows minimal hero with search
- [x] Category pills with icons display correctly
- [x] Trending wallpapers grid works
- [x] Latest wallpapers section works
- [x] Premium CTA section displays
- [x] Animations are smooth
- [x] Mobile responsive

---

## Summary

**Status:** COMPLETED

**Dependencies Added:**
- `lucide-react` - Icon library for premium UI

**Files Created/Modified:**
- `src/app/page.tsx` - Redesigned premium home page with:
  - Minimal hero with search bar
  - Category pills with lucide-react icons
  - Trending section with Flame icon
  - Browse by category grid
  - Latest uploads section
  - Premium CTA with Crown icon

- `src/components/home/WallpaperGrid.tsx` - New grid component with:
  - Heart, Download, Crown, Eye icons from lucide-react
  - Premium badge with Crown icon
  - Like button with animation
  - Hover effects with quick actions
  - Loading skeleton

- `src/components/home/CategoryPills.tsx` - New component with:
  - Category-specific icons (Palette, Mountain, Moon, etc.)
  - Quick navigation pills
  - "More" button for additional categories

- `src/app/actions/wallpapers.ts` - Server actions with proper TypeScript types

**Key Features:**
1. **Minimal Hero** - Clean branding with search bar
2. **Category Pills** - Quick navigation with category-specific icons
3. **Trending Section** - Flame icon, sorted by like count
4. **Category Grid** - 6-column responsive grid with hover effects
5. **Latest Section** - TrendingUp icon, recently added
6. **Premium CTA** - Crown icon, gradient background

**Server Status:** Running at localhost:3000

**Ready for next step:** Yes
