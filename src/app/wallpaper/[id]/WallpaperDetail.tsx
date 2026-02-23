/**
 * Wallpaper Detail Component
 * 
 * Client component for displaying wallpaper details
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Download, 
  Share2, 
  Eye, 
  Crown,
  Check
} from 'lucide-react';
import type { WallpaperDetail } from '@/app/actions/wallpapers';
import { useAuth } from '@/contexts/AuthContext';
import { useModalStore } from '@/stores/modalStore';
import { toast } from '@/stores/toastStore';

interface WallpaperDetailProps {
  wallpaper: WallpaperDetail;
}

export function WallpaperDetail({ wallpaper }: WallpaperDetailProps) {
  const { user } = useAuth();
  const { openModal } = useModalStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      openModal('auth');
      return;
    }
    // Toggle like (will be implemented with API)
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDownload = async () => {
    if (wallpaper.is_premium && !user) {
      openModal('auth');
      return;
    }

    setIsDownloading(true);
    try {
      // Create download link
      const link = window.document.createElement('a');
      link.href = wallpaper.image_url;
      link.download = `${wallpaper.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: wallpaper.title,
          text: wallpaper.description || 'Check out this wallpaper!',
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[9/16] sm:aspect-[3/4] lg:aspect-[9/16] max-h-[80vh] overflow-hidden rounded-2xl bg-bg-secondary">
              <img
                src={wallpaper.image_url}
                alt={wallpaper.title}
                className="w-full h-full object-cover"
              />
              {wallpaper.is_premium && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-premium-gold/90 rounded-full flex items-center gap-1.5 text-sm font-medium text-bg-primary">
                  <Crown className="w-4 h-4" />
                  Premium
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Title & Category */}
            <div className="mb-6">
              {wallpaper.category && (
                <Link
                  href={`/categories/${wallpaper.category.slug}`}
                  className="text-sm text-accent-primary hover:underline mb-2 inline-block"
                >
                  {wallpaper.category.name}
                </Link>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                {wallpaper.title}
              </h1>
              {wallpaper.description && (
                <p className="text-text-secondary">{wallpaper.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-8 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>{wallpaper.like_count.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{wallpaper.view_count.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>{wallpaper.download_count.toLocaleString()} downloads</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? 'Downloading...' : 'Download Wallpaper'}
              </button>

              <button
                onClick={handleLike}
                className={`w-full py-3.5 border rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isLiked
                    ? 'border-error text-error bg-error/10'
                    : 'border-border-primary text-text-primary hover:bg-bg-hover'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Add to Favorites'}
              </button>
            </div>

            {/* Premium Upsell */}
            {wallpaper.is_premium && !user && (
              <div className="p-4 bg-gradient-to-r from-premium-gold/10 to-amber-500/10 border border-premium-gold/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-premium-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      Premium Wallpaper
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Sign in to download this premium wallpaper in full resolution.
                    </p>
                    <button
                      onClick={() => openModal('auth')}
                      className="text-sm text-accent-primary hover:underline font-medium"
                    >
                      Sign in to download →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-auto pt-8 border-t border-border-primary">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Wallpaper Info
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-tertiary">Uploaded</span>
                  <p className="text-text-secondary">
                    {new Date(wallpaper.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary">Quality</span>
                  <p className="text-text-secondary flex items-center gap-1">
                    <Check className="w-4 h-4 text-success" />
                    HD Quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
