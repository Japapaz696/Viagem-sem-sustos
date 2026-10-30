'use client';

import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { addCalendarMonths, getPassportRule } from '@/utils/passportRules';

export default function DatePicker({
  countryId,
  minValidityMonths,
  passportDetails,
  travelDate: initialTravelDate,
  passportExpiry: initialPassportExpiry,
}: {
  countryId: string;
  minValidityMonths: number;
  passportDetails?: string;
  travelDate?: string;
  passportExpiry?: string;
}) {
  const [travelDate, setTravelDate] = useState(initialTravelDate ?? '');
  const [returnDate, setReturnDate] = useState('');
  const [passportExpiry, setPassportExpiry] = useState(initialPassportExpiry ?? '');
  const id = useId();

  const rule = useMemo(() => getPassportRule(countryId, minValidityMonths, passportDetails ?? ''), [countryId, minValidityMonths, passportDetails]);
  const referenceType = rule === 'after-return' || rule === 'during-stay' ? 'return' : 'travel';
  const unclearReference = rule === 'ambiguous';
  const invalidDateRange = referenceType === 'return' && travelDate && returnDate && returnDate < travelDate;

  const canVerify = useMemo(() => {
    if (unclearReference || invalidDateRange) return false;
    if (referenceType === 'return' && !returnDate) return false;
    if (referenceType === 'travel' && !travelDate) return false;
    return true;
  }, [minValidityMonths, referenceType, travelDate, returnDate, unclearReference, invalidDateRange]);

  const result = useMemo(() => {
    if (!passportExpiry || !canVerify) return null;
    const expiry = new Date(passportExpiry + 'T00:00:00');
    const baseDate = referenceType === 'return' ? returnDate : travelDate;
    const base = baseDate ? new Date(baseDate + 'T00:00:00') : new Date();
    const required = rule === 'during-stay' ? base : addCalendarMonths(base, minValidityMonths);
    const eligible = expiry.getTime() >= required.getTime();
    const requiredStr = required.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    return { eligible, requiredStr, referenceType };
  }, [passportExpiry, travelDate, returnDate, minValidityMonths, referenceType, canVerify, rule]);

  // Se a regra não indicar claramente a data de referência
  return (
    <div className="mt-4 rounded-xl bg-black/5 p-3 dark:bg-white/5">
      {unclearReference && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p>A data de referência não está clara no texto disponível. Confirme a regra em fontes oficiais antes de viajar.</p>
        </div>
      )}
      {invalidDateRange && (
        <p className="mb-3 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400" role="alert">
          A data de retorno precisa ser igual ou posterior à data de ida.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {referenceType === 'return' && (
          <>
            <div>
              <label htmlFor={`${id}-travel-date`} className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Data da viagem (ida)
              </label>
              <input
                id={`${id}-travel-date`}
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor={`${id}-return-date`} className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Data de retorno
              </label>
              <input
                id={`${id}-return-date`}
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </>
        )}
        {referenceType === 'travel' && (
          <div>
            <label htmlFor={`${id}-travel-date`} className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Data da viagem
            </label>
            <input
              id={`${id}-travel-date`}
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}
        <div>
          <label htmlFor={`${id}-passport-expiry`} className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Validade do passaporte
          </label>
          <input
            id={`${id}-passport-expiry`}
            type="date"
            value={passportExpiry}
            onChange={(e) => setPassportExpiry(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 flex items-center gap-2 rounded-lg p-2 text-sm font-medium ${
            result.eligible
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
          }`}
          role="status"
          aria-live="polite"
        >
          {result.eligible ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5" aria-hidden="true" />
          )}
          {result.eligible
            ? 'Passaporte elegível para a viagem.'
            : `Passaporte não elegível. Precisa ser válido até ${result.requiredStr}.`}
        </motion.div>
      )}
      {!result && !unclearReference && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Selecione a validade do seu passaporte para validar elegibilidade.
        </p>
      )}
    </div>
  );
}
