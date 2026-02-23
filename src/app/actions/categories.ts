/**
 * Server Actions for Categories
 * 
 * Server-side data fetching for categories
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/types';

/**
 * Get all categories with wallpaper counts
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Fetch counts for all categories
  const categoriesWithCounts = await Promise.all(
    data.map(async (category) => {
      const { count } = await supabase
        .from('wallpapers')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .is('deleted_at', null);

      return {
        ...category,
        wallpaper_count: count || 0,
      } as Category;
    })
  );

  return categoriesWithCounts;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  // Fetch true wallpaper count for this category
  const { count } = await supabase
    .from('wallpapers')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', data.id)
    .is('deleted_at', null);

  return {
    ...data,
    wallpaper_count: count || 0,
  } as Category;
}

/**
 * Get categories with a representative wallpaper image
 */
export async function getCategoriesWithImages(): Promise<(Category & { image_url?: string })[]> {
  const supabase = await createClient();

  // Get categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (catError || !categories) {
    console.error('Error fetching categories:', catError);
    return [];
  }

  // Get one wallpaper image per category AND the count of active wallpapers
  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      // Fetch latest wallpaper image
      const { data: wallpaper } = await supabase
        .from('wallpapers')
        .select('image_url')
        .eq('category_id', category.id)
        .is('deleted_at', null)
        .order('like_count', { ascending: false })
        .limit(1)
        .single();

      // Fetch total count of active wallpapers in this category
      const { count } = await supabase
        .from('wallpapers')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .is('deleted_at', null);

      return {
        ...category,
        image_url: wallpaper?.image_url,
        wallpaper_count: count || 0,
      };
    })
  );

  return categoriesWithImages;
}
