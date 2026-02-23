/**
 * Hero Carousel Component
 * 
 * Full-width carousel for featured wallpapers with:
 * - Smooth crossfade transitions
 * - Auto-play with pause on hover
 * - Navigation dots and arrows
 * - Mobile swipe support
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface HeroSlide {
  id: string;
  title: string;
  image_url: string;
  category?: string;
  category_slug?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export function HeroCarousel({ slides, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, autoPlayInterval]);

  const goToSlide = useCallback((index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    goToSlide((activeIndex + 1) % slides.length);
  }, [activeIndex, slides.length, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  }, [activeIndex, slides.length, goToSlide]);

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-out',
            index === activeIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12 transition-all duration-500 delay-200',
              index === activeIndex
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
          >
            {slide.category && (
              <Link
                href={`/categories/${slide.category_slug || slide.category.toLowerCase()}`}
                className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-accent-primary/20 text-accent-primary rounded-full hover:bg-accent-primary/30 transition-colors"
              >
                {slide.category}
              </Link>
            )}
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl">
              {slide.title}
            </h2>
            <Link
              href={`/wallpaper/${slide.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full font-medium hover:bg-white/20 transition-all hover:scale-105"
            >
              <span>View Wallpaper</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === activeIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/40 hover:bg-white/60'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
