'use client';
import { Bookmark, Compass } from 'lucide-react';
import DestinationCard from './DestinationCard';
import type { Country } from '@/types/country';

export default function SavedPanel({
  savedCountries,
  onSelect,
  saved,
  onToggleSave,
}: {
  savedCountries: Country[];
  onSelect: (c: Country) => void;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg-strong)] mb-2">Destinos Salvos</h2>
        <p className="text-sm text-[var(--muted)]">Seus países favoritos em um só lugar.</p>
      </div>
      {savedCountries.length === 0 ? (
        <div className="rounded-4xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-10 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
            <Bookmark className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--fg-strong)] mb-2">Nenhum destino salvo ainda</h3>
          <p className="text-sm text-[var(--muted)] mb-6">Salve destinos tocando no ícone de marcador nos cards para montar seu itinerário.</p>
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-900/20 hover:bg-[var(--accent)]/90 transition-colors">
            <Compass className="h-4 w-4" /> Explorar destinos
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedCountries.map((c) => (
              <DestinationCard key={c.id} country={c} onSelect={onSelect} saved={saved.has(c.id)} onToggleSave={onToggleSave} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">Procurando mais destinos? Explore e salve seus favoritos!</p>
          </div>
        </>
      )}
    </div>
  );
}