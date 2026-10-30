'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import type { Country } from '@/types/country';

export default function SearchBar({
  countries,
  onSelectCountry,
  id = 'global-search',
}: {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
  id?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
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
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 shadow-[var(--shadow-soft)] transition-all hover:border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:shadow-[var(--shadow-md)]">
          <Search className="h-4 w-4 text-[var(--muted-soft)] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id={id}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Pesquise destinos..."
            className="w-full bg-transparent text-sm font-medium text-[var(--fg-strong)] placeholder:text-[var(--muted-soft)] outline-none"
            aria-label="Buscar destino"
            aria-autocomplete="list"
            aria-expanded={open && results.length > 0}
            aria-controls={`${id}-results`}
          />
          <kbd className="hidden md:inline-flex h-7 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-[10px] font-medium text-[var(--muted-soft)] select-none">⌘ K</kbd>
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} aria-label="Limpar" className="text-[var(--muted-soft)] hover:text-[var(--fg-strong)] transition-colors"><X className="h-4 w-4" /></button>
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
              {results.map((c) => (
                <li key={c.id} role="presentation">
                  <button
                    type="button"
                    onMouseDown={() => { onSelectCountry(c); setQuery(''); setOpen(false); }}
                    role="option"
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
