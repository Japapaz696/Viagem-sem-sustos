'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getDestinationImage } from '@/utils/images';
import type { Country } from '@/types/country';

export default function DestinationCard({
  country,
  onSelect,
  saved,
  onToggleSave,
}: {
  country: Country;
  onSelect: (c: Country) => void;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}) {
  return (
    <motion.article
      layout
      // Keep server-rendered cards visible before Framer Motion hydrates.
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-card border border-[var(--card-border)] bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
    >
      <button
        type="button"
        onClick={() => onSelect(country)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
        aria-label={`Ver detalhes de ${country.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={getDestinationImage(country.id)}
            alt={`Foto de destinos para ${country.name}`}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 320px"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge type={country.visa.type} label={country.visa.label} />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none" aria-hidden="true">{country.flag}</span>
            <h3 className="text-sm font-bold text-[var(--fg-strong)] leading-tight truncate">
              {country.name}
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] leading-tight line-clamp-2">
            {country.id === 'br'
              ? 'País de origem'
              : country.maxStayDays
              ? `${country.maxStayDays} dias máx.`
              : 'Sem limite definido'} ·{' '}
            {country.vaccines.required.length > 0 ? 'Vacina obrigatória' : 'Vacina não obrigatória'}
          </p>
        </div>
      </button>

      {onToggleSave && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(country.id);
          }}
          aria-label={saved ? 'Remover dos salvos' : 'Salvar destino'}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-btn border border-[var(--card-border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-emerald-500" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
    </motion.article>
  );
}
