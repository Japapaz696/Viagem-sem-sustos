'use client';

import { useState } from 'react';
import { Clock3, Database, Moon, ShieldCheck, Sun, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const SAVED_KEY = 'viagem-sem-susto-saved';

export default function SettingsPanel({ onClearSaved, savedCount }: {
  onClearSaved: () => void;
  savedCount: number;
}) {
  const { resolvedMode } = useTheme();
  const [message, setMessage] = useState('');

  function clearSavedDestinations() {
    if (!savedCount) {
      setMessage('Você ainda não tem destinos salvos neste dispositivo.');
      return;
    }
    if (!window.confirm('Apagar todos os destinos salvos neste dispositivo?')) return;

    try {
      localStorage.removeItem(SAVED_KEY);
      onClearSaved();
      setMessage('Destinos salvos apagados deste dispositivo.');
    } catch {
      setMessage('Não foi possível apagar os destinos salvos.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--fg-strong)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Veja como o app trata aparência, dados e privacidade.</p>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-appearance">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            {resolvedMode === 'dark' ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="settings-appearance" className="font-semibold text-[var(--fg-strong)]">Aparência</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">O tema acompanha o horário local do seu dispositivo: claro durante o dia e escuro à noite.</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--fg-strong)]" aria-live="polite">
              <Clock3 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Tema {resolvedMode === 'dark' ? 'escuro' : 'claro'} ativo agora
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-data">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <Database className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="settings-data" className="font-semibold text-[var(--fg-strong)]">Seus dados neste dispositivo</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {savedCount} {savedCount === 1 ? 'destino salvo' : 'destinos salvos'}. Por enquanto, favoritos ficam apenas neste navegador; o app ainda não tem conta nem sincronização entre dispositivos.
            </p>
            <button type="button" onClick={clearSavedDestinations} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg-strong)] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:hover:bg-rose-950/20 dark:hover:text-rose-300">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Apagar destinos salvos
            </button>
            <p className="sr-only" aria-live="polite">{message}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-privacy">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="settings-privacy" className="font-semibold text-[var(--fg-strong)]">Privacidade</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">O app não solicita sua localização nem envia notificações. Os requisitos de viagem são carregados de dados locais do projeto.</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Os Termos de Uso e a Política de Privacidade precisam ser escritos antes de uma publicação pública.</p>
          </div>
        </div>
      </section>

      <p className="text-xs leading-5 text-[var(--muted-soft)]">Os requisitos mostrados atualmente usam dados de viagem para passaporte brasileiro. Sempre confira as fontes oficiais antes de embarcar.</p>
    </div>
  );
}
