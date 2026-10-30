'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { getDestinationImage } from '@/utils/images';
import type { Country } from '@/types/country';

export default function DestinationCard({
  country,
  onSelect,
  saved,
  onToggleSave,
  featured = false,
}: {
  country: Country;
  onSelect: (c: Country) => void;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  featured?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(getDestinationImage(country.id));
  const [imgError, setImgError] = useState(false);

  function handleImgError() {
    if (!imgError) {
      setImgError(true);
      setImgSrc(`https://picsum.photos/seed/${country.id}/1200/800`);
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card)] shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
    >
      <button
        type="button"
        onClick={() => onSelect(country)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        aria-label={`Ver detalhes de ${country.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imgSrc}
            alt={`Foto de destinos para ${country.name}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={handleImgError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Top-left badge */}
          <div className="absolute left-3 top-3 z-10">
            <StatusBadge type={country.visa.type} label={country.visa.label} />
          </div>
          {/* Flag + name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden="true">{country.flag}</span>
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-[var(--accent)] transition-colors truncate drop-shadow-sm">
                {country.name}
              </h3>
              <p className="text-xs text-white/80 font-medium leading-tight line-clamp-2 drop-shadow-sm">
                {country.maxStayDays ? `${country.maxStayDays} dias máx.` : 'Sem limite'} ·{' '}
                {country.vaccines.required.length > 0 ? 'Vacina obrigatória' : 'Vacina não obrigatória'} ·{' '}
                {country.visa.type === 'exempt' ? 'Visto não exigido' : country.visa.type === 'evisa' ? 'E-Visa' : 'Verificar oficial'}
              </p>
            </div>
          </div>
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
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 border border-white/30 shadow-sm backdrop-blur-md text-slate-600 hover:bg-white hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 transition-colors"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-emerald-500" /> : <Bookmark className="h-4 w-4" />}
        </button>
      )}
    </motion.article>
  );
}