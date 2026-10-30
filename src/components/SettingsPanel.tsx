'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ChevronRight, Shield, Download, Trash2, Sparkles, Database, Globe, Bell, Clock3, Moon, Sun } from 'lucide-react';

export default function SettingsPanel() {
  const { resolvedMode } = useTheme();
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg-strong)]">Ajustes</h2>

      {/* Aparência */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--fg-strong)]">Aparência</h3>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            {resolvedMode === 'dark' ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--fg-strong)]">Automático pelo horário local</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Claro das 06h às 17h59 · escuro das 18h às 05h59</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {resolvedMode === 'dark' ? 'Escuro agora' : 'Claro agora'}
          </span>
        </div>
      </section>

      {/* Preferências de viagem */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
            <Globe className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--fg-strong)]">Preferências de viagem</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="passport-country" className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
              Nacionalidade principal
            </label>
            <select
              id="passport-country"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            >
              <option>Brasil</option>
              <option>Argentina</option>
              <option>Portugal</option>
              <option>Estados Unidos</option>
            </select>
          </div>
          <div>
            <label htmlFor="trip-type" className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
              Tipo de viagem frequente
            </label>
            <select
              id="trip-type"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            >
              <option>Lazer</option>
              <option>Negócios</option>
              <option>Estudos</option>
            </select>
          </div>
        </div>
      </section>

      {/* Privacidade */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--fg-strong)]">Privacidade</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Localização', icon: Globe },
            { label: 'Notificações', icon: Bell },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-[var(--muted)]" />
                <span className="text-sm text-[var(--fg-strong)]">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--muted-soft)]" />
            </div>
          ))}
        </div>
      </section>

      {/* Dados e Cache */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center">
            <Database className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--fg-strong)]">Dados e Cache</h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--fg-strong)] hover:bg-[var(--accent-soft)] transition-colors">
            <Download className="h-4 w-4" /> Sincronizar offline
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-medium text-rose-600 hover:bg-rose-100 transition-colors dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/30">
            <Trash2 className="h-4 w-4" /> Limpar cache
          </button>
        </div>
      </section>

      {/* Termos e Privacidade */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6">
        <div className="space-y-2">
          {['Termos de Uso', 'Política de Privacidade'].map((label) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg-strong)] hover:bg-[var(--accent-soft)] transition-colors"
            >
              <span>{label}</span>
              <ChevronRight className="h-4 w-4 text-[var(--muted-soft)]" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
