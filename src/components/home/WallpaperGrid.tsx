/**
 * Wallpaper Grid Component
 *
 * Premium wallpaper grid with:
 * - 3D tilt perspective on hover
 * - Heart burst animation on like
 * - Shimmer skeleton loading
 * - Staggered entrance animation
 */

'use client';

import { useState, useCallback } from 'react';
import { useModalStore } from '@/stores/modalStore';
import { cn } from '@/lib/utils/cn';
import {
  Heart,
  DownloadSimple,
  Crown,
  Eye,
} from '@phosphor-icons/react';
import type { Wallpaper } from '@/types';

export type WallpaperCardData = Partial<Wallpaper> & {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url?: string | null;
  is_premium?: boolean;
  is_featured?: boolean;
  like_count?: number;
  view_count?: number;
};

interface WallpaperGridProps {
  wallpapers: WallpaperCardData[];
}

export function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5 stagger-grid">
      {wallpapers.map((wallpaper, index) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          index={index}
        />
      ))}
    </div>
  );
}

interface WallpaperCardProps {
  wallpaper: WallpaperCardData;
  index: number;
}

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(wallpaper.like_count || 0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { openModal } = useModalStore();

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Visual heart pop animation logic handled by CSS class toggle on the icon
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  }, [liked]);

  const handleClick = (e: React.MouseEvent) => {
    // Only open modal if the click wasn't on the like button or quick download button
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    e.preventDefault();
    openModal('wallpaper', { wallpaperId: wallpaper.id });
  };

  const displayImage = wallpaper.thumbnail_url || wallpaper.image_url;

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      className="card-3d group relative aspect-[9/16] overflow-hidden rounded-2xl bg-bg-secondary text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="card-3d-inner w-full h-full relative">
        {/* Image with Loading State */}
        <div className="absolute inset-0">
          <img
            src={displayImage || ''}
            alt={wallpaper.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              'group-hover:scale-[1.03]',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Shimmer Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer rounded-2xl" />
          )}
        </div>

        {/* Premium Badge */}
        {wallpaper.is_premium && (
          <div className="absolute top-3 left-3 z-10">
            <Crown weight="fill" className="w-5 h-5 text-premium-gold drop-shadow-md" />
          </div>
        )}

        {/* Hover Content - Zen Immersive Glass Backdrop */}
        <div className="glass-backdrop absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end min-h-[40%] translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>

          <div className="flex flex-col gap-1 w-[70%]">
            <span className="font-bold text-sm text-white truncate drop-shadow-md">
              {wallpaper.title}
            </span>
            <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
              <span className="flex items-center gap-1">
                <Heart weight={liked ? "fill" : "bold"} className={cn("w-3.5 h-3.5", liked && "text-red-500")} />
                {likeCount.toLocaleString()}
              </span>
              {wallpaper.view_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye weight="bold" className="w-3.5 h-3.5" />
                  {wallpaper.view_count.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLike}
            className="icon-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-1"
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              weight={liked ? "fill" : "regular"}
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                liked ? "text-red-500 heart-pop" : "text-white hover:text-red-400"
              )}
            />
          </button>
        </div>

        {/* Quick Download Overlay Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-10">
          <div className="p-3 rounded-full bg-black/30 border border-white/20 backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-400 shadow-xl">
            <DownloadSimple weight="bold" className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Wallpaper Grid Skeleton — shimmer effect
 */
export function WallpaperGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[9/16] rounded-2xl shimmer" />
      ))}
    </div>
  );
}
