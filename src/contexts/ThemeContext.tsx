'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedMode: 'light' | 'dark';
  setTheme: (t: Theme) => void;
  toggle: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'viagem-sem-susto-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  const getSystem = (): 'light' | 'dark' =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const resolvedMode: 'light' | 'dark' = theme === 'system' ? getSystem() : theme;

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    setThemeState(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement.classList;
    const dark = resolvedMode === 'dark';
    html.toggle('dark', dark);
  }, [resolvedMode, mounted]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, t);
    }
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = resolvedMode === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, [resolvedMode]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedMode, setTheme, toggle, mounted }}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var m=t==='dark'||(t===null||t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(m)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
