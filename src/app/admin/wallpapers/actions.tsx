/**
 * Admin Wallpaper Action Buttons
 * 
 * Client-side interactive buttons for the wallpapers list.
 * Extracted from page.tsx to keep the server component clean.
 */

'use client';

import { useState } from 'react';
import { toast } from '@/stores/toastStore';

export function ToggleFeaturedButton({
    id,
    isFeatured,
}: {
    id: string;
    isFeatured: boolean;
}) {
    const [featured, setFeatured] = useState(isFeatured);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/wallpapers/${id}/featured`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_featured: !featured }),
            });

            if (!response.ok) throw new Error('Failed to update');

            setFeatured(!featured);
            toast.success(featured ? 'Removed from featured' : 'Added to featured');
        } catch {
            toast.error('Failed to update featured status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 border ${featured
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                : 'bg-bg-tertiary text-text-secondary border-border-primary hover:bg-bg-hover hover:text-white hover:border-text-tertiary'
                }`}
            title={featured ? 'Remove from featured' : 'Add to featured'}
        >
            {featured ? '★ Featured' : '☆ Feature'}
        </button>
    );
}

export function DeleteWallpaperButton({
    id,
    title,
}: {
    id: string;
    title: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/wallpapers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            toast.success('Wallpaper deleted');
            window.location.reload();
        } catch {
            toast.error('Failed to delete wallpaper');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all duration-300 hover:bg-red-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.1)]"
            title="Delete wallpaper"
        >
            Delete
        </button>
    );
}
