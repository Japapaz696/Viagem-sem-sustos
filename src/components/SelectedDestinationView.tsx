'use client';

import { ArrowLeft, MapPin } from 'lucide-react';
import { Map as StreetMap, Marker } from 'pigeon-maps';
import { motion } from 'framer-motion';
import type { Country } from '@/types/country';
import DestinationDetail from './DestinationDetail';

const CAPITALS: Record<string, { name: string; coordinates: [number, number] }> = {
  ar: { name: 'Buenos Aires', coordinates: [-34.6037, -58.3816] },
  br: { name: 'Brasília', coordinates: [-15.7939, -47.8828] },
  ca: { name: 'Ottawa', coordinates: [45.4215, -75.6972] },
  cl: { name: 'Santiago', coordinates: [-33.4489, -70.6693] },
  co: { name: 'Bogotá', coordinates: [4.711, -74.0721] },
  de: { name: 'Berlim', coordinates: [52.52, 13.405] },
  es: { name: 'Madri', coordinates: [40.4168, -3.7038] },
  fr: { name: 'Paris', coordinates: [48.8566, 2.3522] },
  gb: { name: 'Londres', coordinates: [51.5072, -0.1276] },
  it: { name: 'Roma', coordinates: [41.9028, 12.4964] },
  jp: { name: 'Tóquio', coordinates: [35.6762, 139.6503] },
  mx: { name: 'Cidade do México', coordinates: [19.4326, -99.1332] },
  pt: { name: 'Lisboa', coordinates: [38.7223, -9.1393] },
  th: { name: 'Bangkok', coordinates: [13.7563, 100.5018] },
  uy: { name: 'Montevidéu', coordinates: [-34.9011, -56.1645] },
  us: { name: 'Washington, D.C.', coordinates: [38.9072, -77.0369] },
};

export default function SelectedDestinationView({ country, onBack }: { country: Country; onBack: () => void }) {
  const capital = CAPITALS[country.id] ?? { name: country.name, coordinates: [0, 0] as [number, number] };

  return (
    <motion.section
      key={country.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      aria-label={`Mapa e informações de ${country.name}`}
      className="-mx-4 -my-6 grid min-h-[calc(100dvh-148px)] grid-cols-1 overflow-hidden bg-[var(--surface)] md:-mx-8 md:-my-6 lg:-mx-10 lg:h-[calc(100dvh-68px)] lg:min-h-[560px] lg:grid-cols-[minmax(340px,390px)_minmax(0,1fr)]"
    >
      <aside className="order-2 min-h-0 overflow-y-auto border-b border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 lg:order-1 lg:border-b-0 lg:border-r">
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar ao mapa mundi
        </button>
        <DestinationDetail country={country} compact capitalName={capital.name} />
      </aside>

      <div className="relative order-1 min-h-[43dvh] bg-[#e8eef0] lg:order-2 lg:min-h-0">
        <StreetMap
          key={country.id}
          center={capital.coordinates}
          zoom={13}
          boxClassname="h-full w-full"
          attribution={<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener" className="text-[#0078A8]">© OpenStreetMap contributors</a>}
          attributionPrefix={false}
        >
          <Marker anchor={capital.coordinates} color="#0D6B9F" width={38} />
        </StreetMap>
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-black/5 bg-white/95 px-3 py-2 shadow-md sm:left-6 sm:top-6">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"><MapPin className="h-4 w-4 text-[#0D6B9F]" aria-hidden="true" />{capital.name}</p>
          <p className="mt-0.5 pl-[22px] text-xs text-slate-600">Mapa da região · arraste para explorar</p>
        </div>
      </div>
    </motion.section>
  );
}
