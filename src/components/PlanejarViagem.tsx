'use client';

import { Calendar, MapPin, Plane, Briefcase, GraduationCap, Heart, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function PlanejarViagem() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg-strong)] mb-2">Planeje sua viagem</h2>
        <p className="text-sm text-[var(--muted)]">Preencha os dados para verificar requisitos e documentos necessários.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-6">
        {['Dados da viagem', 'Requisitos', 'Documentos', 'Resumo'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              i + 1 <= step ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
            }`}>
              {i + 1}
            </div>
            {i < 3 && <div className={`h-0.5 w-8 ${i + 1 < step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
      </div>

      {/* Formulário */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 block">
            Sua nacionalidade
          </label>
          <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60">
            <option>Brasil</option>
            <option>Argentina</option>
            <option>Portugal</option>
            <option>Estados Unidos</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 block">
            Para onde você vai?
          </label>
          <input
            type="text"
            placeholder="Digite ou selecione o destino"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 block">
            Motivo da viagem
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'turismo', label: 'Turismo', icon: Plane },
              { id: 'saude', label: 'Saúde', icon: Heart },
              { id: 'negocios', label: 'Negócios', icon: Briefcase },
              { id: 'transito', label: 'Trânsito', icon: MapPin },
              { id: 'estudos', label: 'Estudos', icon: GraduationCap },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--fg-strong)] transition-colors"
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 block">
              Início
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2 block">
              Fim
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep(Math.min(step + 1, totalSteps))}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 hover:brightness-110 transition-all"
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs text-[var(--muted)]">
        <p className="font-semibold mb-1">⚠️ Informações sujeitas a alteração</p>
        <p>Os requisitos de visto, vacina e passaporte podem mudar. Sempre confirme em fontes oficiais antes de viajar.</p>
      </div>
    </div>
  );
}