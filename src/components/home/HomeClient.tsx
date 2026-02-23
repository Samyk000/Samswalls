/**
 * Home Page Client Component
 *
 * Single-page layout matching Zen Immersive design:
 * - Split Hero with 3D animation
 * - Category pills (when populated)
 * - Trending Slider (Edge-to-edge mouse drag)
 * - Recently Added Grid
 */

'use client';

import { useModalStore } from '@/stores/modalStore';
import { HeroSection } from './HeroSection';
import { WallpaperGrid } from './WallpaperGrid';
import { TrendingSlider } from './TrendingSlider';
import { CategoryPills } from './CategoryPills';
import type { Wallpaper, Category } from '@/types';

interface HomeClientProps {
  featured: (Partial<Wallpaper> & { id: string; title: string; image_url: string; thumbnail_url: string | null })[];
  trending: (Partial<Wallpaper> & { id: string; title: string; image_url: string; thumbnail_url: string | null })[];
  categories: (Category & { image_url?: string })[];
  latest: (Partial<Wallpaper> & { id: string; title: string; image_url: string; thumbnail_url: string | null })[];
}

export function HomeClient({ featured, trending, categories, latest }: HomeClientProps) {
  const { openModal } = useModalStore();

  return (
    <div className="bg-bg-primary text-text-primary">

      {/* Hero — Splitted 3D Fanning Stack */}
      <HeroSection featured={featured} />

      {/* Categories — only when populated */}
      {categories.length > 0 && (
        <section className="py-10 px-5 md:px-[5vw] border-b border-border-primary/50">
          <CategoryPills categories={categories} />
        </section>
      )}

      {/* Trending (Smooth Edge-to-Edge Slider) */}
      {trending.length > 0 && (
        <section className="py-[60px] md:py-[80px] border-b border-border-primary">
          <div className="flex justify-between items-end mb-8 px-5 md:px-[5vw]">
            <h2 className="serif text-3xl md:text-[2.5rem]">
              Trending <span className="text-accent-primary opacity-80 animate-soft-pulse">✦</span>
            </h2>
            <button
              onClick={() => openModal('browse', { sort: 'trending' })}
              className="font-lato font-bold uppercase tracking-widest text-[0.75rem] md:text-[0.8rem] text-text-secondary hover:text-text-primary transition-colors pb-1 border-b border-transparent hover:border-text-primary"
            >
              View Collection
            </button>
          </div>

          <TrendingSlider wallpapers={trending} />
        </section>
      )}

      {/* Recently Added (Grid) */}
      {latest.length > 0 && (
        <section className="py-[60px] md:py-[80px] px-5 md:px-[5vw]">
          <div className="flex justify-between items-end mb-8">
            <h2 className="serif text-3xl md:text-[2.5rem]">Recently Added</h2>
            <button
              onClick={() => openModal('browse', { sort: 'newest' })}
              className="font-lato font-bold uppercase tracking-widest text-[0.75rem] md:text-[0.8rem] text-text-secondary hover:text-text-primary transition-colors pb-1 border-b border-transparent hover:border-text-primary"
            >
              Browse All
            </button>
          </div>

          <WallpaperGrid wallpapers={latest} />

          <div className="mt-16 flex justify-center">
            <button
              onClick={() => openModal('browse', { sort: 'newest' })}
              className="font-lato font-bold uppercase tracking-widest text-[0.8rem] text-bg-primary bg-text-primary hover:bg-transparent hover:text-text-primary border border-text-primary transition-all duration-300 px-8 py-4 rounded-full"
            >
              Load More Spaces
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
