# Step 8: Admin Upload Page

> **Phase:** 0 → 1 Transition
> **Focus:** Create admin panel with image upload
> **Time:** 45-60 min

---

## Context

Step 8 of Sam's Walls. Create admin panel to upload wallpapers.

**Prerequisites:** Steps 1-7 complete, R2 ready, Auth working.

---

## Tasks

### 8.1: Create Admin Layout

Create `src/app/admin/layout.tsx`:
- Admin sidebar navigation
- Protected by middleware
- Links: Dashboard, Wallpapers, Categories, Users

### 8.2: Create Admin Dashboard

Create `src/app/admin/page.tsx`:
- Show stats: total wallpapers, users, likes
- Quick actions

### 8.3: Create Upload Page

Create `src/app/admin/upload/page.tsx`:
- Image file input (drag & drop)
- Title, description, category, tags inputs
- Premium/featured toggles
- Upload to R2, save to database

### 8.4: Create Wallpaper List Page

Create `src/app/admin/wallpapers/page.tsx`:
- Table of all wallpapers
- Edit, delete, toggle featured

### 8.5: Add Admin Role Check to Middleware

Update `middleware.ts`:
- Check user role from users table
- Only allow `role='admin'` for `/admin/*`

---

## Verification

- [ ] `/admin` shows dashboard
- [ ] `/admin/upload` uploads images
- [ ] `/admin/wallpapers` lists all
- [ ] Non-admins redirected from `/admin`

---

## Summary

**Completed:**
- ✅ 8.1: Admin Layout with sidebar navigation (Dashboard, Upload, Wallpapers, Categories, Users links)
- ✅ 8.2: Admin Dashboard with stats (total wallpapers, users, likes) and quick actions
- ✅ 8.3: Upload Page with drag & drop, form fields, R2 upload integration
- ✅ 8.4: Wallpaper List Page with table, toggle featured, delete functionality
- ✅ 8.5: Admin Role Check in Middleware (checks users table for role='admin')

**Files Created:**
- `src/app/admin/layout.tsx` - Admin sidebar layout
- `src/app/admin/page.tsx` - Dashboard with stats
- `src/app/admin/upload/page.tsx` - Upload form with drag & drop
- `src/app/admin/wallpapers/page.tsx` - Wallpapers list table
- `src/app/api/admin/upload/route.ts` - Upload API endpoint
- `src/app/api/admin/wallpapers/[id]/route.ts` - Delete wallpaper API
- `src/app/api/admin/wallpapers/[id]/featured/route.ts` - Toggle featured API

**Files Modified:**
- `middleware.ts` - Added admin role check from users table

**Issues:**
- None - all tasks completed successfully

**Ready for next step:** Yes
