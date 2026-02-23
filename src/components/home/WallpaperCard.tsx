/**
 * Wallpaper Card Component
 * 
 * Premium wallpaper card with:
 * - Aspect ratio for mobile wallpapers (9:16)
 * - Hover zoom effect with overlay
 * - Premium badge for premium content
 * - Like button with animation
 * - Quick actions on hover
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface WallpaperCardProps {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url?: string | null;
  is_premium?: boolean;
  is_featured?: boolean;
  like_count?: number;
  view_count?: number;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  index?: number;
}

export function WallpaperCard({
  id,
  title,
  image_url,
  thumbnail_url,
  is_premium = false,
  is_featured = false,
  like_count = 0,
  isLiked = false,
  onLike,
  index = 0,
}: WallpaperCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(like_count);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(id);
  }, [liked, id, onLike]);

  const displayImage = thumbnail_url || image_url;

  return (
    <Link
      href={`/wallpaper/${id}`}
      className="group relative block aspect-[9/16] overflow-hidden rounded-xl bg-bg-secondary"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <img
        src={displayImage}
        alt={title}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-all duration-500',
          'group-hover:scale-110 group-hover:brightness-75',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Loading Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-bg-tertiary animate-pulse" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        {is_premium && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-premium-gold to-warning text-bg-primary rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium
          </span>
        )}
        {is_featured && !is_premium && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className={cn(
          'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
          'backdrop-blur-sm',
          liked
            ? 'bg-error/20 text-error'
            : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
        )}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <svg
          className={cn(
            'w-5 h-5 transition-transform',
            isAnimating && 'animate-bounce'
          )}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Hover Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Download on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
      </div>

      {/* Premium Lock Overlay */}
      {is_premium && (
        <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="text-center">
            <svg className="w-8 h-8 text-premium-gold mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-white/80">Premium Only</span>
          </div>
        </div>
      )}
    </Link>
  );
}

/**
 * Wallpaper Card Skeleton
 */
export function WallpaperCardSkeleton() {
  return (
    <div className="aspect-[9/16] rounded-xl bg-bg-secondary overflow-hidden animate-pulse">
      <div className="w-full h-full bg-bg-tertiary" />
    </div>
  );
}

/**
 * Wallpapers Grid Component
 */
interface WallpapersGridProps {
  wallpapers: Array<{
    id: string;
    title: string;
    image_url: string;
    thumbnail_url?: string | null;
    is_premium?: boolean;
    is_featured?: boolean;
    like_count?: number;
  }>;
  loading?: boolean;
  onLike?: (id: string) => void;
}

export function WallpapersGrid({ wallpapers, loading, onLike }: WallpapersGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <WallpaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {wallpapers.map((wallpaper, index) => (
        <WallpaperCard
          key={wallpaper.id}
          {...wallpaper}
          index={index}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
