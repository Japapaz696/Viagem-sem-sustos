'use client';

import { useMemo, useState } from 'react';
import { MapPinned, Search, SlidersHorizontal, X, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import countriesData from '@/data/countries.json';
import type { Country } from '@/types/country';
import { getDestinationImage } from '@/utils/images';
import MapView from './MapView';
import SelectedDestinationView from './SelectedDestinationView';

const countries = countriesData as Country[];
const hasElectronicVisaData = countries.some((country) => country.visa.type === 'evisa' || country.visa.type === 'arrival');
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
const VISA_SUMMARY = [
  {
    id: 'exempt',
    label: 'Sem visto',
    color: 'bg-emerald-400',
    icon: CheckCircle2,
    // Isento de visto — nenhum visto necessário para entrada
    description: 'Nenhum visto necessário',
  },
  {
    id: 'evisa',
    label: 'E-Visa ou na chegada',
    color: 'bg-amber-300',
    icon: Zap,
    // Autorização eletrônica ou na chegada
    description: 'Autorização eletrônica ou na chegada',
  },
  {
    id: 'required',
    label: 'Visto necessário',
    color: 'bg-rose-400',
    icon: AlertCircle,
    // Visto tradicional necessário
    description: 'Visto tradicional necessário',
  },
] as const;

export default function DestinationsExplorer({ selected, onSelect, onClear }: {
  selected: Country | null;
  onSelect: (country: Country) => void;
  onClear: () => void;
}) {
  const [region, setRegion] = useState('all');
  const [visaType, setVisaType] = useState('all');
  const [query, setQuery] = useState('');

  const regionAndSearchFiltered = useMemo(() => countries.filter((country) => {
    const regionCountries = REGION_COUNTRIES[region];
    const matchesRegion = !regionCountries || regionCountries.has(country.id);
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    const matchesQuery = !normalizedQuery
      || country.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
      || country.keywords.some((keyword) => keyword.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
    return matchesRegion && matchesQuery;
  }), [region, query]);

  const filtered = useMemo(() => regionAndSearchFiltered.filter((country) => {
    if (visaType === 'all') return true;
    // O Brasil é o país de origem, não um destino internacional sem visto.
    if (country.id === 'br' && visaType === 'exempt') return false;
    return visaType === 'evisa'
      ? country.visa.type === 'evisa' || country.visa.type === 'arrival'
      : country.visa.type === visaType;
  }), [regionAndSearchFiltered, visaType]);

  const visaCounts = useMemo(() => VISA_SUMMARY.map((category) => ({
    ...category,
    count: regionAndSearchFiltered.filter((country) => country.id !== 'br' && (
      category.id === 'evisa'
        ? country.visa.type === 'evisa' || country.visa.type === 'arrival'
        : country.visa.type === category.id
    )).length,
  })), [regionAndSearchFiltered]);
  const internationalCount = regionAndSearchFiltered.filter((country) => country.id !== 'br').length;

  const visibleSelected = filtered.find((country) => country.id === selected?.id) ?? null;

  if (visibleSelected) {
    return <SelectedDestinationView country={visibleSelected} onBack={onClear} />;
  }

  return (
    <section className="mx-auto max-w-[1440px]" aria-labelledby="destinations-heading">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] sm:flex">
            <MapPinned className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div>
            <h1 id="destinations-heading" className="font-display text-[32px] font-bold leading-tight tracking-[-0.035em] text-[var(--fg-strong)] sm:text-4xl">Destinos</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">Explore o mapa e confira os requisitos de entrada antes de planejar.</p>
          </div>
        </div>
        <p aria-live="polite" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--muted)] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <strong className="tabular-nums font-semibold text-[var(--fg-strong)]">{filtered.length}</strong>
          <span>{filtered.length === 1 ? 'destino' : 'destinos'}</span>
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm sm:p-4">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 transition-colors focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15">
            <Search className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <span className="sr-only">Pesquisar destino</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Qual país você quer conhecer?" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fg-strong)] outline-none placeholder:text-[var(--muted-soft)]" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar pesquisa" className="rounded p-1 text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)]"><X className="h-4 w-4" /></button>}
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <span className="sr-only">Filtrar por visto</span>
            <select id="visa-filter" value={visaType} onChange={(event) => setVisaType(event.target.value)} className="h-full min-h-12 min-w-0 flex-1 bg-transparent text-sm text-[var(--fg-strong)] outline-none">
              <option value="all">Qualquer requisito</option>
              <option value="exempt">Sem visto</option>
              <option value="evisa" disabled={!hasElectronicVisaData}>E-Visa / na chegada</option>
              <option value="required">Visto necessário</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3 border-t border-[var(--border)] pt-3">
          <span className="hidden shrink-0 text-xs font-semibold text-[var(--muted)] sm:inline">Região</span>
          <div className="flex min-w-0 flex-wrap items-center gap-2" role="group" aria-label="Filtrar por região">
          {REGIONS.map((item) => (
            <button key={item.id} type="button" onClick={() => setRegion(item.id)} aria-pressed={region === item.id}
              className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${region === item.id ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm' : 'border-transparent bg-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)]'}`}>
              {item.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.85fr)]">
        <div className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
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

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:p-5" aria-labelledby="visa-summary-heading">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-3 mb-4">
              <div>
                <h2 id="visa-summary-heading" className="font-display text-lg font-bold tracking-[-0.02em] sm:text-xl text-[var(--fg-strong)]">Requisitos de entrada</h2>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Para passaporte brasileiro · {internationalCount} {internationalCount === 1 ? 'destino' : 'destinos'} nesta seleção</p>
              </div>
              {visaType !== 'all' && <button type="button" onClick={() => setVisaType('all')} className="rounded-md px-2.5 py-1 text-xs font-medium text-[var(--accent)] underline decoration-[var(--accent)]/50 underline-offset-4 transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">Limpar filtro</button>}
            </div>

            <div className="mt-4 flex h-2 overflow-hidden rounded-full border border-[var(--border)]/30 bg-[var(--surface-muted)]" role="img" aria-label={visaCounts.map((category) => `${category.count} ${category.label.toLocaleLowerCase('pt-BR')}`).join(', ')}>
              {visaCounts.map((category) => (
                category.count > 0 && <span key={category.id} className={`${category.color} h-full flex-none transition-[width] duration-200 ease-out motion-reduce:transition-none`} style={{ width: `${internationalCount ? (category.count / internationalCount) * 100 : 0}%` }} />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-3" role="group" aria-label="Filtrar mapa por requisito de entrada">
              {visaCounts.map((category) => {
                const Icon = category.icon;
                const isActive = visaType === category.id;
                const isEmpty = category.count === 0;
                return (
                  <button key={category.id} type="button" onClick={() => setVisaType(isActive ? 'all' : category.id)} aria-pressed={isActive} aria-disabled={isEmpty} disabled={isEmpty}
                    title={isEmpty ? 'Nenhum destino está classificado nesta categoria.' : undefined}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:cursor-not-allowed ${isActive ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg-strong)] shadow-sm' : 'border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--border-dark)] hover:bg-[var(--surface-muted)]'}`}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isActive ? 'text-white' : 'text-[var(--muted)]'}`}>
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      </span>
                      <span className={`text-xs font-medium leading-tight ${isEmpty ? 'text-[var(--muted-soft)]' : 'text-[var(--fg-strong)]'}`}>{category.label}</span>
                    </div>
                    <strong className={`tabular-nums text-xl font-bold leading-none ${isEmpty ? 'text-[var(--muted-soft)]' : 'text-[var(--fg-strong)]'}`}>{category.count}</strong>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[11px] leading-4 text-[var(--muted-soft)]">O Brasil aparece no globo como país de origem e não entra nessa contagem.</p>
          </section>
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
