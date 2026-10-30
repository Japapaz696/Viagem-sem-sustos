'use client';

import { useMemo, useState, useEffect } from 'react';
import countriesData from '@/data/countries.json';
import type { Country } from '@/types/country';
import SearchBar from '@/components/SearchBar';
import DestinationCard from '@/components/DestinationCard';
import FilterChips from '@/components/FilterChips';
import Navbar from '@/components/Navbar';
import DestinationDetail from '@/components/DestinationDetail';
import SideSheet from '@/components/SideSheet';
import DestinationsExplorer from '@/components/DestinationsExplorer';
import SettingsPanel from '@/components/SettingsPanel';
import SavedPanel from '@/components/SavedPanel';
import PlanejarViagem from '@/components/PlanejarViagem';
import Checklist from '@/components/Checklist';
import CompararDestinos from '@/components/CompararDestinos';
import HeroFlightAnimation from '@/components/HeroFlightAnimation';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import { MenuToggle } from '@/components/Navbar';

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
  const [navOpen, setNavOpen] = useState(false);

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
    // No desktop (lg:), o painel lateral é mostrado; no mobile, abre o SideSheet
    if (window.innerWidth < 1024) {
      setSideOpen(true);
    }
  }

  function handleDestinationSelect(country: Country) {
    setSelected(country);
    setSideOpen(false);
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
      <Navbar active={activeTab} open={navOpen} onClose={() => setNavOpen(false)} onChange={(tab) => { setActiveTab(tab); setSideOpen(false); setSelected(null); setQuery(''); }} />

      <main className="min-h-screen min-w-0 flex-1 bg-[var(--bg)] pb-24 md:pb-8">
        {activeTab !== 'explore' && <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 md:px-8">
          <div className="flex items-center gap-3">
            <MenuToggle open={navOpen} onClick={() => setNavOpen((value) => !value)} />
            <BrandLogo />
          </div>
        </header>}

        {activeTab === 'explore' && (
          <section className="relative isolate overflow-hidden bg-[#0D4B78] text-white">
            <HeroFlightAnimation />
            <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-14 pt-4 md:px-10 md:pb-16 md:pt-5">
              <div className="mb-9 flex items-center gap-3">
                <MenuToggle open={navOpen} onClick={() => setNavOpen((value) => !value)} inverse />
                <BrandLogo inverse />
              </div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] sm:text-4xl md:text-[44px] md:leading-[1.12]">
                Encontre seu próximo destino com tranquilidade
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100 sm:text-base">
                Pesquise um país e confira o que preparar antes de viajar.
              </p>
              <div className="mt-7">
                <SearchBar
                  id="explore-destination-search"
                  variant="hero"
                  countries={countries}
                  onQueryChange={setQuery}
                  onSearch={setQuery}
                  onSelectCountry={(country) => { setQuery(country.name); handleSelect(country); }}
                />
              </div>
            </div>
          </section>
        )}

        <div className="px-4 md:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto">
          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <div>
              <div className="relative -mt-11 mb-7 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 shadow-md sm:px-5">
                <FilterChips active={filter} onChange={setFilter} />
              </div>
              <div className="flex flex-col gap-6 lg:flex-row">
              {/* Coluna principal: filtros + grade */}
              <div className="flex-1 min-w-0">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--fg-strong)]">Destinos para explorar</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Informações para começar a planejar com segurança.</p>
                  </div>
                  <span className="pb-0.5 text-sm text-[var(--muted)]">{filtered.length} destinos</span>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((c) => (
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

                <div className="mt-6 rounded-card border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--muted)]">
                  <p>⚠️ Requisitos podem mudar. Confirme em fontes oficiais (consulados, embaixadas, IATA) antes de viajar.</p>
                </div>
              </div>

              {/* Painel de detalhes (desktop) */}
              {selected && (
                <aside className="hidden lg:block w-80 shrink-0">
                  <div className="sticky top-6 rounded-card border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
                    <DestinationDetail country={selected} />
                  </div>
                </aside>
              )}
              </div>
            </div>
          )}

          {/* Destinations Tab */}
          {activeTab === 'destinations' && (
            <DestinationsExplorer selected={selected} onSelect={handleDestinationSelect} onClear={() => setSelected(null)} />
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
