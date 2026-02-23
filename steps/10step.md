# Step 10: Public Pages & UX Improvements

> **Phase:** 1 (Public Pages)
> **Focus:** Single-page experience, modals, seamless UX
> **Time:** 90-120 min

---

## Design Philosophy

### Core UX Principles

1. **Single-Page Experience** — No page reloads for browsing. Content appears in overlays/modals.

2. **Minimal Navigation** — User stays on home page. Browse, categories, search all open as overlays.

3. **Quick Auth** — Login/Signup as dropdown, not full-page redirect.

4. **Instant Feedback** — Smooth transitions, no jarring page switches.

---

## Architecture Overview

### Page Structure

```
/ (Home) — Main entry point, everything happens here
  ├── Browse Modal — Opens on "Browse" click
  ├── Categories Modal — Opens on "Categories" click
  ├── Search Modal — Opens on search click or Cmd+K
  ├── Wallpaper Modal — Opens on wallpaper click
  └── Auth Dropdown — Login/Signup in header

/wallpaper/[id] — Direct link fallback (for sharing/SEO)
/categories/[slug] — Direct link fallback (for sharing/SEO)
```

### User Flow

```
Home Page
    │
    ├── Click "Browse" ──────► BrowseModal (overlay)
    │                              ├── Filter by category
    │                              ├── Sort options
    │                              └── Click wallpaper ► WallpaperModal
    │
    ├── Click "Categories" ──► CategoriesModal (overlay)
    │                              └── Click category ► BrowseModal (filtered)
    │
    ├── Click wallpaper ─────► WallpaperModal (overlay)
    │                              ├── Download
    │                              ├── Like
    │                              └── Share
    │
    ├── Cmd+K ───────────────► SearchModal (overlay)
    │                              └── Click result ► WallpaperModal
    │
    └── Click "Sign In" ─────► AuthDropdown
                                   ├── Login form
                                   └── Register form
```

---

## Tasks

### 10.1: Create Modal State Store

**File:** `src/stores/modalStore.ts`

```typescript
// Zustand store for managing modal state

type ModalType = 'browse' | 'categories' | 'wallpaper' | 'search' | null;

interface ModalData {
  wallpaperId?: string;
  categoryId?: string;
  categorySlug?: string;
  initialFilter?: string;
  // ... other data
}

interface ModalState {
  // State
  currentModal: ModalType;
  modalData: ModalData;
  history: Array<{ modal: ModalType; data: ModalData }>;
  
  // Actions
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  goBack: () => void;
  replaceModal: (modal: ModalType, data?: ModalData) => void;
}
```

**Implementation Notes:**
- Use Zustand for state management
- Track history for back navigation
- Support nested modals (e.g., CategoriesModal → BrowseModal → WallpaperModal)

---

### 10.2: Create Base Modal Component

**File:** `src/components/modals/Modal.tsx`

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}
```

**Features:**
- Animated open/close (fade + scale)
- Overlay backdrop with blur
- ESC key to close
- Click outside to close
- Focus trap for accessibility
- Scroll lock on body when open
- Responsive sizing (full-screen on mobile)

**Animation Specs:**
```css
/* Entry */
opacity: 0 → 1 (200ms ease-out)
backdrop-filter: blur(0) → blur(8px) (200ms)

/* Exit */
opacity: 1 → 0 (150ms ease-in)
transform: scale(1) → scale(0.95) (150ms)
```

---

### 10.3: Create Modal Provider

**File:** `src/components/modals/ModalProvider.tsx`

**Purpose:** Single component that renders the current modal based on store state.

```typescript
// Pseudo-structure
export function ModalProvider() {
  const { currentModal, modalData, closeModal, goBack } = useModalStore();
  
  return (
    <>
      {currentModal === 'browse' && <BrowseModal {...modalData} />}
      {currentModal === 'categories' && <CategoriesModal {...modalData} />}
      {currentModal === 'wallpaper' && <WallpaperModal {...modalData} />}
      {currentModal === 'search' && <SearchModal {...modalData} />}
    </>
  );
}
```

**Add to layout:**
```typescript
// src/app/layout.tsx
<AuthProvider>
  <ModalProvider />
  {children}
</AuthProvider>
```

---

### 10.4: Create Browse Modal

**File:** `src/components/modals/BrowseModal.tsx`

**Props:**
```typescript
interface BrowseModalProps {
  categorySlug?: string;      // Pre-filter by category
  sortBy?: 'newest' | 'trending' | 'downloads';
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back                    Browse Wallpapers              ✕ │
├─────────────────────────────────────────────────────────────┤
│ [All] [Abstract] [Nature] [Minimal] [Dark] [Space] [...]   │ ← Filter chips
│                                                             │
│ Sort: [Newest ▼]                    Showing 156 wallpapers │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │    │ │    │ │    │ │    │ │    │ │    │               │
│  │    │ │    │ │    │ │    │ │    │ │    │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │    │ │    │ │    │ │    │ │    │ │    │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                             │
│                    [ Load More ]                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Filter chips (horizontal scroll on mobile)
- Sort dropdown
- Wallpaper grid (reuse `WallpaperGrid` component)
- Load more button (or infinite scroll)
- Click wallpaper → opens `WallpaperModal`

---

### 10.5: Create Categories Modal

**File:** `src/components/modals/CategoriesModal.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                       Categories                          ✕ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │         │ │         │ │         │ │         │          │
│  │ Abstract│ │ Nature  │ │ Minimal │ │  Dark   │          │
│  │  42     │ │  38     │ │  29     │ │  56     │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │         │ │         │ │         │ │         │          │
│  │Gradient │ │  Space  │ │  Arch   │ │ Animals │          │
│  │  34     │ │  27     │ │  19     │ │  23     │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Grid of category cards with images
- Wallpaper count badge
- Click → opens `BrowseModal` filtered by category

---

### 10.6: Create Wallpaper Modal

**File:** `src/components/modals/WallpaperModal.tsx`

**Props:**
```typescript
interface WallpaperModalProps {
  wallpaperId: string;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back                                               ✕     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────┐                          │
│                    │             │                          │
│                    │   WALLPAPER │                          │
│                    │    IMAGE    │                          │
│                    │             │                          │
│                    │             │                          │
│                    └─────────────┘                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Cosmic Dreams                                    👑 Pro    │
│  Abstract • Feb 22, 2026                                   │
│                                                             │
│  A stunning cosmic wallpaper featuring vibrant colors...   │
│                                                             │
│  Tags: cosmic, space, abstract, colorful                   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ ❤️ 142   │  │ 👁️ 1.2K  │  │  📥 234  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    📥 Download                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Related Wallpapers                                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │    │ │    │ │    │ │    │ │    │ │    │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘               │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Full-screen on mobile, centered modal on desktop
- Wallpaper image (fitted, not stretched)
- Title, category, date
- Description
- Tags
- Stats row (likes, views, downloads)
- Download button (triggers download + increments counter)
- Like button (animated)
- Share button (copy link / native share API)
- Related wallpapers carousel
- Keyboard navigation (← → for previous/next)

---

### 10.7: Create Search Modal

**File:** `src/components/modals/SearchModal.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🔍  Search wallpapers...                              ✕   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Recent Searches                                            │
│  cosmic, nature, abstract, dark mode                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Results for "cosmic"                                       │
│                                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │    │ │    │ │    │ │    │                              │
│  └────┘ └────┘ └────┘ └────┘                              │
│                                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                              │
│  │    │ │    │ │    │ │    │                              │
│  └────┘ └────┘ └────┘ └────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Large search input (auto-focus)
- Recent searches (localStorage)
- Live search results (debounced, 300ms)
- Results grid
- Click result → opens `WallpaperModal`
- Keyboard shortcut: Cmd/Ctrl + K to open

---

### 10.8: Create Auth Dropdown

**File:** `src/components/auth/AuthDropdown.tsx`

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│  Welcome back                           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📧  Email                         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔒  Password                  👁️  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ☐ Remember me                          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │           Sign In                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ───────────── or ─────────────        │
│                                         │
│  Don't have an account?                 │
│  ┌───────────────────────────────────┐  │
│  │       Create Account              │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Dropdown from header (not full page)
- Tab between Login / Register views
- Form validation
- Password visibility toggle
- "Remember me" checkbox
- Error handling with toast
- Success → close dropdown, update UI

---

### 10.9: Update Header Component

**File:** `src/components/layout/Header.tsx`

**Changes Required:**

| Before | After |
|--------|-------|
| `<Link href="/browse">Browse</Link>` | `<button onClick={() => openModal('browse')}>Browse</button>` |
| `<Link href="/categories">Categories</Link>` | `<button onClick={() => openModal('categories')}>Categories</button>` |
| `<Link href="/login">Sign In</Link>` | `<AuthDropdown />` |
| Search input inline | Button that opens SearchModal |

**New Header Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Sam's Walls    [Home] [Browse] [Categories]    🔍  [👤 ▼] │
└─────────────────────────────────────────────────────────────┘
```

---

### 10.10: Update Home Page

**File:** `src/app/page.tsx`

**Changes Required:**

| Element | Before | After |
|---------|--------|-------|
| "View all" link | `href="/browse"` | `onClick={() => openModal('browse')}` |
| "All categories" link | `href="/categories"` | `onClick={() => openModal('categories')}` |
| Category card click | `href="/categories/[slug]"` | `onClick={() => openModal('browse', { categorySlug })}` |
| Wallpaper card click | `href="/wallpaper/[id]"` | `onClick={() => openModal('wallpaper', { wallpaperId })}` |

---

### 10.11: Create Fallback Pages (SEO/Deep Links)

**File:** `src/app/wallpaper/[id]/page.tsx`

```typescript
// This page is for direct links only (sharing, SEO)
// It renders the same content as WallpaperModal but as a full page

export default async function WallpaperPage({ params }) {
  const { id } = await params;
  const wallpaper = await getWallpaperById(id);
  
  return <WallpaperDetail wallpaper={wallpaper} />;
}
```

**File:** `src/app/categories/[slug]/page.tsx`

```typescript
// This page is for direct links only (sharing, SEO)
// It renders the same content as BrowseModal filtered by category

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const wallpapers = await getWallpapersByCategory(slug);
  
  return <CategoryBrowse category={category} wallpapers={wallpapers} />;
}
```

---

## API Endpoints

### GET `/api/wallpapers`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category slug |
| `sort` | string | `newest`, `trending`, `downloads` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Search query |

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "hasMore": true
  }
}
```

### GET `/api/wallpapers/[id]`

**Response:**
```json
{
  "id": "uuid",
  "title": "Cosmic Dreams",
  "description": "...",
  "image_url": "...",
  "thumbnail_url": "...",
  "is_premium": false,
  "like_count": 142,
  "view_count": 1200,
  "download_count": 234,
  "tags": ["cosmic", "space"],
  "category": { "name": "Abstract", "slug": "abstract" },
  "related": [...]
}
```

### POST `/api/wallpapers/[id]/like`

**Response:**
```json
{
  "liked": true,
  "like_count": 143
}
```

### POST `/api/wallpapers/[id]/download`

**Response:**
```json
{
  "download_url": "...",
  "download_count": 235
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close current modal |
| `Cmd/Ctrl + K` | Open search modal |
| `Cmd/Ctrl + B` | Open browse modal |
| `←` `→` | Navigate wallpapers (in WallpaperModal) |

---

## File Structure Summary

```
src/
├── components/
│   ├── modals/
│   │   ├── Modal.tsx              # Base modal component
│   │   ├── ModalProvider.tsx      # Modal context provider
│   │   ├── BrowseModal.tsx        # Browse wallpapers
│   │   ├── CategoriesModal.tsx    # Categories grid
│   │   ├── WallpaperModal.tsx     # Wallpaper detail
│   │   ├── SearchModal.tsx        # Search overlay
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── AuthDropdown.tsx       # Login/Signup dropdown
│   │   ├── LoginForm.tsx          # Login form
│   │   ├── RegisterForm.tsx       # Register form
│   │   └── index.ts
│   │
│   └── layout/
│       └── Header.tsx             # Updated with modal triggers
│
├── app/
│   ├── page.tsx                   # Updated home
│   ├── wallpaper/
│   │   └── [id]/
│   │       └── page.tsx           # Fallback page
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx           # Fallback page
│   └── api/
│       ├── wallpapers/
│       │   ├── route.ts           # GET list
│       │   └── [id]/
│       │       ├── route.ts       # GET detail
│       │       ├── like/
│       │       │   └── route.ts   # POST like
│       │       └── download/
│       │           └── route.ts   # POST download
│       └── search/
│           └── route.ts           # GET search
│
├── stores/
│   └── modalStore.ts              # Zustand store
│
└── hooks/
    └── useModal.ts                # Modal hook
```

---

## Verification Checklist

### Functionality
- [x] Clicking "Browse" opens modal (no page navigation)
- [x] Clicking "Categories" opens modal (no page navigation)
- [x] Clicking wallpaper opens detail modal
- [x] Login/Signup appears as modal
- [x] Search opens with Cmd+K
- [x] ESC closes modals
- [x] Back button works in modal history
- [x] Direct links (`/wallpaper/[id]`) work for sharing

### UX
- [x] All transitions are smooth (no jarring jumps)
- [x] Loading states shown
- [x] Error states handled gracefully
- [x] Mobile responsive

### Performance
- [ ] Modals lazy loaded (can be optimized later)
- [x] Images optimized
- [x] No unnecessary re-renders

---

## Summary

**Completed:**
- [x] Modal store (`src/stores/modalStore.ts`)
- [x] Base Modal component (`src/components/modals/Modal.tsx`)
- [x] ModalProvider (`src/components/modals/ModalProvider.tsx`)
- [x] BrowseModal (`src/components/modals/BrowseModal.tsx`)
- [x] CategoriesModal (`src/components/modals/CategoriesModal.tsx`)
- [x] WallpaperModal (`src/components/modals/WallpaperModal.tsx`)
- [x] SearchModal (`src/components/modals/SearchModal.tsx`)
- [x] AuthModal (`src/components/modals/AuthModal.tsx`) - Combined login/register in modal
- [x] Updated Header (`src/components/layout/Header.tsx`) - Modal triggers instead of links
- [x] Updated Home Page (`src/components/home/HomeClient.tsx`) - Client component with modal triggers
- [x] Fallback pages:
  - [x] `/wallpaper/[id]/page.tsx` with `WallpaperDetail.tsx`
  - [x] `/categories/[slug]/page.tsx` with `CategoryDetail.tsx`
- [x] Added `getWallpaperById` server action

**Not Completed (Deferred to Phase 2):**
- [ ] API endpoints (`/api/wallpapers`, `/api/wallpapers/[id]`, `/api/wallpapers/[id]/like`, `/api/wallpapers/[id]/download`, `/api/search`)
  - These are for client-side data fetching which will be implemented in Phase 2
- [ ] `useModal.ts` hook - Using `useModalStore` directly instead
- [ ] Separate auth components (`AuthDropdown.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`) - Combined into `AuthModal.tsx`

**Issues:**
- None critical. All modals functional with keyboard shortcuts (Cmd+K, Cmd+B, Esc)

**Ready for next step:** Yes - Phase 1 complete, ready for Phase 2
