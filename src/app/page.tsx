'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
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
import HeroFlightAnimation from '@/components/HeroFlightAnimation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import { MenuToggle } from '@/components/Navbar';
import { useSupabase } from '@/contexts/SupabaseContext';

const countries = countriesData as Country[];
const SOUTH_AMERICA = new Set(['ar', 'cl', 'co', 'uy', 'br']);
const TAB_IDS = new Set(['explore', 'destinations', 'saved', 'settings']);

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

function savedStorageKey(userId: string | null) {
  return userId ? `${SAVED_KEY}:user:${userId}` : SAVED_KEY;
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const { client, user, ready: authReady } = useSupabase();
  const [selected, setSelected] = useState<Country | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('explore');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loadedSavedScope, setLoadedSavedScope] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const savedRef = useRef(saved);
  const savedScope = user?.id ?? 'guest';

  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);

  useEffect(() => {
    if (!authReady) return;
    try {
      const raw = localStorage.getItem(savedStorageKey(user?.id ?? null));
      const values = raw ? JSON.parse(raw) : [];
      // Browser storage is loaded after hydration, so update React from this external source.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(new Set(Array.isArray(values) ? values.filter((id): id is string => typeof id === 'string') : []));
    } catch {
      setSaved(new Set());
    }
    setLoadedSavedScope(savedScope);
  }, [authReady, savedScope, user?.id]);

  useEffect(() => {
    if (loadedSavedScope !== savedScope) return;
    try {
      localStorage.setItem(savedStorageKey(user?.id ?? null), JSON.stringify(Array.from(saved)));
    } catch { /* ignore */ }
  }, [saved, loadedSavedScope, savedScope, user?.id]);

  useEffect(() => {
    if (!client || !user || !authReady || loadedSavedScope !== savedScope) return;
    const supabaseClient = client;
    const currentUser = user;
    let cancelled = false;

    async function syncSavedDestinations() {
      setSyncMessage('Sincronizando destinos salvos…');
      const { data, error } = await supabaseClient
        .from('saved_destinations')
        .select('country_id')
        .eq('user_id', currentUser.id);
      if (error) throw error;

      const validIds = new Set(countries.map((country) => country.id));
      const remoteIds = new Set((data ?? []).map((row) => row.country_id).filter((id): id is string => typeof id === 'string' && validIds.has(id)));
      let guestIds: string[] = [];
      try {
        const rawGuest = localStorage.getItem(SAVED_KEY);
        const parsedGuest: unknown = rawGuest ? JSON.parse(rawGuest) : [];
        if (Array.isArray(parsedGuest)) guestIds = parsedGuest.filter((id): id is string => typeof id === 'string' && validIds.has(id));
      } catch { /* Ignore damaged local data and keep valid remote records. */ }

      const mergedIds = new Set([...savedRef.current, ...guestIds, ...remoteIds]);
      const newRows = [...mergedIds].filter((countryId) => !remoteIds.has(countryId)).map((country_id) => ({
        user_id: currentUser.id,
        country_id,
      }));
      if (newRows.length) {
        const { error: saveError } = await supabaseClient.from('saved_destinations').upsert(newRows, {
          onConflict: 'user_id,country_id',
          ignoreDuplicates: true,
        });
        if (saveError) throw saveError;
      }

      if (!cancelled) {
        setSaved(mergedIds);
        setSyncMessage('Destinos salvos sincronizados com sua conta.');
      }
    }

    void syncSavedDestinations().catch(() => {
      if (!cancelled) setSyncMessage('Não foi possível sincronizar agora. Seus destinos continuam salvos neste dispositivo.');
    });

    return () => { cancelled = true; };
  }, [client, user, authReady, loadedSavedScope, savedScope]);

  const filtered = useMemo(() => {
    let list = applyFilter(countries, filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.toLowerCase().includes(q)));
    return list;
  }, [filter, query]);

  const savedCountries = useMemo(() => countries.filter((c) => saved.has(c.id)), [saved]);

  useEffect(() => {
    const syncTabFromUrl = () => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab && TAB_IDS.has(tab)) setActiveTab(tab);
      else setActiveTab('explore');
    };
    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, []);

  function changeTab(tab: string) {
    if (!TAB_IDS.has(tab)) return;
    setActiveTab(tab);
    setSideOpen(false);
    setSelected(null);
    setQuery('');
    setNavOpen(false);

    const url = new URL(window.location.href);
    if (tab === 'explore') url.searchParams.delete('tab');
    else url.searchParams.set('tab', tab);
    window.history.pushState({ tab }, '', `${url.pathname}${url.search}${url.hash}`);
  }

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
    const removing = saved.has(id);
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!client || !user || loadedSavedScope !== savedScope) return;
    setSyncMessage('Atualizando sua lista sincronizada…');
    const request = removing
      ? client.from('saved_destinations').delete().eq('user_id', user.id).eq('country_id', id)
      : client.from('saved_destinations').upsert({ user_id: user.id, country_id: id }, {
        onConflict: 'user_id,country_id',
        ignoreDuplicates: true,
      });
    void Promise.resolve(request).then(({ error }) => {
      setSyncMessage(error
        ? 'Não foi possível sincronizar a última alteração; ela permanece neste dispositivo.'
        : 'Lista sincronizada com sua conta.');
    }).catch(() => {
      setSyncMessage('Não foi possível sincronizar a última alteração; ela permanece neste dispositivo.');
    });
  }

  async function clearSaved() {
    if (client && user) {
      const { error } = await client.from('saved_destinations').delete().eq('user_id', user.id);
      if (error) throw error;
    }
    localStorage.removeItem(savedStorageKey(user?.id ?? null));
    setSaved(new Set());
    setSyncMessage(user ? 'Destinos removidos da nuvem.' : 'Lista local apagada.');
  }

  function closeSide() {
    setSideOpen(false);
    setTimeout(() => setSelected(null), 300);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--accent-soft)] md:flex">
      <a href="#main-content" className="sr-only fixed left-3 top-3 z-[100] rounded-md bg-[var(--surface)] px-4 py-3 font-semibold text-[var(--fg-strong)] shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">Pular para o conteúdo</a>
      <Navbar active={activeTab} open={navOpen} onClose={() => setNavOpen(false)} onChange={changeTab} />

      <main id="main-content" tabIndex={-1} className="min-h-screen min-w-0 flex-1 bg-[var(--bg)] pb-24 outline-none md:pb-8">
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
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="font-display max-w-3xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-[46px] md:leading-[1.1]"
              >
                Encontre seu próximo destino com tranquilidade
              </motion.h1>
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
                    <h2 className="font-display text-xl font-bold tracking-tight text-[var(--fg-strong)]">Destinos para explorar</h2>
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
                  <p>Resumo para turismo de curta duração com passaporte brasileiro. Regras podem mudar e outras finalidades ou documentos exigem consulta específica; confirme nas fontes oficiais antes de viajar.</p>
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
              onExplore={() => changeTab('explore')}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsPanel onClearSaved={clearSaved} savedCount={saved.size} syncMessage={syncMessage} />
          )}

        </div>
      </main>

      <SideSheet open={sideOpen} onClose={closeSide} title={selected?.name}>
        {selected && <DestinationDetail country={selected} />}
      </SideSheet>
    </div>
  );
}
