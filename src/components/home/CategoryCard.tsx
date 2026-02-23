/**
 * Category Card Component
 * 
 * Premium category card with:
 * - Hover zoom effect
 * - Gradient overlay
 * - Wallpaper count badge
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  wallpaper_count: number;
  index?: number;
}

export function CategoryCard({
  name,
  slug,
  image_url,
  wallpaper_count,
  index = 0,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-bg-secondary"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background Image or Gradient */}
      {image_url ? (
        <img
          src={image_url}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/30 to-accent-muted/20" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-white/70">
          {wallpaper_count.toLocaleString()} {wallpaper_count === 1 ? 'wallpaper' : 'wallpapers'}
        </p>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-accent-primary/50 transition-all" />

      {/* Arrow Icon */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

/**
 * Category Card Skeleton
 */
export function CategoryCardSkeleton() {
  return (
    <div className="aspect-square rounded-2xl bg-bg-secondary animate-pulse">
      <div className="h-full w-full bg-gradient-to-t from-bg-tertiary to-transparent" />
    </div>
  );
}

/**
 * Categories Grid Component
 */
interface CategoriesGridProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    wallpaper_count: number;
  }>;
  loading?: boolean;
}

export function CategoriesGrid({ categories, loading }: CategoriesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          {...category}
          index={index}
        />
      ))}
    </div>
  );
}
