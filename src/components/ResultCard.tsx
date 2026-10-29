'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Calendar, Check, ExternalLink, FileCheck, Syringe } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ShareButton from './ShareButton';
import { getDestinationImage } from '@/utils/images';
import type { Country } from '@/types/country';

const cardClass =
  'rounded-[22px] border border-black/5 bg-white/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-slate-900/80';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 260, damping: 24 },
  }),
};

const tabs = [
  { id: 'basic', label: 'Requisitos Básicos' },
  { id: 'health', label: 'Passaporte & Saúde' },
  { id: 'links', label: 'Links Oficiais' },
];

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ResultCard({ country }: { country: Country }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [travelDate, setTravelDate] = useState('');
  const hasRequiredVaccines = country.vaccines.required.length > 0;

  const requiredUntil = travelDate
    ? formatDate(addMonths(new Date(travelDate + 'T00:00:00'), country.passport.minValidityMonths))
    : null;

  return (
    <motion.section
      className="mx-auto mt-6 w-full max-w-2xl"
      aria-labelledby="result-title"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      <motion.div
        className="mb-6 overflow-hidden rounded-[22px]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <img
          src={getDestinationImage(country.id)}
          alt={`Paisagem de ${country.name}`}
          className="h-44 w-full object-cover sm:h-56"
          loading="lazy"
        />
      </motion.div>

      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, rotate: -180, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="text-5xl leading-none"
            aria-hidden="true"
          >
            {country.flag}
          </motion.span>
          <motion.h2
            id="result-title"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 24 }}
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            {country.name}
          </motion.h2>
        </div>
        <motion.div
          key={country.visa.type}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <StatusBadge type={country.visa.type} label={country.visa.label} />
        </motion.div>
      </div>

      <div
        className="mb-4 flex gap-2 overflow-x-auto border-b border-black/5 pb-2 dark:border-white/10"
        role="tablist"
        aria-label="Seções do destino"
      >
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <motion.button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActiveTab(t.id)}
              whileTap={{ scale: 0.96 }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] ${
                isActive
                  ? 'bg-[#007AFF] text-white'
                  : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              {t.label}
            </motion.button>
          );
        })}
      </div>

      {activeTab === 'basic' && (
        <div id="panel-basic" role="tabpanel" aria-labelledby="tab-basic" className="grid gap-4 sm:grid-cols-2">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className={cardClass}>
            <div className="mb-3 flex items-center gap-2 text-[#007AFF]">
              <FileCheck className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Visto</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{country.visa.description}</p>
          </motion.div>

          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className={cardClass}>
            <div className="mb-3 flex items-center gap-2 text-[#007AFF]">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Estadia</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{country.maxStayDays} dias</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Tempo máximo de permanência para turismo.
            </p>
          </motion.div>
        </div>
      )}

      {activeTab === 'health' && (
        <div id="panel-health" role="tabpanel" aria-labelledby="tab-health" className="grid gap-4 sm:grid-cols-2">
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className={cardClass}>
            <div className="mb-3 flex items-center gap-2 text-[#007AFF]">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Passaporte</h3>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Validade mínima: {country.passport.minValidityMonths}{' '}
              {country.passport.minValidityMonths === 1 ? 'mês' : 'meses'}
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{country.passport.details}</p>

            <div className="mt-4 rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <label
                htmlFor="travel-date"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Data da sua viagem
              </label>
              <input
                id="travel-date"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
              {requiredUntil && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  </motion.span>
                  Seu passaporte precisa ser válido até{' '}
                  <span className="font-semibold text-[#007AFF]">{requiredUntil}</span>.
                </motion.p>
              )}
              {!requiredUntil && travelDate === '' && null}
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`${cardClass} ${
              hasRequiredVaccines ? 'border-rose-200/60 bg-rose-50/80 dark:border-rose-500/30 dark:bg-rose-950/40' : ''
            }`}
          >
            <div className="mb-3 flex items-center gap-2 text-[#007AFF]">
              <Syringe className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Vacinas</h3>
            </div>
            {hasRequiredVaccines && (
              <div className="mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                  Obrigatórias
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-rose-700 dark:text-rose-300">
                  {country.vaccines.required.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Recomendadas
              </p>
              {country.vaccines.recommended.length > 0 ? (
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {country.vaccines.recommended.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Nenhuma recomendação específica.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'links' && (
        <motion.div
          id="panel-links"
          role="tabpanel"
          aria-labelledby="tab-links"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.a
            href={country.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#007AFF] px-6 py-3 font-medium text-white shadow-sm transition-transform active:scale-95 hover:bg-[#0062cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
            Site oficial do governo/consulado
          </motion.a>
          <ShareButton country={country} />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Última atualização: {country.lastUpdated}
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
