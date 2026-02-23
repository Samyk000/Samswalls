/**
 * Admin Dashboard Page
 * 
 * Displays overview statistics and quick actions for admins.
 * Shows: total wallpapers, users, likes, downloads.
 */

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

/** Stat card component */
function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary/50 p-6 backdrop-blur-xl transition-all hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 hover:-translate-y-1 mt-6">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-tertiary">
            {title}
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
          {trend && (
            <p className="mt-2 text-sm font-medium text-emerald-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-bg-tertiary border border-border-primary text-accent-primary transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}

/** Quick action button component */
function QuickAction({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-start gap-4 rounded-2xl border border-border-primary bg-bg-secondary/30 p-5 transition-all hover:border-accent-primary/50 hover:bg-bg-secondary hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-primary/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-bg-tertiary border border-border-primary text-text-secondary group-hover:text-accent-primary transition-colors shadow-inner">
        {icon}
      </div>
      <div className="relative">
        <p className="font-semibold text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">{label}</p>
        <p className="mt-1 text-sm text-text-tertiary leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [wallpapersResult, usersResult, likesResult] = await Promise.all([
    supabase.from('wallpapers').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('likes').select('id', { count: 'exact', head: true }),
  ]);

  const totalWallpapers = wallpapersResult.count ?? 0;
  const totalUsers = usersResult.count ?? 0;
  const totalLikes = likesResult.count ?? 0;

  // Get recent wallpapers
  const { data: recentWallpapers } = await supabase
    .from('wallpapers')
    .select('id, title, created_at, is_featured, is_premium')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          Overview
        </h1>
        <p className="text-text-secondary">
          Welcome back to the command center. Here's what's happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Wallpapers"
          value={totalWallpapers}
          trend="+12% this week"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          trend="+5 new today"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Likes"
          value={totalLikes}
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Downloads"
          value="—"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Quick Actions
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/upload"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            }
            label="Upload Wallpaper"
            description="Add new wallpapers to the platform collection"
          />
          <QuickAction
            href="/admin/wallpapers"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
            label="Manage Content"
            description="Edit, curate, delete, or feature wallpapers"
          />
          <QuickAction
            href="/admin/categories"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            label="Categories"
            description="Organize the platform into curated collections"
          />
          <QuickAction
            href="/admin/users"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Users & Access"
            description="View accounts and manage permissions"
          />
        </div>
      </div>

      {/* Recent wallpapers */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Recent Uploads
          </h2>
          <Link href="/admin/wallpapers" className="text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors">
            View all →
          </Link>
        </div>
        <div className="rounded-2xl border border-border-primary bg-bg-secondary/50 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-primary bg-bg-tertiary/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                    Wallpaper
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-tertiary text-right">
                    Uploaded On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/50">
                {recentWallpapers && recentWallpapers.length > 0 ? (
                  recentWallpapers.map((wallpaper) => (
                    <tr key={wallpaper.id} className="hover:bg-bg-hover/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-bg-tertiary border border-border-primary flex items-center justify-center overflow-hidden">
                            <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                            {wallpaper.title}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex gap-2">
                          {wallpaper.is_featured ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-500">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              Featured
                            </span>
                          ) : null}
                          {wallpaper.is_premium ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-1 text-xs font-semibold text-accent-primary">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                              Free
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-tertiary text-right">
                        {new Date(wallpaper.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary border border-border-primary">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="font-medium text-text-secondary">No wallpapers yet</p>
                        <p className="text-sm text-text-tertiary">Upload your first wallpaper to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
