'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextValue {
  resolvedMode: 'light' | 'dark';
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getTimeMode(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const updateTheme = () => {
      clearTimeout(timer);
      const nextMode = getTimeMode();
      setResolvedMode(nextMode);
      document.documentElement.classList.toggle('dark', nextMode === 'dark');
      timer = setTimeout(updateTheme, 60_000);
    };
    updateTheme();
    setMounted(true);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') updateTheme();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ resolvedMode, mounted }}>
      <script
        dangerouslySetInnerHTML={{
          __html: "(function(){var h=new Date().getHours();document.documentElement.classList.toggle('dark',h<6||h>=18)})();",
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
