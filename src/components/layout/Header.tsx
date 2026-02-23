/**
 * Header Component
 * 
 * Elegant Zen Immersive header:
 * - Serif Logo with soft pulse spark
 * - Underline animated nav links
 * - Phosphor icons
 * - App auth & modal integrations retained
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useModalStore } from '@/stores/modalStore';
import {
  List,
  X,
  Sun,
  Moon,
  User,
  SignOut,
  Heart,
  MagnifyingGlass,
  SquaresFour,
  Stack,
  House,
  Crown,
  ShieldCheck
} from '@phosphor-icons/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { user, profile, loading, signOut } = useAuth();
  const { openModal } = useModalStore();

  useEffect(() => {
    // Check initial theme from document
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const openSearch = () => openModal('search');
  const openBrowse = () => openModal('browse');
  const openCategories = () => openModal('categories');
  const openAuth = () => openModal('auth');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-primary/50 bg-bg-primary/80 backdrop-blur-xl px-5 md:px-[5vw] py-4 md:py-6 flex justify-between items-center transition-colors duration-800">

      {/* Brand Logo */}
      <Link href="/" className="brand serif text-text-primary hover:opacity-80 transition-opacity">
        <span className="brand-spark">✦</span> Samswall.
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10">
        <nav className="flex items-center gap-8 text-[0.75rem] uppercase tracking-[0.15em] font-bold font-lato text-text-secondary">
          <Link href="/" className="text-text-primary relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-text-primary">
            Home
          </Link>
          <button onClick={openBrowse} className="hover:text-text-primary transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-text-primary after:transition-all after:duration-400">
            Browse
          </button>
          <button onClick={openCategories} className="hover:text-text-primary transition-colors relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-text-primary after:transition-all after:duration-400">
            Categories
          </button>
        </nav>
        <button onClick={openSearch} className="icon-btn ml-2" title="Search">
          <MagnifyingGlass weight="regular" />
        </button>
      </div>

      {/* Actions */}
      <div className="actions flex items-center gap-4 md:gap-6">
        {/* Mobile Search */}
        <button onClick={openSearch} className="md:hidden icon-btn" title="Search">
          <MagnifyingGlass weight="regular" />
        </button>

        <button onClick={openAuth} className="icon-btn hidden sm:flex" title="Premium Access">
          <Crown weight="fill" className="crown text-premium-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] transition-all hover:scale-110" />
        </button>

        <button onClick={toggleTheme} className="icon-btn" id="themeToggle" title="Toggle Lighting">
          {theme === 'dark' ? <Sun weight="regular" /> : <Moon weight="regular" />}
        </button>

        {/* Auth Section */}
        {!loading && (
          <div className="hidden md:block relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-accent-muted text-white font-bold text-sm shadow-md transition-transform hover:scale-105"
                >
                  {user.email?.[0].toUpperCase() || 'U'}
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-48 bg-bg-secondary border border-border-primary rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-modal-scale-in">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                      >
                        <User weight="regular" className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                      >
                        <Heart weight="regular" className="w-4 h-4" />
                        Favorites
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
                        >
                          <ShieldCheck weight="regular" className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-border-primary my-1 mx-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <SignOut weight="regular" className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="btn-signin"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden icon-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X weight="regular" /> : <List weight="regular" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-bg-secondary border-b border-border-primary shadow-xl animate-slide-in-right z-40">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <House weight="regular" className="w-5 h-5" />
              Home
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); openBrowse(); }}
              className="flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <SquaresFour weight="regular" className="w-5 h-5" />
              Browse
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); openCategories(); }}
              className="flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <Stack weight="regular" className="w-5 h-5" />
              Categories
            </button>

            <div className="border-t border-border-primary my-2 mx-2" />

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <User weight="regular" className="w-5 h-5" />
                  Profile
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <Heart weight="regular" className="w-5 h-5" />
                  Favorites
                </Link>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
                  >
                    <ShieldCheck weight="regular" className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
                >
                  <SignOut weight="regular" className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuth(); }}
                className="mx-2 mt-2 py-3 rounded-full bg-text-primary text-bg-primary font-bold text-sm tracking-widest uppercase transition-transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
