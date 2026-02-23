import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const getSystemPreference = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return null;
};

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark',
  
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    set({ theme: newTheme });
  },
  
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  
  initializeTheme: () => {
    const storedTheme = getStoredTheme();
    const theme = storedTheme || getSystemPreference();
    applyTheme(theme);
    set({ theme });
    
    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if no stored preference
        if (!getStoredTheme()) {
          const newTheme = e.matches ? 'dark' : 'light';
          applyTheme(newTheme);
          set({ theme: newTheme });
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
    }
  },
}));