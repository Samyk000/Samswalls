/**
 * Admin Layout Component
 * 
 * Provides a consistent layout for all admin pages with:
 * - Sidebar navigation
 * - Header with user info
 * - Mobile responsive design
 * 
 * Protected by middleware - only accessible to authenticated users.
 */

import Link from 'next/link';
import { ReactNode } from 'react';

/** Navigation items for admin sidebar */
const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Upload',
    href: '/admin/upload',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Wallpapers',
    href: '/admin/wallpapers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Sidebar background (glass effect) */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border-primary bg-bg-secondary/50 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border-primary px-6">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-purple-600 shadow-lg shadow-accent-primary/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 h-[calc(100vh-130px)] overflow-y-auto">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-text-tertiary">
            Platform Management
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-hover hover:text-white hover:shadow-sm"
            >
              <div className="text-text-tertiary group-hover:text-accent-primary transition-colors">
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to site link */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border-primary p-4 bg-bg-secondary/30 backdrop-blur-md">
          <Link
            href="/"
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary bg-bg-primary/50 px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-white"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit to Platform
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-primary bg-bg-primary/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">
              Command Center
            </h1>
            <div className="h-4 w-px bg-border-primary mx-2" />
            <span className="text-sm font-medium text-accent-primary flex items-center gap-1.5 bg-accent-primary/10 px-2.5 py-1 rounded-full border border-accent-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-primary hover:border-accent-primary/50 hover:bg-accent-primary/10 transition-colors text-sm text-text-secondary hover:text-white"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                A
              </div>
              Admin Console
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
