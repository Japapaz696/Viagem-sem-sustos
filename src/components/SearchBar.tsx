'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import type { Country } from '@/types/country';

export default function SearchBar({
  countries,
  onSelectCountry,
  id = 'global-search',
  onQueryChange,
  onSearch,
  variant = 'default',
}: {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
  id?: string;
  onQueryChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  variant?: 'default' | 'hero';
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query, countries]);

  return (
    <div className={`relative mx-auto w-full ${variant === 'hero' ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <div className="relative">
        <div className={variant === 'hero'
          ? 'flex items-center gap-3 rounded-xl border-2 border-sky-200 bg-white p-1.5 shadow-lg focus-within:border-sky-400'
          : 'flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 shadow-[var(--shadow-soft)] transition-all hover:border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:shadow-[var(--shadow-md)]'}>
          <Search className={`ml-2 h-5 w-5 shrink-0 ${variant === 'hero' ? 'text-slate-500' : 'text-[var(--muted-soft)]'}`} aria-hidden="true" />
          <input
            ref={inputRef}
            id={id}
            type="search"
            value={query}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && results.length > 0) {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((current) => (current + 1) % results.length);
              } else if (event.key === 'ArrowUp' && results.length > 0) {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
              } else if (event.key === 'Enter' && open && activeIndex >= 0 && results[activeIndex]) {
                event.preventDefault();
                onSelectCountry(results[activeIndex]);
                setQuery('');
                setOpen(false);
                setActiveIndex(-1);
              } else if (event.key === 'Enter' && variant === 'hero') {
                event.preventDefault();
                onSearch?.(query);
                setOpen(false);
              }
            }}
            onChange={(e) => { setQuery(e.target.value); onQueryChange?.(e.target.value); setOpen(true); setActiveIndex(-1); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={variant === 'hero' ? 'Para onde você quer viajar?' : 'Pesquise destinos...'}
            className={`w-full bg-transparent font-medium outline-none ${variant === 'hero' ? 'min-w-0 py-3 text-base text-slate-900 placeholder:text-slate-500 sm:text-lg' : 'text-sm text-[var(--fg-strong)] placeholder:text-[var(--muted-soft)]'}`}
            aria-label="Buscar destino"
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open && results.length > 0}
            aria-controls={`${id}-results`}
            aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${results[activeIndex]?.id}` : undefined}
          />
          {variant === 'default' && <kbd className="hidden h-7 select-none items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-[10px] font-medium text-[var(--muted-soft)] md:inline-flex">⌘ K</kbd>}
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} aria-label="Limpar" className="text-[var(--muted-soft)] hover:text-[var(--fg-strong)] transition-colors"><X className="h-4 w-4" /></button>
          )}
          {variant === 'hero' && (
            <button type="button" onClick={() => { onSearch?.(query); setOpen(false); inputRef.current?.blur(); }}
              className="shrink-0 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent)] sm:px-7">
              Buscar destinos
            </button>
          )}
        </div>
        <AnimatePresence>
          {open && (results.length > 0 || query.trim()) && (
            <motion.ul
              id={`${id}-results`}
              role="listbox"
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute z-50 mt-3 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl shadow-[var(--shadow-md)]"
            >
              {results.length === 0 && (
                <li className="px-5 py-4 text-sm text-[#64748B] text-center">Nenhum destino encontrado.</li>
              )}
              {results.map((c, index) => (
                <li key={c.id} role="presentation">
                  <button
                    id={`${id}-option-${c.id}`}
                    type="button"
                    onMouseDown={() => { onSelectCountry(c); setQuery(''); setOpen(false); }}
                    role="option"
                    aria-selected={activeIndex === index}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-[var(--accent-soft)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
                  >
                    <span className="text-xl leading-none" aria-hidden="true">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-[var(--fg-strong)] truncate">{c.name}</span>
                      <span className="block text-xs text-[var(--muted)] truncate">{c.visa.description}</span>
                    </div>
                    <span className="text-[10px] font-medium text-[#94A3B8]">{c.visa.label}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
