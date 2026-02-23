/**
 * Authentication Context Provider
 * 
 * Provides authentication state and methods to the entire application.
 * Uses Supabase Auth for session management.
 * 
 * Usage:
 * ```tsx
 * // In layout.tsx (root layout)
 * import { AuthProvider } from '@/contexts/AuthContext';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * 
 * // In any client component
 * import { useAuth } from '@/contexts/AuthContext';
 * 
 * function MyComponent() {
 *   const { user, loading, signOut } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   
 *   return user ? (
 *     <button onClick={signOut}>Sign Out</button>
 *   ) : (
 *     <Link href="/login">Sign In</Link>
 *   );
 * }
 * ```
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

/** Extended user profile from database */
interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  is_banned: boolean;
  is_verified: boolean;
}

/** Auth context type definition */
interface AuthContextType {
  /** Current authenticated user or null */
  user: User | null;
  /** User profile from database */
  profile: UserProfile | null;
  /** Loading state - true while checking session */
  loading: boolean;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Update user profile */
  updateProfile: (data: { display_name?: string }) => Promise<void>;
  /** Refresh profile data */
  refreshProfile: () => Promise<void>;
}

/** Default context value */
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

/**
 * Auth Provider Component
 * Wraps the application to provide auth state and methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient();

  /** Fetch user profile from database */
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [supabase]);

  /** Refresh profile data */
  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase.auth, fetchProfile]);

  /** Sign out the current user */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase.auth]);

  /** Update user profile */
  const updateProfile = useCallback(async (data: { display_name?: string }) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile after update
    await refreshProfile();
  }, [user, supabase, refreshProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context - must be used within AuthProvider */
export const useAuth = () => useContext(AuthContext);
