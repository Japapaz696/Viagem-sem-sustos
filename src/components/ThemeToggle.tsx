'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Palette, Icon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggle, resolvedMode, mounted } = useTheme();
  const isSystem = theme === 'system';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isSystem ? 'Alternar entre tema claro e escuro' : theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] backdrop-blur-sm transition-all hover:bg-[var(--surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:border-white/10 dark:hover:bg-white/20 dark:text-slate-200"
    >
      {!mounted ? (
        <Moon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
      ) : resolvedMode === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-300" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
      )}
    </button>
  );
}