/**
 * Wallpaper Modal
 * 
 * Full-screen modal for viewing wallpaper details with:
 * - Full preview
 * - Download button
 * - Like button
 * - Share button
 * - Related wallpapers
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Modal } from './Modal';
import { useModalStore } from '@/stores/modalStore';
import { createClient } from '@/lib/supabase/client';
import { WallpaperGrid, WallpaperGridSkeleton } from '@/components/home/WallpaperGrid';
import {
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Heart, Crown, Eye, DownloadSimple as Download } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaperId?: string;
  onBack?: () => void;
}

interface WallpaperDetails {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  is_premium: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  download_count: number;
  tags: string[];
  category_id: string | null;
  categories: { name: string; slug: string } | null;
}

export function WallpaperModal({ isOpen, onClose, wallpaperId, onBack }: WallpaperModalProps) {
  const [wallpaper, setWallpaper] = useState<WallpaperDetails | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const { openModal, goBack: modalGoBack } = useModalStore();

  // Fetch wallpaper details
  useEffect(() => {
    if (!isOpen || !wallpaperId) return;

    setLoading(true);
    setShowFullImage(false);

    const fetchWallpaper = async () => {
      const supabase = createClient();

      // Get wallpaper details
      const { data, error } = await supabase
        .from('wallpapers')
        .select(`
          *,
          categories ( name, slug )
        `)
        .eq('id', wallpaperId)
        .single();

      if (error) {
        console.error('Error fetching wallpaper:', error);
        setLoading(false);
        return;
      }

      setWallpaper(data as WallpaperDetails);
      setLikeCount(data.like_count || 0);
      setLoading(false);

      // Increment view count
      await supabase.rpc('increment_view_count', { wallpaper_id: wallpaperId });

      // Fetch related wallpapers
      if (data.category_id) {
        const { data: relatedData } = await supabase
          .from('wallpapers')
          .select('id, title, image_url, thumbnail_url, is_premium, is_featured, like_count, view_count')
          .eq('category_id', data.category_id)
          .neq('id', wallpaperId)
          .limit(8);

        if (relatedData) {
          setRelated(relatedData);
        }
      }
    };

    fetchWallpaper();
  }, [isOpen, wallpaperId]);

  // Handle like
  const handleLike = useCallback(async () => {
    if (!wallpaper) return;

    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    // TODO: Save like to database
  }, [wallpaper, liked]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!wallpaper) return;

    // TODO: Check premium access
    // TODO: Track download

    // Open image in new tab
    window.open(wallpaper.image_url, '_blank');
  }, [wallpaper]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!wallpaper) return;

    const url = `${window.location.origin}/wallpaper/${wallpaper.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: wallpaper.title,
          text: `Check out this wallpaper: ${wallpaper.title}`,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      // TODO: Show toast
    }
  }, [wallpaper]);

  // Handle related wallpaper click
  const handleRelatedClick = useCallback((id: string) => {
    openModal('wallpaper', { wallpaperId: id });
  }, [openModal]);

  if (!wallpaperId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wallpaper?.title || 'Wallpaper'}
      size="xl"
      className="max-w-4xl"
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wallpaper ? (
        <div className="flex flex-col md:flex-row h-full bg-bg-primary overflow-hidden" style={{ maxHeight: '85vh' }}>
          {/* Left Column: Main Image */}
          <div className="relative w-full md:w-[55%] lg:w-[60%] bg-black flex items-center justify-center p-4 md:p-8 border-b md:border-b-0 md:border-r border-border-primary/50">
            <img
              src={showFullImage ? wallpaper.image_url : (wallpaper.thumbnail_url || wallpaper.image_url)}
              alt={wallpaper.title}
              className={cn(
                'w-auto h-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-500',
                showFullImage ? 'cursor-zoom-out scale-[1.02]' : 'cursor-zoom-in'
              )}
              onClick={() => setShowFullImage(!showFullImage)}
            />

            {/* Premium Badge */}
            {wallpaper.is_premium && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-premium-gold to-amber-500 shadow-lg">
                <Crown className="w-4 h-4 text-bg-primary" />
                <span className="text-xs font-bold text-bg-primary uppercase tracking-wider">Premium</span>
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleLike}
                className={cn(
                  'p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg',
                  liked
                    ? 'bg-error text-white hover:bg-error/90'
                    : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                )}
              >
                <Heart weight={liked ? 'fill' : 'regular'} className={cn('w-5 h-5', isBouncing && 'animate-bounce')} />
              </button>
            </div>
          </div>

          {/* Right Column: Minimalist Details Section */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-6 md:p-8 overflow-y-auto">
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-lato text-text-primary mb-2">
                  {wallpaper.title}
                </h2>
                {wallpaper.categories && (
                  <p className="text-sm font-medium uppercase tracking-widest text-accent-primary">
                    {wallpaper.categories.name}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
                <span className="flex items-center gap-2" title="Likes">
                  <Heart weight={liked ? 'fill' : 'regular'} className={cn('w-4 h-4', liked && 'text-error')} />
                  {likeCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-2" title="Views">
                  <Eye className="w-4 h-4" />
                  {wallpaper.view_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-2" title="Downloads">
                  <Download className="w-4 h-4" />
                  {wallpaper.download_count.toLocaleString()}
                </span>
              </div>

              {wallpaper.description && (
                <p className="text-text-secondary text-base leading-relaxed">
                  {wallpaper.description}
                </p>
              )}

              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {wallpaper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors rounded-full border border-border-primary/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Actions at Bottom of Details */}
            <div className="mt-8 pt-6 border-t border-border-primary/50 flex flex-col gap-4 shrink-0">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-text-primary text-bg-primary rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download Free
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-bg-secondary text-text-primary border border-border-primary rounded-xl font-medium hover:bg-bg-hover transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share Wallpaper
              </button>
            </div>

            {/* Related Wallpapers (Minimal Grid) */}
            {related.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border-primary/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">
                  More like this
                </h3>
                <div
                  className="grid grid-cols-4 gap-3 md:gap-4"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    const card = target.closest('a');
                    if (card) {
                      e.preventDefault();
                      const id = card.getAttribute('href')?.replace('/wallpaper/', '');
                      if (id) handleRelatedClick(id);
                    }
                  }}
                >
                  {related.slice(0, 4).map((w) => (
                    <Link
                      key={w.id}
                      href={`/wallpaper/${w.id}`}
                      className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-bg-secondary cursor-pointer shadow-md"
                    >
                      <img
                        src={w.thumbnail_url || w.image_url}
                        alt={w.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-text-secondary">Wallpaper not found</p>
        </div>
      )}
    </Modal>
  );
}
