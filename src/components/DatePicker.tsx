'use client';

import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function DatePicker({
  minValidityMonths,
  travelDate: initialTravelDate,
  passportExpiry: initialPassportExpiry,
}: {
  minValidityMonths: number;
  travelDate?: string;
  passportExpiry?: string;
}) {
  const [travelDate, setTravelDate] = useState(initialTravelDate ?? '');
  const [passportExpiry, setPassportExpiry] = useState(initialPassportExpiry ?? '');

  const result = useMemo(() => {
    if (!passportExpiry) return null;
    const expiry = new Date(passportExpiry + 'T00:00:00');
    const base = travelDate ? new Date(travelDate + 'T00:00:00') : new Date();
    const required = new Date(base.getTime());
    required.setMonth(required.getMonth() + minValidityMonths);
    const eligible = expiry.getTime() >= required.getTime();
    const requiredStr = required.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    return { eligible, requiredStr };
  }, [passportExpiry, travelDate, minValidityMonths]);

  return (
    <div className="mt-4 rounded-xl bg-black/5 p-3 dark:bg-white/5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="travel-date" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Data da viagem
          </label>
          <input
            id="travel-date"
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] dark:border-white/10 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="passport-expiry" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Validade do passaporte
          </label>
          <input
            id="passport-expiry"
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
      {!result && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Selecione a validade do seu passaporte para validar elegibilidade.
        </p>
      )}
    </div>
  );
}
