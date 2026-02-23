/**
 * Premium Home Page
 * 
 * Single-page layout with:
 * - Minimal header with search
 * - Trending wallpapers grid (priority)
 * - Browse by category
 * - Latest wallpapers
 * - Infinite scroll feel
 */

import { getFeaturedWallpapers, getTrendingWallpapers, getLatestWallpapers } from '@/app/actions/wallpapers';
import { getCategoriesWithImages } from '@/app/actions/categories';
import { HomeClient } from '@/components/home/HomeClient';

export default async function HomePage() {
  // Fetch data in parallel
  const [featured, trending, categories, latest] = await Promise.all([
    getFeaturedWallpapers(5),
    getTrendingWallpapers(8),
    getCategoriesWithImages(),
    getLatestWallpapers(16),
  ]);

  return <HomeClient featured={featured} trending={trending} categories={categories} latest={latest} />;
}
