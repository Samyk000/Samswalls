/**
 * Admin Wallpapers List Page
 * 
 * Displays a table of all wallpapers with:
 * - Thumbnail preview
 * - Title, category, status
 * - Edit, delete, toggle featured actions
 */

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ToggleFeaturedButton, DeleteWallpaperButton } from './actions';

export default async function WallpapersPage() {
  const supabase = await createClient();

  // Fetch wallpapers with category
  const { data: wallpapers, error } = await supabase
    .from('wallpapers')
    .select(`
      id,
      title,
      image_url,
      is_premium,
      is_featured,
      view_count,
      like_count,
      created_at,
      category_id,
      categories ( name )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wallpapers:', error);
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
            Wallpapers
          </h1>
          <p className="text-text-secondary">
            Manage your entire wallpaper collection.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white font-medium rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload New
        </Link>
      </div>

      {/* Wallpapers table */}
      <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-primary bg-bg-tertiary/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Preview
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Wallpaper
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Stats
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                  Created
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50">
              {wallpapers && wallpapers.length > 0 ? (
                wallpapers.map((wallpaper) => {
                  // Handle categories - Supabase returns it as an object or array
                  const cat = wallpaper.categories as { name: string } | { name: string }[] | null;
                  const categoryName = cat
                    ? (Array.isArray(cat) ? cat[0]?.name : cat.name) || 'Uncategorized'
                    : 'Uncategorized';

                  return (
                    <tr key={wallpaper.id} className="hover:bg-bg-hover/50 transition-colors group">
                      {/* Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="h-16 w-24 overflow-hidden rounded-lg border border-border-primary bg-bg-tertiary">
                          <img
                            src={wallpaper.image_url}
                            alt={wallpaper.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {wallpaper.title}
                        </p>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                        <span className="inline-flex items-center rounded-md bg-bg-tertiary border border-border-primary px-2.5 py-1">
                          {categoryName}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {wallpaper.is_featured && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 text-xs font-semibold text-amber-500">
                              Featured
                            </span>
                          )}
                          {wallpaper.is_premium ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 px-2 text-xs font-semibold text-accent-primary">
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 text-xs font-semibold text-emerald-500">
                              Free
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Stats */}
                      <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                        <div className="flex gap-4">
                          <span title="Views" className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {wallpaper.view_count}
                          </span>
                          <span title="Likes" className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            {wallpaper.like_count}
                          </span>
                        </div>
                      </td>
                      {/* Created */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-tertiary">
                        {new Date(wallpaper.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <ToggleFeaturedButton
                            id={wallpaper.id}
                            isFeatured={wallpaper.is_featured}
                          />
                          <DeleteWallpaperButton
                            id={wallpaper.id}
                            title={wallpaper.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary border border-border-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xl font-bold text-text-primary">
                        No wallpapers yet
                      </p>
                      <p className="text-text-secondary max-w-sm">
                        Get started by uploading your first high-quality wallpaper to the platform.
                      </p>
                      <Link
                        href="/admin/upload"
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-accent-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover shadow-lg shadow-accent-primary/20"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Wallpaper
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
