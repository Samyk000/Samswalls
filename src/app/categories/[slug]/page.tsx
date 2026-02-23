/**
 * Category Page (Fallback)
 * 
 * This page serves as a fallback for direct links and SEO.
 * In the SPA experience, categories open in a modal instead.
 */

import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/app/actions/categories';
import { getWallpapersByCategory } from '@/app/actions/wallpapers';
import { CategoryDetail } from './CategoryDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Wallpapers`,
    description: category.description || `Browse ${category.name} wallpapers`,
    openGraph: {
      title: `${category.name} Wallpapers | Sam's Walls`,
      description: category.description || `Browse ${category.name} wallpapers`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, wallpapers] = await Promise.all([
    getCategoryBySlug(slug),
    getWallpapersByCategory(slug, 24),
  ]);

  if (!category) {
    notFound();
  }

  return <CategoryDetail category={category} wallpapers={wallpapers} />;
}
