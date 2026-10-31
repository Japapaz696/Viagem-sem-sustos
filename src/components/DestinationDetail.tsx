'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BookOpen, Calendar, ExternalLink, Syringe, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RequirementCard from './RequirementCard';
import DatePicker from './DatePicker';
import ShareButton from './ShareButton';
import { getDestinationImage } from '@/utils/images';
import type { Country } from '@/types/country';
import { getPassportRule } from '@/utils/passportRules';

export default function DestinationDetail({ country, compact = false, capitalName }: { country: Country; compact?: boolean; capitalName?: string }) {
  const hasRequiredVaccines = country.vaccines.required.length > 0;
  const passportValue = country.id === 'br'
    ? 'Não se aplica'
    : country.passport.minValidityMonths === 0
      ? (country.passport.details.toLowerCase().includes('rg') || country.passport.details.toLowerCase().includes('identidade')) ? 'RG válido' : 'Válido na estadia'
      : `Mínimo ${country.passport.minValidityMonths} ${country.passport.minValidityMonths === 1 ? 'mês' : 'meses'}`;
  const vaccineDescription = hasRequiredVaccines
    ? country.vaccines.required.join(', ')
    : country.vaccines.recommended.length > 0
      ? `Recomendadas: ${country.vaccines.recommended.join(', ')}`
      : 'Nenhuma recomendação específica.';
  const stayValue = country.id === 'br' ? 'Não se aplica' : country.maxStayDays === 0 ? 'Não definido' : `${country.maxStayDays} dias`;
  const passportDateCheckAvailable = !['origin', 'identity-document'].includes(getPassportRule(country.id, country.passport.minValidityMonths, country.passport.details));
  const sourceItems = [
    { key: 'visa', label: 'Visto e autorização', url: country.sources.visa },
    { key: 'passport', label: 'Passaporte e documentos', url: country.sources.passport },
    { key: 'stay', label: 'Permanência autorizada', url: country.sources.stay },
    { key: 'vaccines', label: 'Saúde e vacinas', url: country.sources.vaccines },
    { key: 'vaccinesHealth', label: 'Recomendações de vacinas (CDC)', url: country.sources.vaccinesHealth },
    { key: 'electronicAuthorization', label: 'Autorização ETIAS (União Europeia)', url: country.sources.electronicAuthorization },
  ].filter((item) => item.url);

  const sourcesBlock = (
    <details className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <summary className="flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-sm font-semibold text-[var(--fg-strong)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
        Consultar fontes por requisito
      </summary>
      <ul className="border-t border-[var(--border)] px-3 py-1">
        {sourceItems.map((item) => (
          <li key={item.key}>
            <a href={item.url!} target="_blank" rel="noopener noreferrer" aria-label={`Consultar fonte de ${item.label.toLowerCase()} para ${country.name}`} className="flex min-h-11 items-center justify-between gap-3 border-b border-[var(--border)] py-2 text-xs font-medium text-[var(--accent)] last:border-0 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <span>{item.label}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </details>
  );

  if (compact) {
    const requirements = [
      { icon: ShieldCheck, title: 'Visto', value: country.visa.label, description: country.visa.description },
      { icon: BookOpen, title: 'Passaporte', value: passportValue, description: country.passport.details },
      { icon: Syringe, title: 'Vacinas', value: hasRequiredVaccines ? 'Obrigatórias' : 'Nenhuma obrigatória', description: vaccineDescription },
      { icon: Calendar, title: 'Estadia máxima', value: stayValue, description: country.id === 'br' ? 'Você já está no país de origem.' : 'Tempo máximo de permanência para turismo.' },
    ];

    return (
      <motion.section
        key={country.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full"
        aria-labelledby="detail-title"
      >
        <div className="flex items-center gap-3">
          <Image src={getDestinationImage(country.id)} alt={`Paisagem de ${country.name}`} width={172} height={144} sizes="86px" className="h-[72px] w-[86px] shrink-0 rounded-lg object-cover" loading="lazy" />
          <div className="min-w-0">
            <h2 id="detail-title" className="font-display truncate text-xl font-bold text-[var(--fg-strong)]">{country.flag} {country.name}</h2>
            {capitalName && <p className="mt-0.5 text-sm text-[var(--muted)]">Capital: {capitalName}</p>}
          </div>
        </div>

        <dl className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {requirements.map(({ icon: Icon, title, value, description }) => (
            <div key={title} className="grid grid-cols-[minmax(94px,0.8fr)_minmax(0,1.4fr)] gap-3 py-3">
              <dt className="flex items-start gap-2 text-sm font-medium text-[var(--muted)]">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span>{title}</span>
              </dt>
              <dd className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-[var(--fg-strong)]">{value}</p>
                <p className="mt-0.5 text-xs leading-[1.45] text-[var(--muted)]">{description}</p>
                {title === 'Passaporte' && passportDateCheckAvailable && (
                  <div className="mt-2"><DatePicker countryId={country.id} minValidityMonths={country.passport.minValidityMonths} passportDetails={country.passport.details} /></div>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3">{sourcesBlock}</div>

        <div className="mt-4 flex flex-col gap-2">
          <a href={country.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-btn bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Abrir página oficial principal
          </a>
          <div className="flex min-w-0 justify-center"><ShareButton country={country} /></div>
          <p className="text-center text-[11px] leading-4 text-[var(--muted)]">Resumo para turismo de curta duração com passaporte brasileiro. Atualizado em {country.lastUpdated}; outras finalidades e documentos podem alterar os requisitos. Confirme nas fontes oficiais.</p>
        </div>
      </motion.section>
    );
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
      <div className="relative mb-4 h-40 overflow-hidden rounded-card">
        <Image
          src={getDestinationImage(country.id)}
          alt={`Paisagem de ${country.name}`}
          fill
          sizes="(max-width: 1023px) 100vw, 320px"
          className="object-cover"
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
          value={
            country.id === 'br'
              ? 'Não se aplica'
              : country.passport.minValidityMonths === 0
              ? (country.passport.details.toLowerCase().includes('rg') || country.passport.details.toLowerCase().includes('identidade'))
                ? 'RG válido'
                : 'Válido na estadia'
              : `Mínimo ${country.passport.minValidityMonths} ${country.passport.minValidityMonths === 1 ? 'mês' : 'meses'}`
          }
          description={country.passport.details}
          index={1}
        >
          {![ 'origin', 'identity-document' ].includes(getPassportRule(country.id, country.passport.minValidityMonths, country.passport.details)) && (
            <DatePicker countryId={country.id} minValidityMonths={country.passport.minValidityMonths} passportDetails={country.passport.details} />
          )}
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
          value={
            country.id === 'br'
              ? 'Não se aplica'
              : country.maxStayDays === 0
              ? 'Não definido'
              : `${country.maxStayDays} dias`
          }
          description={
            country.id === 'br'
              ? 'Você já está no país de origem.'
              : 'Tempo máximo de permanência para turismo.'
          }
          index={3}
        />
      </div>

      <div className="mt-4">{sourcesBlock}</div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <a
          href={country.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          Consultar fonte oficial
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareButton country={country} />
        </div>
        <p className="text-xs text-[var(--muted)]">Última atualização: {country.lastUpdated}</p>
      <p className="text-xs text-[var(--muted-soft)] mt-1">Resumo para turismo de curta duração com passaporte brasileiro. Outras finalidades e documentos podem alterar os requisitos; confirme nas fontes oficiais antes de viajar.</p>
      </div>
    </motion.section>
  );
}
