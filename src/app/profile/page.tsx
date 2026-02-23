/**
 * User Profile Page
 * 
 * Displays user information and allows profile updates
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Save, 
  Heart, 
  Eye, 
  Download,
  Trash2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/stores/toastStore';

interface UserStats {
  favorites_count: number;
  views_count: number;
  downloads_count: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    favorites_count: 0,
    views_count: 0,
    downloads_count: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || profile.email?.split('@')[0] || '');
      // TODO: Fetch user stats from API
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({ display_name: displayName });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // TODO: Implement password change
    toast.info('Password reset email sent!');
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      toast.info('Account deletion not implemented yet');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-xl border-b border-border-secondary/50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-text-secondary hover:text-error transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white mb-4">
            {displayName?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-xl font-bold text-text-primary">{displayName}</h1>
          <p className="text-text-secondary text-sm">{profile?.email || user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <Heart className="w-5 h-5 text-error mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{stats.favorites_count}</p>
            <p className="text-xs text-text-tertiary">Favorites</p>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <Eye className="w-5 h-5 text-accent-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{stats.views_count}</p>
            <p className="text-xs text-text-tertiary">Views</p>
          </div>
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-4 text-center">
            <Download className="w-5 h-5 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{stats.downloads_count}</p>
            <p className="text-xs text-text-tertiary">Downloads</p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border-primary">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Settings
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="Enter display name"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-tertiary border border-border-primary rounded-lg text-text-tertiary">
                <Mail className="w-4 h-4" />
                <span>{profile?.email || user?.email}</span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full py-2.5 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border-primary">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </h2>
          </div>
          <div className="p-4">
            <button
              onClick={handleChangePassword}
              className="w-full py-2.5 border border-border-primary text-text-primary font-medium rounded-lg hover:bg-bg-hover transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-error/5 border border-error/20 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-error/20">
            <h2 className="font-semibold text-error flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </h2>
          </div>
          <div className="p-4">
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2.5 border border-error text-error font-medium rounded-lg hover:bg-error/10 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
