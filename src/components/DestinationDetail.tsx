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
      <div className="relative mb-5 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40">
        <img
          src={getDestinationImage(country.id)}
          alt={`Paisagem de ${country.name}`}
          className="h-48 w-full object-cover sm:h-64"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/90 via-[#0B0F17]/30 to-transparent" />
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{country.flag}</span>
          <div>
            <h2 id="detail-title" className="text-2xl font-extrabold text-white drop-shadow-md tracking-tight">{country.name}</h2>
            <div className="mt-1.5"><StatusBadge type={country.visa.type} label={country.visa.label} /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform active:scale-[0.98] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 sm:w-auto"
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          Site oficial da imigração
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyChecklist}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-6 py-3 font-medium text-white shadow-sm transition-all active:scale-[0.98] hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar Checklist'}
          </button>
          <ShareButton country={country} />
        </div>
        <p className="text-xs text-slate-500">Última atualização: {country.lastUpdated}</p>
      </div>
    </motion.section>
  );
}
