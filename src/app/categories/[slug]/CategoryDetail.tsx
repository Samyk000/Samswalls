/**
 * Category Detail Component
 * 
 * Client component for displaying category wallpapers
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, Grid3X3 } from 'lucide-react';
import type { Category } from '@/types';
import type { CategoryWallpaper } from '@/app/actions/wallpapers';
import { useModalStore } from '@/stores/modalStore';

interface CategoryDetailProps {
  category: Category;
  wallpapers: CategoryWallpaper[];
}

export function CategoryDetail({ category, wallpapers }: CategoryDetailProps) {
  const { openModal } = useModalStore();

  const handleWallpaperClick = (wallpaperId: string) => {
    openModal('wallpaper', { wallpaperId });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-xl border-b border-border-secondary/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-2 text-text-tertiary">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm">{wallpapers.length} wallpapers</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-text-secondary">{category.description}</p>
          )}
        </div>

        {/* Wallpapers Grid */}
        {wallpapers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => handleWallpaperClick(wallpaper.id)}
                className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-bg-secondary"
              >
                <img
                  src={wallpaper.thumbnail_url || wallpaper.image_url}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm font-medium text-white truncate">
                    {wallpaper.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Grid3X3 className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No wallpapers yet
            </h3>
            <p className="text-text-secondary">
              Check back soon for new {category.name.toLowerCase()} wallpapers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
