/**
 * Favorites Page
 * 
 * Displays user's saved/favorited wallpapers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Loader2,
  Grid3X3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useModalStore } from '@/stores/modalStore';

interface FavoriteWallpaper {
  id: string;
  wallpaper_id: string;
  created_at: string;
  wallpaper: {
    id: string;
    title: string;
    image_url: string;
    thumbnail_url: string | null;
    is_premium: boolean;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { openModal } = useModalStore();
  const [favorites, setFavorites] = useState<FavoriteWallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/favorites');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/favorites');
      // const data = await response.json();
      // setFavorites(data.data);
      
      // For now, use empty array
      setFavorites([]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWallpaperClick = (wallpaperId: string) => {
    openModal('wallpaper', { wallpaperId });
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
            <Heart className="w-4 h-4" />
            <span className="text-sm">{favorites.length} saved</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">My Favorites</h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-bg-secondary">
                <button
                  onClick={() => handleWallpaperClick(favorite.wallpaper.id)}
                  className="w-full h-full"
                >
                  <img
                    src={favorite.wallpaper.thumbnail_url || favorite.wallpaper.image_url}
                    alt={favorite.wallpaper.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm font-medium text-white truncate">
                    {favorite.wallpaper.title}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <Heart className="w-4 h-4 text-error fill-current" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No favorites yet
            </h3>
            <p className="text-text-secondary mb-6">
              Start exploring and save wallpapers you love!
            </p>
            <button
              onClick={() => openModal('browse')}
              className="px-6 py-2.5 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              Browse Wallpapers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
