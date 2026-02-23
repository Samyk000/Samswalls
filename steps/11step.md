# Step 11: User Authentication & Features (Phase 2)

> **Phase:** 2 (User Authentication & Features)
> **Focus:** User profiles, favorites, premium access, like sync
> **Time:** 90-120 min

---

## Overview

Phase 2 focuses on enhancing the user experience for authenticated users:
- User profile management
- Favorites/wishlist functionality
- Premium content access control
- Like synchronization across devices
- Password reset functionality

---

## Tasks

### 11.1: User Profile Page

**File:** `src/app/profile/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────┐                               │
│              │     👤      │                               │
│              │   Avatar    │                               │
│              └─────────────┘                               │
│                                                             │
│              sameer.amor00                                  │
│              sameer.amor00@gmail.com                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  👤 Profile Settings                                 │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Display Name                                        │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ Sameer                                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  Email                                               │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ sameer.amor00@gmail.com                      │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           Save Changes                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🔐 Change Password                                  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │        Change Password                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Stats                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ ❤️ 24    │  │ 👁️ 156   │  │ 📥 42    │                 │
│  │ Favorites│  │ Views    │  │ Downloads│                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Display user avatar (initials or image)
- Edit display name
- View email (read-only)
- Change password button
- User stats (favorites, views, downloads)
- Account deletion option

---

### 11.2: Favorites Page

**File:** `src/app/favorites/page.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                    My Favorites                   ✕ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  24 wallpapers saved                                        │
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
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Grid of favorited wallpapers
- Remove from favorites button
- Click to view wallpaper detail
- Empty state if no favorites

---

### 11.3: Favorites/Likes API Routes

**File:** `src/app/api/favorites/route.ts`

**Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/favorites` | GET | Get user's favorites |
| `/api/favorites` | POST | Add to favorites |
| `/api/favorites/[id]` | DELETE | Remove from favorites |
| `/api/favorites/check/[wallpaperId]` | GET | Check if favorited |

**Request/Response:**

```typescript
// POST /api/favorites
{
  "wallpaperId": "uuid"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "wallpaper_id": "uuid",
    "user_id": "uuid",
    "created_at": "2026-02-22T..."
  }
}

// GET /api/favorites
{
  "data": [
    {
      "id": "uuid",
      "wallpaper": {
        "id": "uuid",
        "title": "Cosmic Dreams",
        "image_url": "...",
        "thumbnail_url": "..."
      }
    }
  ],
  "meta": {
    "total": 24
  }
}
```

---

### 11.4: Like Sync for Authenticated Users

**Database:** Add `user_likes` table (if not exists)

```sql
CREATE TABLE user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallpaper_id UUID REFERENCES wallpapers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wallpaper_id)
);

CREATE INDEX idx_user_likes_user ON user_likes(user_id);
CREATE INDEX idx_user_likes_wallpaper ON user_likes(wallpaper_id);
```

**Migration Logic:**
- When user logs in, migrate anonymous likes to user account
- Use browser fingerprint or localStorage to identify anonymous likes

---

### 11.5: Premium Content Access Control

**File:** `src/middleware.ts` (update)

**Logic:**
```typescript
// Check if wallpaper is premium
// If premium and user not logged in → show login prompt
// If premium and user logged in → allow access

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/favorites')) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

**Premium Badge Component:**

```typescript
// Show premium badge on cards
{wallpaper.is_premium && (
  <div className="absolute top-2 right-2 px-2 py-1 bg-premium-gold rounded-full">
    <Crown className="w-4 h-4" />
  </div>
)}
```

---

### 11.6: Password Reset Flow

**Files:**
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`

**Flow:**
1. User enters email on forgot password page
2. Supabase sends reset email
3. User clicks link in email
4. User enters new password on reset page
5. Password updated, redirect to login

---

### 11.7: User Stats Tracking

**Database:** Update `users` table or create `user_stats` table

```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  favorites_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  downloads_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tracking:**
- Increment counters on user actions
- Display in profile page

---

## File Structure

```
src/
├── app/
│   ├── profile/
│   │   └── page.tsx           # User profile page
│   ├── favorites/
│   │   └── page.tsx           # Favorites page
│   ├── forgot-password/
│   │   └── page.tsx           # Password reset request
│   ├── reset-password/
│   │   └── page.tsx           # Password reset form
│   └── api/
│       ├── favorites/
│       │   ├── route.ts       # GET/POST favorites
│       │   └── [id]/
│       │       └── route.ts   # DELETE favorite
│       └── user/
│           └── stats/
│               └── route.ts   # GET/UPDATE user stats
│
├── components/
│   └── profile/
│       ├── ProfileForm.tsx    # Edit profile form
│       ├── Avatar.tsx         # User avatar
│       └── StatsCard.tsx      # Stats display
```

---

## Verification Checklist

### Functionality
- [x] Profile page displays user info
- [x] User can update display name
- [x] User can change password
- [x] Favorites page shows saved wallpapers
- [x] User can add/remove favorites
- [x] Premium content restricted to logged-in users
- [x] Password reset flow works

### UX
- [x] Smooth transitions
- [x] Loading states
- [x] Error handling
- [x] Success toasts

### Security
- [x] Protected routes
- [x] CSRF protection (via Supabase Auth)
- [ ] Rate limiting on auth endpoints (optional enhancement)

---

## Summary

**Completed:**
- [x] Profile page (`src/app/profile/page.tsx`)
- [x] Favorites page (`src/app/favorites/page.tsx`)
- [x] Favorites API (`src/app/api/favorites/route.ts`, `src/app/api/favorites/[id]/route.ts`)
- [x] Premium access control (middleware updated)
- [x] Password reset (`src/app/forgot-password/page.tsx`, `src/app/reset-password/page.tsx`)
- [x] User stats (displayed on profile page)
- [x] user_likes table with RLS policies

**Issues:**
- None

**Ready for next step:** Yes - Phase 3: Admin Panel
