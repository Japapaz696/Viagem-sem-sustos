'use client';

import { useState } from 'react';
import { Check, Plus, ChevronRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

export default function Checklist() {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: 'Documentos',
      items: [
        { id: '1', label: 'Passaporte Válido', description: 'Verificar validade mínima de 6 meses.', checked: true },
        { id: '2', label: 'Visto de Turista', description: 'Visto consular aprovado e impresso.', checked: false },
        { id: '3', label: 'Seguro Viagem', description: 'Cobertura de saúde e bagagem ativa.', checked: false },
      ],
    },
    {
      title: 'Preparação',
      items: [
        { id: '4', label: 'Reserva de Passagem', description: 'Voo confirmado.', checked: false },
        { id: '5', label: 'Reservas de Hospedagem', description: 'Confirmar hotel.', checked: false },
        { id: '6', label: 'Câmbio de Moeda', description: 'Comprar moeda local.', checked: false },
      ],
    },
    {
      title: 'Antes de embarcar',
      items: [
        { id: '7', label: 'Check-in Online', description: 'Fazer 24h antes do embarque.', checked: false },
        { id: '8', label: 'Bagagem de Mão', description: 'Separar eletrônicos, remédios e documentos.', checked: false },
        { id: '9', label: 'Chip Internacional', description: 'Configurar chip de dados.', checked: false },
      ],
    },
  ]);

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const checkedItems = sections.reduce((acc, s) => acc + s.items.filter(i => i.checked).length, 0);
  const progress = Math.round((checkedItems / totalItems) * 100);

  function toggleItem(sectionIdx: number, itemIdx: number) {
    setSections(prev => prev.map((s, si) => {
      if (si !== sectionIdx) return s;
      return {
        ...s,
        items: s.items.map((item, ii) => {
          if (ii !== itemIdx) return item;
          return { ...item, checked: !item.checked };
        }),
      };
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg-strong)] mb-2">Checklist de Viagem</h2>
        <p className="text-sm text-[var(--muted)]">Japão · Tóquio</p>
      </div>

      {/* Progresso */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-soft p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[var(--fg-strong)]">Progresso da viagem</span>
          <span className="text-sm font-bold text-[var(--accent)]">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">{checkedItems}/{totalItems} itens concluídos</p>
      </div>

      {/* Seções */}
      {sections.map((section, si) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wide mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.items.map((item, ii) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(si, ii)}
                className="flex w-full items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-left hover:bg-[var(--accent-soft)] transition-colors"
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                  item.checked
                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                    : 'border-[var(--border-strong)] bg-[var(--surface)]'
                }`}>
                  {item.checked && <Check className="h-4 w-4 text-white" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${item.checked ? 'text-[var(--muted)] line-through' : 'text-[var(--fg-strong)]'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--muted-soft)] mt-0.5">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--fg-strong)] hover:bg-[var(--accent-soft)] transition-colors">
          <Plus className="h-4 w-4" /> Adicionar Nova Tarefa
        </button>
        <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white hover:brightness-110 transition-all">
          Ver Requisitos Detalhados
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}