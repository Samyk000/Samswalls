/**
 * Server Actions for Wallpapers
 * 
 * Server-side data fetching for wallpapers
 */

'use server';

import { createClient } from '@/lib/supabase/server';

// Types for partial wallpaper data returned from queries
export interface FeaturedWallpaper {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  category: { name: string; slug: string } | null;
}

export interface TrendingWallpaper {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_featured: boolean;
  like_count: number;
  view_count: number;
}

export interface LatestWallpaper {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_featured: boolean;
  like_count: number;
  view_count: number;
}

export interface CategoryWallpaper {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_featured: boolean;
  like_count: number;
  view_count: number;
}

/**
 * Get featured wallpapers for hero carousel
 */
export async function getFeaturedWallpapers(limit = 5): Promise<FeaturedWallpaper[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      image_url,
      thumbnail_url,
      is_featured,
      categories ( name, slug )
    `)
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured wallpapers:', error);
    return [];
  }

  return data.map((w) => {
    const categories = w.categories as { name: string; slug: string } | { name: string; slug: string }[] | null;
    let category: { name: string; slug: string } | null = null;

    if (categories) {
      if (Array.isArray(categories)) {
        category = categories[0] || null;
      } else {
        category = categories;
      }
    }

    return {
      id: w.id,
      title: w.title,
      image_url: w.image_url,
      thumbnail_url: w.thumbnail_url,
      is_featured: w.is_featured,
      category,
    };
  });
}

/**
 * Get trending wallpapers (by like count)
 */
export async function getTrendingWallpapers(limit = 12): Promise<TrendingWallpaper[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      image_url,
      thumbnail_url,
      is_premium,
      is_featured,
      like_count,
      view_count
    `)
    .is('deleted_at', null)
    .order('like_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending wallpapers:', error);
    return [];
  }

  return data as TrendingWallpaper[];
}

/**
 * Get latest wallpapers
 */
export async function getLatestWallpapers(limit = 12): Promise<LatestWallpaper[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      image_url,
      thumbnail_url,
      is_premium,
      is_featured,
      like_count,
      view_count
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest wallpapers:', error);
    return [];
  }

  return data as LatestWallpaper[];
}

/**
 * Get wallpapers by category
 */
export async function getWallpapersByCategory(
  categorySlug: string,
  limit = 12
): Promise<CategoryWallpaper[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      image_url,
      thumbnail_url,
      is_premium,
      is_featured,
      like_count,
      view_count,
      categories!inner ( slug )
    `)
    .eq('categories.slug', categorySlug)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching wallpapers by category:', error);
    return [];
  }

  return data as CategoryWallpaper[];
}

/**
 * Wallpaper detail type
 */
export interface WallpaperDetail {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_featured: boolean;
  like_count: number;
  view_count: number;
  download_count: number;
  created_at: string;
  category: { id: string; name: string; slug: string } | null;
}

/**
 * Get wallpaper by ID
 */
export async function getWallpaperById(id: string): Promise<WallpaperDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      description,
      image_url,
      thumbnail_url,
      is_premium,
      is_featured,
      like_count,
      view_count,
      download_count,
      created_at,
      categories ( id, name, slug )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('Error fetching wallpaper:', error);
    return null;
  }

  // Transform the category data
  const categories = data.categories as { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null;
  let category: { id: string; name: string; slug: string } | null = null;

  if (categories) {
    if (Array.isArray(categories)) {
      category = categories[0] || null;
    } else {
      category = categories;
    }
  }

  return {
    ...data,
    category,
  } as WallpaperDetail;
}
