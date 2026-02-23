/**
 * Search Modal
 * 
 * Full-screen search overlay with:
 * - Instant search results
 * - Recent searches
 * - Keyboard navigation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from './Modal';
import { useModalStore } from '@/stores/modalStore';
import { createClient } from '@/lib/supabase/client';
import { Search, Clock, X, TrendingUp, Crown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  like_count: number;
}

const RECENT_SEARCHES_KEY = 'samswalls_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModalStore();

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search wallpapers
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchWallpapers = async () => {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('wallpapers')
        .select('id, title, image_url, thumbnail_url, is_premium, like_count')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .is('deleted_at', null)
        .order('like_count', { ascending: false })
        .limit(12);

      if (!error && data) {
        setResults(data as SearchResult[]);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchWallpapers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Save to recent searches
  const saveToRecent = useCallback((searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  // Handle result click
  const handleResultClick = useCallback((wallpaperId: string, searchQuery: string) => {
    saveToRecent(searchQuery);
    openModal('wallpaper', { wallpaperId });
  }, [openModal, saveToRecent]);

  // Handle recent search click
  const handleRecentClick = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      className="p-0"
    >
      <div className="p-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wallpapers..."
            className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-primary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results / Recent */}
      <div className="max-h-[60vh] overflow-auto px-4 pb-4">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Search Results */}
        {!loading && query && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.id, query)}
                className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-bg-secondary"
              >
                <img
                  src={result.thumbnail_url || result.image_url}
                  alt={result.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Premium Badge */}
                {result.is_premium && (
                  <div className="absolute top-2 left-2 p-1 rounded-full bg-premium-gold">
                    <Crown className="w-3 h-3 text-bg-primary" />
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white line-clamp-1">{result.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No wallpapers found for "{query}"</p>
          </div>
        )}

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-text-tertiary hover:text-text-primary"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleRecentClick(search)}
                  className="px-3 py-1.5 bg-bg-secondary text-text-secondary rounded-full text-sm hover:text-text-primary transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending (when no query and no recent) */}
        {!query && recentSearches.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary text-sm">
              Start typing to search for wallpapers
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
