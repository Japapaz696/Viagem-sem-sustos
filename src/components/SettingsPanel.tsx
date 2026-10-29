'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ChevronRight, Shield, Download, Trash2, Sparkles, Database } from 'lucide-react';

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold tracking-tight text-white">Ajustes</h2>
      
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"><Shield className="h-4 w-4 text-indigo-400"/></div>
          <h3 className="text-lg font-bold text-white">Preferências Pessoais</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="passport-country" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">País de origem do passaporte</label>
            <select id="passport-country" className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#13172A] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
              <option>Brasil</option>
              <option>Argentina</option>
              <option>Portugal</option>
              <option>Estados Unidos</option>
            </select>
          </div>
          <div>
            <label htmlFor="currency" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Moeda preferida</label>
            <select id="currency" className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#13172A] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
              <option>Real (BRL)</option>
              <option>Dólar (USD)</option>
              <option>Euro (EUR)</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"><Sparkles className="h-4 w-4 text-amber-400"/></div>
          <h3 className="text-lg font-bold text-white">Aparência</h3>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'system', label: 'Sistema' },
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Escuro' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id as 'system' | 'light' | 'dark')}
              aria-pressed={theme === t.id}
              className={`rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                theme === t.id
                  ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'border-white/[0.08] bg-[#13172A] text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Database className="h-4 w-4 text-emerald-400"/></div>
          <h3 className="text-lg font-bold text-white">Dados e Cache</h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#13172A] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.06] transition-colors"><Download className="h-4 w-4" /> Sincronizar offline</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-950/20 px-5 py-3 text-sm font-medium text-rose-300 hover:bg-rose-950/30 transition-colors"><Trash2 className="h-4 w-4" /> Limpar cache</button>
        </div>
      </section>
    </div>
  );
}
