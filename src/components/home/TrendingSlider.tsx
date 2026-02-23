/**
 * TrendingSlider Component
 *
 * Horizontal scrolling slider for Trending Wallpapers.
 * Supports mouse drag-to-scroll and touch scrolling.
 * Reuses the WallpaperCard component for 100% UI consistency.
 */

'use client';

import { useRef, useState } from 'react';
import { WallpaperCard } from './WallpaperGrid';
import type { WallpaperCardData } from './WallpaperGrid';

interface TrendingSliderProps {
    wallpapers: WallpaperCardData[];
}

export function TrendingSlider({ wallpapers }: TrendingSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    if (wallpapers.length === 0) return null;

    // Mouse drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        setIsDragging(false);
        sliderRef.current.classList.add('grabbing');
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        if (!sliderRef.current) return;
        setIsDown(false);
        setIsDragging(false);
        sliderRef.current.classList.remove('grabbing');
    };

    const onMouseUp = () => {
        if (!sliderRef.current) return;
        setIsDown(false);
        sliderRef.current.classList.remove('grabbing');
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault();
        setIsDragging(true);
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast multiplier
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleClickCapture = (e: React.MouseEvent) => {
        if (isDragging) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return (
        <div className="slider-wrapper mb-16 relative">
            <div
                ref={sliderRef}
                className="slider flex gap-5 md:gap-8 overflow-x-auto px-5 md:px-[5vw] pb-10"
                style={{ scrollSnapType: isDown ? 'none' : 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onClickCapture={handleClickCapture}
            >
                {wallpapers.map((img, idx) => (
                    <div
                        key={img.id}
                        className="w-[260px] md:w-[320px] shrink-0 snap-start"
                    >
                        <WallpaperCard wallpaper={img} index={idx} />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .slider::-webkit-scrollbar {
                    display: none;
                }
                .grabbing {
                    cursor: grabbing !important;
                    scroll-behavior: auto !important;
                }
            `}</style>
        </div>
    );
}
