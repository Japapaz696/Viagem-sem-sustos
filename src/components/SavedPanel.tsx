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
      <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6">Destinos Salvos</h2>
      {savedCountries.length === 0 ? (
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-10 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"> <Bookmark className="h-8 w-8 text-indigo-400" /> </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum destino salvo ainda</h3>
          <p className="text-sm text-slate-400 mb-6">Salve destinos tocando no ícone de marcador nos cards para montar seu itinerário.</p>
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-600 transition-colors"><Compass className="h-4 w-4" /> Explorar destinos</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedCountries.map((c) => (
            <DestinationCard key={c.id} country={c} onSelect={onSelect} saved={saved.has(c.id)} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
