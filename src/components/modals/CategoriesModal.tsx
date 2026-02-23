/**
 * Categories Modal
 * 
 * Full-screen modal showing all categories in a grid.
 */

'use client';

import { useState, useEffect } from 'react';
import { FullScreenModal } from './Modal';
import { useModalStore } from '@/stores/modalStore';
import { getCategoriesWithImages } from '@/app/actions/categories';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModalStore();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getCategoriesWithImages().then((data) => {
        setCategories(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleCategoryClick = (slug: string) => {
    // Open browse modal with category filter
    openModal('browse', { categorySlug: slug });
  };

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Categories"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Browse by Category</h2>
            <p className="text-sm text-text-tertiary">Find your perfect style</p>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-bg-secondary animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-bg-secondary"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image */}
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-accent-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {category.image_count || 0} wallpapers
                  </p>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-accent-primary/50 transition-all" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">No categories available</p>
          </div>
        )}
      </div>
    </FullScreenModal>
  );
}
