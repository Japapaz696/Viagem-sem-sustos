'use client';

import { useMemo, useState, useEffect } from 'react';
import countriesData from '@/data/countries.json';
import type { Country } from '@/types/country';
import SearchBar from '@/components/SearchBar';
import DestinationCard from '@/components/DestinationCard';
import FilterChips from '@/components/FilterChips';
import Navbar from '@/components/Navbar';
import DestinationDetail from '@/components/DestinationDetail';
import ThemeToggle from '@/components/ThemeToggle';
import SideSheet from '@/components/SideSheet';
import MapView from '@/components/MapView';
import AIAssistant from '@/components/AIAssistant';
import SettingsPanel from '@/components/SettingsPanel';
import SavedPanel from '@/components/SavedPanel';
import PlanejarViagem from '@/components/PlanejarViagem';
import Checklist from '@/components/Checklist';
import CompararDestinos from '@/components/CompararDestinos';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, Search, ShieldCheck } from 'lucide-react';

const countries = countriesData as Country[];
const SOUTH_AMERICA = new Set(['ar', 'cl', 'co', 'uy', 'br']);

function applyFilter(list: Country[], filter: string): Country[] {
  switch (filter) {
    case 'exempt': return list.filter((c) => c.visa.type === 'exempt');
    case 'evisa': return list.filter((c) => c.visa.type === 'evisa' || c.visa.type === 'arrival');
    case 'south-america': return list.filter((c) => SOUTH_AMERICA.has(c.id));
    case 'schengen': return list.filter((c) => c.keywords.includes('schengen'));
    default: return list;
  }
}

const SAVED_KEY = 'viagem-sem-susto-saved';

export default function Home() {
  const [selected, setSelected] = useState<Country | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('explore');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(saved)));
    } catch { /* ignore */ }
  }, [saved]);

  const filtered = useMemo(() => {
    let list = applyFilter(countries, filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.toLowerCase().includes(q)));
    return list;
  }, [filter, query]);

  const savedCountries = useMemo(() => countries.filter((c) => saved.has(c.id)), [saved]);

  function handleSelect(country: Country) {
    setSelected(country);
    setSideOpen(true);
  }

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function closeSide() {
    setSideOpen(false);
    setTimeout(() => setSelected(null), 300);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent-soft)] md:flex">
      <Navbar active={activeTab} onChange={(tab) => { setActiveTab(tab); setSideOpen(false); setSelected(null); }} />

      <main className="md:flex-1 pt-6 pb-24 md:pb-6 min-h-screen bg-[var(--bg)] min-w-0">
        {/* Header integrado */}
        <header className="sticky top-0 z-30 px-6 md:px-10 pt-3 pb-4 flex items-center justify-between gap-4 bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-[var(--accent)]">
              <Plane className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight leading-tight text-[var(--fg-strong)]">ViagemSemSusto</h1>
              <p className="text-[10px] text-[var(--muted)] font-medium">Seu guia de viagem e visto</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <SearchBar
              countries={countries}
              onSelectCountry={(c) => {
                setQuery(c.name);
                handleSelect(c);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button type="button" className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg-strong)] hover:bg-[var(--accent-soft)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40" aria-label="Perfil">
              <ShieldCheck className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="px-4 md:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto">
          {/* Mobile Search (visível apenas em mobile) */}
          <div className="mb-6 md:hidden">
            <SearchBar
              countries={countries}
              onSelectCountry={(c) => {
                setQuery(c.name);
                handleSelect(c);
              }}
            />
          </div>

          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <>
              <div className="mb-6">
                <FilterChips active={filter} onChange={setFilter} />
              </div>

              <section className="mb-6 max-w-[1400px] mx-auto">
                <h2 className="flex items-end justify-between mb-6 text-lg font-bold tracking-tight text-[var(--fg-strong)]">
                  <span className="text-[var(--accent)]">Os destinos que você precisa comparar primeiro.</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--accent-soft)] px-2 py-1 rounded-full hidden sm:inline-block">
                    Planejador abaixo
                  </span>
                </h2>
              </section>

              <motion.div
                layout
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((c, i) => (
                    <DestinationCard
                      key={c.id}
                      country={c}
                      onSelect={handleSelect}
                      saved={saved.has(c.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <div className="mt-8 rounded-card border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
                  Nenhum destino encontrado para os filtros aplicados.
                </div>
              )}

              {/* Disclaimer sobre fontes oficiais */}
              <div className="mt-6 rounded-card border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--muted)]">
                <p>⚠️ Requisitos podem mudar. Confirme em fontes oficiais (consulados, embaixadas, IATA) antes de viajar.</p>
              </div>
            </>
          )}

          {/* Destinations Tab */}
          {activeTab === 'destinations' && (
            <div className="relative">
              <div className="rounded-card overflow-hidden border border-[var(--border)]">
                <MapView selected={selected} onSelect={handleSelect} />
              </div>
              <AIAssistant />
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <SavedPanel
              savedCountries={savedCountries}
              onSelect={handleSelect}
              saved={saved}
              onToggleSave={toggleSave}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsPanel />
          )}

          {/* Planejar Tab */}
          {activeTab === 'planejar' && (
            <PlanejarViagem />
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <Checklist />
          )}

          {/* Comparar Tab */}
          {activeTab === 'comparar' && (
            <CompararDestinos />
          )}
        </div>
      </main>

      <SideSheet open={sideOpen} onClose={closeSide} title={selected?.name}>
        {selected && <DestinationDetail country={selected} />}
      </SideSheet>
    </div>
  );
}
