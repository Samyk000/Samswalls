/**
 * Browse Modal
 * 
 * Full-screen modal for browsing wallpapers with:
 * - Category filter
 * - Sort options
 * - Infinite scroll
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FullScreenModal } from './Modal';
import { WallpaperGrid, WallpaperGridSkeleton } from '@/components/home/WallpaperGrid';
import { useModalStore } from '@/stores/modalStore';
import { getTrendingWallpapers, getLatestWallpapers, getWallpapersByCategory } from '@/app/actions/wallpapers';
import { getCategories } from '@/app/actions/categories';
import { Filter, SortAsc, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

type SortOption = 'newest' | 'trending' | 'downloads';

export function BrowseModal({ isOpen, onClose, initialCategory }: BrowseModalProps) {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { openModal } = useModalStore();

  // Fetch categories on mount
  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories);
    }
  }, [isOpen]);

  // Fetch wallpapers when filters change
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    
    const fetchWallpapers = async () => {
      let data;
      
      if (selectedCategory) {
        data = await getWallpapersByCategory(selectedCategory);
      } else {
        switch (sortBy) {
          case 'trending':
            data = await getTrendingWallpapers(24);
            break;
          case 'newest':
          default:
            data = await getLatestWallpapers(24);
            break;
        }
      }
      
      setWallpapers(data);
      setLoading(false);
    };

    fetchWallpapers();
  }, [isOpen, selectedCategory, sortBy]);

  // Handle wallpaper click
  const handleWallpaperClick = useCallback((wallpaperId: string) => {
    openModal('wallpaper', { wallpaperId });
  }, [openModal]);

  // Handle category click
  const handleCategoryClick = useCallback((slug: string) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
    setShowFilters(false);
  }, [selectedCategory]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'trending', label: 'Trending' },
    { value: 'downloads', label: 'Most Downloaded' },
  ];

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Browse Wallpapers"
    >
      <div className="p-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              showFilters || selectedCategory
                ? 'bg-accent-primary text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {selectedCategory && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-bg-secondary text-text-primary text-sm font-medium px-4 py-2 pr-10 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          </div>

          {/* Active Category Filter */}
          {selectedCategory && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 text-accent-primary rounded-full text-sm">
              <span>{categories.find(c => c.slug === selectedCategory)?.name}</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-0.5 hover:bg-accent-primary/20 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-bg-secondary rounded-2xl animate-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category.slug
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wallpapers Grid */}
        {loading ? (
          <WallpaperGridSkeleton count={12} />
        ) : wallpapers.length > 0 ? (
          <div onClick={(e) => {
            const target = e.target as HTMLElement;
            const card = target.closest('a');
            if (card) {
              e.preventDefault();
              const id = card.getAttribute('href')?.replace('/wallpaper/', '');
              if (id) handleWallpaperClick(id);
            }
          }}>
            <WallpaperGrid wallpapers={wallpapers} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">No wallpapers found</p>
          </div>
        )}
      </div>
    </FullScreenModal>
  );
}
