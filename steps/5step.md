# Step 5: Database Tables & Admin User

> **Phase:** 0 (Foundation & Setup)
> **Focus:** Create database tables and seed admin user
> **Estimated Time:** 30-45 minutes

---

## Context

This is Step 5 of the Sam's Walls project implementation. The database tables are the foundation for all features. We'll create them using the Supabase MCP server and seed the admin user.

**Prerequisites:** 
- Steps 1-4 completed
- Supabase project connected (credentials in `.env.local`)

**Documentation Reference:**
- Database Schema: `MD/DATABASE.md` (Section 2 - Tables)

---

## Tasks

### Task 5.1: Create users Table

Use Supabase MCP to create the users table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  display_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_banned BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Note:** The `password_hash` column is for reference. Supabase Auth handles passwords separately, but we store user profile data here.

---

### Task 5.2: Create categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_count INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories(order_index);
```

---

### Task 5.3: Create wallpapers Table

```sql
CREATE TABLE wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INT,
  height INT,
  file_size INT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_wallpapers_category ON wallpapers(category_id);
CREATE INDEX idx_wallpapers_premium ON wallpapers(is_premium);
CREATE INDEX idx_wallpapers_featured ON wallpapers(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_wallpapers_deleted ON wallpapers(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_wallpapers_tags ON wallpapers USING GIN(tags);
CREATE INDEX idx_wallpapers_created ON wallpapers(created_at DESC);
CREATE INDEX idx_wallpapers_likes ON wallpapers(like_count DESC);
```

---

### Task 5.4: Create likes Table

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallpaper_id UUID NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anon_fingerprint VARCHAR(64),
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_like UNIQUE (wallpaper_id, user_id),
  CONSTRAINT unique_anon_like UNIQUE (wallpaper_id, anon_fingerprint),
  CONSTRAINT like_has_identity CHECK (
    user_id IS NOT NULL OR anon_fingerprint IS NOT NULL
  )
);

CREATE INDEX idx_likes_wallpaper ON likes(wallpaper_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_fingerprint ON likes(anon_fingerprint);
```

---

### Task 5.5: Seed Admin User

Insert the admin user with your email:

```sql
INSERT INTO users (email, display_name, role, is_verified)
VALUES ('sameer.amor00@gmail.com', 'Sameer', 'admin', TRUE);
```

**Note:** The user will be able to login via Supabase Auth once we set that up. This creates their profile record.

---

### Task 5.6: Seed Default Categories

Insert initial categories for wallpapers:

```sql
INSERT INTO categories (name, slug, description, order_index) VALUES
('Abstract', 'abstract', 'Abstract and artistic designs', 1),
('Nature', 'nature', 'Beautiful nature and landscape wallpapers', 2),
('Minimal', 'minimal', 'Clean, minimal designs', 3),
('Dark', 'dark', 'Dark mode aesthetic wallpapers', 4),
('Gradient', 'gradient', 'Beautiful gradient designs', 5),
('Space', 'space', 'Cosmic and space themes', 6);
```

---

### Task 5.7: Enable Row Level Security

Enable RLS on all tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
```

---

### Task 5.8: Create Basic RLS Policies

**Categories - Public Read:**
```sql
CREATE POLICY "categories_select_all"
  ON categories FOR SELECT
  USING (true);
```

**Wallpapers - Public Read (non-deleted):**
```sql
CREATE POLICY "wallpapers_select_active"
  ON wallpapers FOR SELECT
  USING (deleted_at IS NULL);
```

**Likes - Public Read:**
```sql
CREATE POLICY "likes_select_all"
  ON likes FOR SELECT
  USING (true);
```

**Likes - Anyone Can Insert:**
```sql
CREATE POLICY "likes_insert_all"
  ON likes FOR INSERT
  WITH CHECK (true);
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `users` table created with correct columns
- [ ] `categories` table created with correct columns
- [ ] `wallpapers` table created with correct columns
- [ ] `likes` table created with correct columns
- [ ] Admin user seeded with email `sameer.amor00@gmail.com`
- [ ] Default categories seeded (6 categories)
- [ ] RLS enabled on all tables
- [ ] Basic RLS policies created

---

## Summary (Write after completing tasks)

> **Instructions:** After completing all tasks above, write a summary below of what was done, any issues encountered, and any decisions made. This summary will be reviewed by Bunny (Project Architect).

### Summary

**What was completed:**
- Task 5.1: Created `users` table with 11 columns, 2 indexes, role check constraint
- Task 5.2: Created `categories` table with 8 columns, 2 indexes
- Task 5.3: Created `wallpapers` table with 19 columns, 7 indexes (including GIN for tags)
- Task 5.4: Created `likes` table with 6 columns, 3 indexes, 3 constraints (unique user like, unique anon like, identity check)
- Task 5.5: Seeded admin user: `sameer.amor00@gmail.com` with role `admin`
- Task 5.6: Seeded 6 default categories: Abstract, Nature, Minimal, Dark, Gradient, Space
- Task 5.7: Enabled RLS on all 4 tables
- Task 5.8: Created 4 basic RLS policies:
  - `categories_select_all` - public read access
  - `wallpapers_select_active` - public read non-deleted
  - `likes_select_all` - public read access
  - `likes_insert_all` - anyone can insert

**Verification:**
- All 4 tables created with correct columns and relationships
- Foreign key constraints properly set up (wallpapers → categories, wallpapers → users, likes → wallpapers, likes → users)
- RLS enabled on all tables
- Admin user seeded (1 row in users)
- Default categories seeded (6 rows in categories)

**Any issues encountered:**
- None - all migrations applied successfully

**Decisions made:**
- Used Supabase MCP `apply_migration` for all database operations
- Kept migrations separate for easier rollback if needed

**Ready for next step:** Yes

---
