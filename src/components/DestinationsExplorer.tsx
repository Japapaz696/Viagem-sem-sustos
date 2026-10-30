'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import countriesData from '@/data/countries.json';
import type { Country } from '@/types/country';
import { getDestinationImage } from '@/utils/images';
import MapView from './MapView';
import SelectedDestinationView from './SelectedDestinationView';

const countries = countriesData as Country[];
const REGIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'south-america', label: 'América do Sul' },
  { id: 'north-america', label: 'América do Norte' },
  { id: 'europe', label: 'Europa' },
  { id: 'asia', label: 'Ásia' },
];
const REGION_COUNTRIES: Record<string, Set<string>> = {
  'south-america': new Set(['ar', 'br', 'cl', 'co', 'uy']),
  'north-america': new Set(['ca', 'mx', 'us']),
  europe: new Set(['de', 'es', 'fr', 'gb', 'it', 'pt']),
  asia: new Set(['jp', 'th']),
};

export default function DestinationsExplorer({ selected, onSelect, onClear }: {
  selected: Country | null;
  onSelect: (country: Country) => void;
  onClear: () => void;
}) {
  const [region, setRegion] = useState('all');
  const [visaType, setVisaType] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => countries.filter((country) => {
    const regionCountries = REGION_COUNTRIES[region];
    const matchesRegion = !regionCountries || regionCountries.has(country.id);
    const matchesVisa = visaType === 'all'
      || (visaType === 'evisa' ? country.visa.type === 'evisa' || country.visa.type === 'arrival' : country.visa.type === visaType);
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    const matchesQuery = !normalizedQuery
      || country.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      || country.keywords.some((keyword) => keyword.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
    return matchesRegion && matchesVisa && matchesQuery;
  }), [region, visaType, query]);

  const visibleSelected = filtered.find((country) => country.id === selected?.id) ?? null;

  if (visibleSelected) {
    return <SelectedDestinationView country={visibleSelected} onBack={onClear} />;
  }

  return (
    <section className="mx-auto max-w-[1440px]" aria-labelledby="destinations-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="destinations-heading" className="text-2xl font-bold tracking-tight text-[var(--fg-strong)] sm:text-3xl">Destinos</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">Explore o mapa, compare países e confira os requisitos antes de planejar.</p>
        </div>
        <p className="text-sm text-[var(--muted)]"><strong className="font-semibold text-[var(--fg-strong)]">{filtered.length}</strong> de {countries.length} destinos</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filtrar por região">
          {REGIONS.map((item) => (
            <button key={item.id} type="button" onClick={() => setRegion(item.id)} aria-pressed={region === item.id}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${region === item.id ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row lg:w-[430px]">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20">
            <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <span className="sr-only">Pesquisar país</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar país" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fg-strong)] outline-none placeholder:text-[var(--muted-soft)]" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar pesquisa" className="text-[var(--muted)] hover:text-[var(--fg-strong)]"><X className="h-4 w-4" /></button>}
          </label>
          <label className="sr-only" htmlFor="visa-filter">Filtrar por requisito de visto</label>
          <select id="visa-filter" value={visaType} onChange={(event) => setVisaType(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
            <option value="all">Todos os vistos</option>
            <option value="exempt">Sem visto</option>
            <option value="evisa">E-Visa / na chegada</option>
            <option value="required">Visto necessário</option>
          </select>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.85fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-[var(--fg-strong)]">Mapa de destinos</h2>
              <p className="mt-0.5 text-xs text-[var(--muted)]">Selecione um ponto para ver o país</p>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]" aria-label="Legenda de requisitos de visto">
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600" />Isento</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-500" />Eletrônico</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-600" />Necessário</span>
            </div>
          </div>
          <MapView countries={filtered} selected={visibleSelected} region={region} onSelect={onSelect} />
        </div>

        <aside className="hidden min-h-[430px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] lg:block" aria-label="Destinos e detalhes">
          <>
              <div className="border-b border-[var(--border)] px-4 py-3">
                <h2 className="text-sm font-semibold text-[var(--fg-strong)]">Países nesta seleção</h2>
              </div>
              <div className="max-h-[610px] overflow-y-auto p-2">
                {filtered.map((country) => (
                  <button key={country.id} type="button" onClick={() => onSelect(country)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                    <img src={getDestinationImage(country.id)} alt="" className="h-12 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 truncate text-sm font-semibold text-[var(--fg-strong)]"><span aria-hidden="true">{country.flag}</span>{country.name}</span>
                      <span className="mt-1 block truncate text-xs text-[var(--muted)]">{country.visa.label}</span>
                    </span>
                    <span className="sr-only">Abrir requisitos</span>
                  </button>
                ))}
                {filtered.length === 0 && <p className="p-6 text-center text-sm text-[var(--muted)]">Nenhum destino corresponde a esses filtros.</p>}
              </div>
          </>
        </aside>
      </div>

      <div className="mt-5 lg:hidden">
        <h2 className="mb-3 text-sm font-semibold text-[var(--fg-strong)]">Países nesta seleção</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((country) => (
            <button key={country.id} type="button" onClick={() => onSelect(country)} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <img src={getDestinationImage(country.id)} alt="" className="h-14 w-16 shrink-0 rounded-md object-cover" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 truncate text-sm font-semibold text-[var(--fg-strong)]"><span aria-hidden="true">{country.flag}</span>{country.name}</span>
                <span className="mt-1 block truncate text-xs text-[var(--muted)]">{country.visa.label}</span>
              </span>
              <span className="sr-only">Abrir requisitos</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--muted)]">Nenhum destino corresponde a esses filtros.</p>}
        </div>
      </div>

      <p className="mt-5 rounded-lg bg-[var(--surface-muted)] px-4 py-3 text-xs leading-5 text-[var(--muted)]">Requisitos de entrada podem mudar. Confirme as informações atualizadas no consulado ou órgão oficial antes de viajar.</p>
    </section>
  );
}
