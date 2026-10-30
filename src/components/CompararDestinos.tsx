'use client';

import { GitCompare, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Country } from '@/types/country';
import countriesData from '@/data/countries.json';

const countries = countriesData as Country[];

export default function CompararDestinos() {
  const [selected, setSelected] = useState<string[]>(['jp', 'pt']);

  function toggleCountry(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const selectedCountries = countries.filter(c => selected.includes(c.id));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg-strong)] mb-2">Comparar destinos</h2>
        <p className="text-sm text-[var(--muted)]">Visualize rapidamente os principais requisitos de entrada para até três países.</p>
      </div>

      {/* Seleção de países */}
      <div className="flex flex-wrap gap-2 mb-6">
        {countries.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggleCountry(c.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              selected.includes(c.id)
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)]/40'
            }`}
          >
            {selected.includes(c.id) && <Check className="h-3 w-3" />}
            <span>{c.flag}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Tabela comparativa */}
      {selectedCountries.length > 0 && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">Critério</th>
                  {selectedCountries.map(c => (
                    <th key={c.id} className="px-4 py-3 text-center text-xs font-semibold text-[var(--fg-strong)]">
                      <span className="mr-1">{c.flag}</span> {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--muted)] font-medium">Requisito de visto</td>
                  {selectedCountries.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-[var(--fg-strong)]">{c.visa.label}</td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--muted)] font-medium">Permanência máxima</td>
                  {selectedCountries.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-[var(--fg-strong)]">{c.id === 'br' ? 'Não se aplica' : c.maxStayDays ? `${c.maxStayDays} dias` : 'Sem limite definido'}</td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--muted)] font-medium">Passaporte (validade mín.)</td>
                  {selectedCountries.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-[var(--fg-strong)]">{c.id === 'br' ? 'Não se aplica' : c.passport.minValidityMonths === 0 ? 'Válido na estadia' : `${c.passport.minValidityMonths} meses`}</td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--muted)] font-medium">Vacinação</td>
                  {selectedCountries.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-[var(--fg-strong)]">
                      {c.vaccines.required.length > 0 ? c.vaccines.required.join(', ') : 'Não exigida'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCountries.length === 0 && (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-10 text-center text-[var(--muted)]">
          Selecione até 3 países para comparar.
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs text-[var(--muted)]">
        <p className="font-semibold mb-1">⚠️ Informações sujeitas a alteração</p>
        <p>Os dados são baseados em fontes públicas e podem sofrer alterações. Verifique sempre órgãos oficiais (consulados, embaixadas, IATA).</p>
      </div>
    </div>
  );
}