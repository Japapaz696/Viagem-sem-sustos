'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Check, Copy, ExternalLink, FileCheck, Syringe, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import RequirementCard from './RequirementCard';
import DatePicker from './DatePicker';
import ShareButton from './ShareButton';
import { getDestinationImage } from '@/utils/images';
import type { Country } from '@/types/country';

export default function DestinationDetail({ country }: { country: Country }) {
  const [copied, setCopied] = useState(false);
  const hasRequiredVaccines = country.vaccines.required.length > 0;

  async function handleCopyChecklist() {
    const text = [
      `Requisitos de viagem para ${country.name}`,
      `Visto: ${country.visa.label} — ${country.visa.description}`,
      `Passaporte: validade mínima ${country.passport.minValidityMonths} meses. ${country.passport.details}`,
      `Vacinas obrigatórias: ${country.vaccines.required.join(', ') || 'Nenhuma'}`,
      `Vacinas recomendadas: ${country.vaccines.recommended.join(', ') || 'Nenhuma'}`,
      `Estadia máxima: ${country.maxStayDays} dias`,
      `Link oficial: ${country.officialUrl}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.section
      key={country.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="w-full"
      aria-labelledby="detail-title"
    >
      <div className="relative mb-4 overflow-hidden rounded-card">
        <img
          src={getDestinationImage(country.id)}
          alt={`Paisagem de ${country.name}`}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{country.flag}</span>
          <div>
            <h2 id="detail-title" className="text-lg font-bold text-white drop-shadow-md tracking-tight">{country.name}</h2>
            <div className="mt-1"><StatusBadge type={country.visa.type} label={country.visa.label} /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1">
        <RequirementCard
          icon={ShieldCheck}
          title="Visto"
          value={country.visa.label}
          description={country.visa.description}
          index={0}
        />
        <RequirementCard
          icon={BookOpen}
          title="Passaporte"
          value={`Mínimo ${country.passport.minValidityMonths} ${country.passport.minValidityMonths === 1 ? 'mês' : 'meses'}`}
          description={country.passport.details}
          index={1}
        >
          <DatePicker minValidityMonths={country.passport.minValidityMonths} />
        </RequirementCard>
        <RequirementCard
          icon={Syringe}
          title="Vacinas"
          value={hasRequiredVaccines ? 'Obrigatórias' : 'Nenhuma obrigatória'}
          description={
            hasRequiredVaccines
              ? country.vaccines.required.join(', ')
              : country.vaccines.recommended.length > 0
              ? `Recomendadas: ${country.vaccines.recommended.join(', ')}`
              : 'Nenhuma recomendação específica.'
          }
          tone={hasRequiredVaccines ? 'danger' : 'success'}
          index={2}
        />
        <RequirementCard
          icon={Calendar}
          title="Estadia Máxima"
          value={`${country.maxStayDays} dias`}
          description="Tempo máximo de permanência para turismo."
          index={3}
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <a
          href={country.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          Site oficial da imigração
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyChecklist}
            className="inline-flex items-center gap-2 rounded-btn border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--fg-strong)] hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar Checklist'}
          </button>
          <ShareButton country={country} />
        </div>
        <p className="text-xs text-[var(--muted)]">Última atualização: {country.lastUpdated}</p>
      <p className="text-xs text-[var(--muted-soft)] mt-1">⚠️ Requisitos podem mudar. Confirme em fontes oficiais antes de viajar.</p>
      </div>
    </motion.section>
  );
}
