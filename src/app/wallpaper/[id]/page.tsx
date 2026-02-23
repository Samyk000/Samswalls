/**
 * Wallpaper Detail Page (Fallback)
 * 
 * This page serves as a fallback for direct links and SEO.
 * In the SPA experience, wallpapers open in a modal instead.
 */

import { notFound } from 'next/navigation';
import { getWallpaperById } from '@/app/actions/wallpapers';
import { WallpaperDetail } from './WallpaperDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const wallpaper = await getWallpaperById(id);

  if (!wallpaper) {
    return {
      title: 'Wallpaper Not Found',
    };
  }

  return {
    title: wallpaper.title,
    description: wallpaper.description || `Download ${wallpaper.title} wallpaper`,
    openGraph: {
      title: `${wallpaper.title} | Sam's Walls`,
      description: wallpaper.description || `Download ${wallpaper.title} wallpaper`,
      images: [wallpaper.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wallpaper.title} | Sam's Walls`,
      description: wallpaper.description || `Download ${wallpaper.title} wallpaper`,
      images: [wallpaper.image_url],
    },
  };
}

export default async function WallpaperPage({ params }: PageProps) {
  const { id } = await params;
  const wallpaper = await getWallpaperById(id);

  if (!wallpaper) {
    notFound();
  }

  return <WallpaperDetail wallpaper={wallpaper} />;
}
