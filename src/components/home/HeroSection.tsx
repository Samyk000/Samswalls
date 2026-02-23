/**
 * Hero Section — Zen Immersive Split Design
 */

'use client';

import { useState, useEffect } from 'react';
import { useModalStore } from '@/stores/modalStore';
import { Compass } from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';

interface FeaturedWallpaper {
    id: string;
    title: string;
    image_url: string;
    thumbnail_url: string | null;
}

interface HeroSectionProps {
    featured: FeaturedWallpaper[];
}

export function HeroSection({ featured }: HeroSectionProps) {
    const { openModal } = useModalStore();

    // Top 5 images for the carousel
    const topImages = featured.slice(0, 5);

    // Initial state: ['s1', 's2', 's3', 's4', 's5']
    const [cardClasses, setCardClasses] = useState<string[]>(
        topImages.map((_, i) => `s${i + 1}`)
    );

    useEffect(() => {
        if (topImages.length === 0) return;
        const interval = setInterval(() => {
            setCardClasses(prev => {
                const nextClasses = [...prev];
                // shift classes down: s1 becomes s5, s2 becomes s1, etc.
                const first = nextClasses.shift()!;
                nextClasses.push(first);
                return nextClasses;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [topImages.length]);

    if (topImages.length === 0) return null;

    const handleClick = (id: string) => {
        openModal('wallpaper', { wallpaperId: id });
    };

    const handleExplore = () => {
        // Optionally open browse modal or scroll to trending
        openModal('browse');
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[75vh] md:min-h-[85vh] border-b border-border-primary overflow-hidden items-center">

            {/* Left Side: Typography & Text */}
            <div className="flex flex-col justify-center px-5 md:px-[5vw] py-[60px] pt-[80px] md:pt-[100px] lg:border-r border-border-primary/30 z-10 relative bg-bg-primary/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none order-2 lg:order-1 mt-10 lg:mt-0">
                <div className="flex w-fit items-center gap-4 bg-bg-secondary px-6 md:px-7 py-3 md:py-4 rounded-full border border-border-primary shadow-[0_10px_30px_var(--accent-glow)] mb-[30px] animate-fade-in-up">
                    <div className="breathe-dot shrink-0" />
                    <span className="text-text-muted font-light text-sm md:text-base">Zen Immersive Design</span>
                </div>

                <h1 className="serif text-4xl md:text-[clamp(3.5rem,5vw,5.5rem)] leading-[1.05] text-text-primary mb-[30px]">
                    <span className="block animate-slide-up-fade" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>Artistry in</span>
                    <span className="block animate-slide-up-fade text-accent-primary" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>Every Pixel.</span>
                </h1>

                <p className="font-lato text-text-muted max-w-sm text-base md:text-lg leading-relaxed animate-slide-up-fade" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                    Elevate your digital space with our curated collection of breathtaking, high-fidelity visual worlds.
                </p>

                <div className="mt-[40px] flex gap-4 animate-slide-up-fade" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
                    <button
                        onClick={handleExplore}
                        className="group flex items-center gap-2 px-8 py-3.5 bg-text-primary text-bg-primary rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.03] transition-transform active:scale-[0.98] drop-shadow-lg"
                    >
                        <Compass filter="drop-shadow(0 0 4px rgba(0,0,0,0.3))" weight="fill" className="w-5 h-5 text-bg-primary group-hover:animate-pulse" />
                        Explore
                    </button>
                </div>
            </div>

            {/* Right Side: 3D Fanning Stack */}
            <div className="relative bg-bg-primary flex items-center justify-center lg:justify-start lg:pl-[10%] overflow-hidden h-full min-h-[50vh] order-1 lg:order-2">
                {/* Ambient Stage Light */}
                <div className="absolute inset-0 bg-[var(--stage-glow)] z-0 pointer-events-none" />

                <div className="stack-container relative w-[clamp(240px,25vw,380px)] aspect-[9/16] perspective-[1200px] z-10 mx-auto lg:mx-0 translate-y-[20px] lg:translate-y-0">
                    {topImages.map((img, idx) => (
                        <div
                            key={img.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleClick(img.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleClick(img.id);
                                }
                            }}
                            className={`stack-card ${cardClasses[idx]} cursor-pointer`}
                        >
                            <img
                                src={img.thumbnail_url || img.image_url}
                                alt={img.title}
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable={false}
                            />
                            {/* Subtle Inner glow overlay to make 3D effect pop */}
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .stack-card {
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: -20px 30px 60px rgba(0, 0, 0, 0.4);
                    border: 4px solid var(--color-bg-secondary);
                    transform-origin: center center;
                    transition: all 1.5s var(--ease-apple);
                }

                [data-theme="dark"] .stack-card {
                    border-color: #2B2A27;
                    box-shadow: -20px 30px 60px rgba(0, 0, 0, 0.6);
                }

                .stack-card.s1 {
                    transform: translate(-10%, 0) scale(1) rotate(-3deg);
                    z-index: 5;
                    opacity: 1;
                }

                .stack-card.s2 {
                    transform: translate(25%, 0) scale(0.9) rotate(3deg);
                    z-index: 4;
                    opacity: 0.9;
                }

                .stack-card.s3 {
                    transform: translate(60%, 0) scale(0.8) rotate(9deg);
                    z-index: 3;
                    opacity: 0.7;
                }

                .stack-card.s4 {
                    transform: translate(95%, 0) scale(0.7) rotate(15deg);
                    z-index: 2;
                    opacity: 0.4;
                }

                .stack-card.s5 {
                    transform: translate(130%, 0) scale(0.6) rotate(21deg);
                    z-index: 1;
                    opacity: 0;
                }
                
                @media (max-width: 1024px) {
                    /* On mobile/tablet, center stack visually more */
                    .stack-container {
                        transform: translateX(-15%); /* Pull back slightly so stack fits on screen */
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .stack-card {
                        transition: opacity 0.5s ease;
                        transform: none !important;
                    }
                    .stack-card.s1 { z-index: 5; opacity: 1; }
                    .stack-card:not(.s1) { opacity: 0; z-index: 0; }
                }
            `}</style>
        </section>
    );
}
