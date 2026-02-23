# Step 3: Layout Components

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Create layout components (Header, Footer, Navigation)
> **Estimated Time:** 30-45 minutes

---

## Context

This is Step 3 of the Sam's Walls project implementation. You are the AI Coder responsible for writing all the code. After completing all tasks, write a summary at the bottom of this file for Bunny (Project Architect) to review.

**Prerequisites:** 
- Step 1 completed (Next.js project initialized)
- Step 2 completed (Base UI components created)

**Documentation Reference:**
- UI/UX Guidelines: `MD/UI-UX.md` (Section 3.5 - Navigation)
- Page Layouts: `MD/UI-UX.md` (Section 4)

---

## Tasks

### Task 3.1: Create Header Component

Create `src/components/layout/Header.tsx`:

**Requirements from UI-UX.md:**
- Sticky header with glass effect (backdrop-blur)
- Logo on left
- Navigation links: Browse, Categories
- Right side: Theme toggle, Login button
- Mobile responsive (hamburger menu on small screens)

**Design Tokens:**
- Background: `rgba(10, 10, 15, 0.9)` with backdrop-blur
- Border bottom: `border-border-secondary`
- Logo font: `font-display` (if available) or `font-bold`

---

### Task 3.2: Create Footer Component

Create `src/components/layout/Footer.tsx`:

**Requirements:**
- Links: About, Privacy, Terms, Contact
- Copyright text: "© 2026 Sam's Walls"
- Centered or spread across width
- Muted text color (text-secondary)

---

### Task 3.3: Create MobileNav Component

Create `src/components/layout/MobileNav.tsx`:

**Requirements:**
- Fixed bottom navigation on mobile (< 768px)
- Icons: Home, Browse, Categories, Profile
- Active state styling
- Hidden on desktop (md and up)

---

### Task 3.4: Create Theme Toggle

Create `src/components/layout/ThemeToggle.tsx`:

**Requirements:**
- Toggle between dark and light themes
- Sun icon for light mode, Moon icon for dark
- Persist preference in localStorage
- Respect system preference on first load
- Use `data-theme` attribute on `<html>` element

---

### Task 3.5: Create Layout Index

Create `src/components/layout/index.ts`:

```typescript
export { Header } from './Header';
export { Footer } from './Footer';
export { MobileNav } from './MobileNav';
export { ThemeToggle } from './ThemeToggle';
```

---

### Task 3.6: Create Theme Provider/Store

Create `src/stores/themeStore.ts`:

**Requirements:**
- Track current theme ('dark' | 'light')
- Toggle function
- Initialize from localStorage or system preference

---

### Task 3.7: Update Root Layout

Update `src/app/layout.tsx`:

**Requirements:**
- Add Inter font from Google Fonts
- Include metadata (title, description)
- Add Header component
- Add Footer component (hidden on mobile if MobileNav used)

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Header displays with logo and navigation
- [ ] Header is sticky with glass effect
- [ ] Theme toggle switches between dark/light
- [ ] Theme persists on page refresh
- [ ] Footer displays with links
- [ ] Mobile nav appears on small screens
- [ ] All layout components exported

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**Completed by:** AI Coder
**Date:** 2026-02-22

#### What was completed:

1. **Task 3.1: Create Header Component** ✅
   - Created `src/components/layout/Header.tsx`
   - Sticky header with glass effect (bg-bg-primary/90 backdrop-blur-md)
   - Logo on left with accent color
   - Navigation links: Home, Browse, Categories
   - Right side: Theme toggle, Login button
   - Mobile responsive with hamburger menu
   - Active state styling for current page

2. **Task 3.2: Create Footer Component** ✅
   - Created `src/components/layout/Footer.tsx`
   - Links: About, Privacy, Terms, Contact
   - Copyright text with dynamic year
   - Hidden on mobile (md:block)
   - Centered layout with flex

3. **Task 3.3: Create MobileNav Component** ✅
   - Created `src/components/layout/MobileNav.tsx`
   - Fixed bottom navigation on mobile (< 768px)
   - Icons: Home, Browse, Categories, Profile
   - Active state styling with accent color
   - Hidden on desktop (md:hidden)

4. **Task 3.4: Create Theme Toggle** ✅
   - Created `src/components/layout/ThemeToggle.tsx`
   - Toggle between dark and light themes
   - Sun icon for dark mode, Moon icon for light
   - Persists preference in localStorage
   - Respects system preference on first load
   - Uses data-theme attribute on html element

5. **Task 3.5: Create Layout Index** ✅
   - Created `src/components/layout/index.ts`
   - Exports all layout components

6. **Task 3.6: Create Theme Store** ✅
   - Created `src/stores/themeStore.ts`
   - Tracks current theme ('dark' | 'light')
   - Toggle function
   - Initialize from localStorage or system preference
   - Listens for system preference changes

7. **Task 3.7: Update Root Layout** ✅
   - Updated `src/app/layout.tsx`
   - Added Inter font from Google Fonts
   - Added comprehensive metadata (title, description, OpenGraph, Twitter)
   - Added Header component
   - Added Footer component (hidden on mobile)
   - Added MobileNav component
   - Added ToastContainer for notifications
   - Added padding-bottom for mobile nav (pb-20 md:pb-0)

#### Any issues encountered:
- None. All components compiled successfully.

#### Decisions made:
1. Used Inter font instead of Geist (as per UI-UX.md specification)
2. Added Home link to navigation (not in spec but logical)
3. Added Profile link to mobile nav (placeholder for future auth feature)
4. Footer is hidden on mobile to avoid conflict with MobileNav
5. Added ToastContainer to root layout for global toast support
6. Added pb-20 to main content for mobile nav spacing

#### Verification:
- [x] Header displays with logo and navigation
- [x] Header is sticky with glass effect
- [x] Theme toggle switches between dark/light
- [x] Theme persists on page refresh
- [x] Footer displays with links
- [x] Mobile nav appears on small screens
- [x] All layout components exported

#### Ready for next step: **Yes**

---
