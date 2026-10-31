'use client';
import { ArrowRight, Bookmark, Compass } from 'lucide-react';
import DestinationCard from './DestinationCard';
import type { Country } from '@/types/country';

export default function SavedPanel({
  savedCountries,
  onSelect,
  saved,
  onToggleSave,
  onExplore,
}: {
  savedCountries: Country[];
  onSelect: (c: Country) => void;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onExplore: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.035em] text-[var(--fg-strong)] sm:text-4xl">Destinos salvos</h1>
          <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">Os países que você marcou para conferir com calma.</p>
        </div>
        {savedCountries.length > 0 && (
          <div className="flex items-center gap-4">
            <p aria-live="polite" className="text-sm text-[var(--muted)]"><strong className="tabular-nums font-semibold text-[var(--fg-strong)]">{savedCountries.length}</strong> {savedCountries.length === 1 ? 'destino' : 'destinos'}</p>
            <button type="button" onClick={onExplore} className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--fg-strong)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:inline-flex">
              Explorar destinos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      {savedCountries.length === 0 ? (
        <section className="flex flex-col items-start gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center sm:p-8" aria-labelledby="saved-empty-title">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Bookmark className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="saved-empty-title" className="font-display text-xl font-bold text-[var(--fg-strong)]">Sua lista começa aqui</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">Marque o ícone de favorito em um destino para guardar os requisitos e voltar a eles quando quiser.</p>
          </div>
          <button type="button" onClick={onExplore} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
            <Compass className="h-4 w-4" aria-hidden="true" /> Explorar destinos
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedCountries.map((c) => (
            <DestinationCard key={c.id} country={c} onSelect={onSelect} saved={saved.has(c.id)} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
