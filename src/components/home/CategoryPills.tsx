/**
 * Category Pills Component
 * 
 * Quick navigation pills for categories
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import {
  Palette,
  Mountain,
  Minus,
  Moon,
  Sparkles,
  Rocket,
  Building2,
  PawPrint,
  MoreHorizontal
} from 'lucide-react';

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'abstract': <Palette className="w-4 h-4" />,
  'nature': <Mountain className="w-4 h-4" />,
  'minimal': <Minus className="w-4 h-4" />,
  'dark': <Moon className="w-4 h-4" />,
  'gradient': <Sparkles className="w-4 h-4" />,
  'space': <Rocket className="w-4 h-4" />,
  'architecture': <Building2 className="w-4 h-4" />,
  'animals': <PawPrint className="w-4 h-4" />,
};

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryPillsProps {
  categories: Category[];
}

export function CategoryPills({ categories }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.slice(0, 8).map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-bg-secondary border border-border-primary',
            'text-sm text-text-secondary font-medium',
            'hover:bg-bg-hover hover:text-text-primary hover:border-accent-primary/30',
            'transition-all duration-200'
          )}
        >
          {categoryIcons[category.slug] || <Sparkles className="w-4 h-4" />}
          {category.name}
        </Link>
      ))}

      {categories.length > 8 && (
        <Link
          href="/categories"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-accent-primary/10 border border-accent-primary/30',
            'text-sm text-accent-primary font-medium',
            'hover:bg-accent-primary/20',
            'transition-all duration-200'
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
          More
        </Link>
      )}
    </div>
  );
}
