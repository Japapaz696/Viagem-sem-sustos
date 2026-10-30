'use client';

import { Compass, Map, Bookmark, Settings, Plane, ClipboardList, GitCompare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const items = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'planejar', label: 'Planejar', icon: Calendar },
  { id: 'checklist', label: 'Checklist', icon: ClipboardList },
  { id: 'comparar', label: 'Comparar', icon: GitCompare },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export default function Navbar({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:h-screen md:sticky md:top-0 md:shrink-0 md:border-r md:border-[var(--border)] md:bg-[var(--surface)]/80 md:backdrop-blur-2xl shadow-[4px_0_24px_rgba(37,99,235,0.06)]">
        <div className="p-6">
          <a href="#" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 rounded-2xl p-2 -m-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent-soft)] border border-[var(--border)] shadow-sm group-hover:shadow-md transition-all">
              <Plane className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--fg-strong)] tracking-tight leading-tight">ViagemSemSusto</h2>
              <p className="text-[10px] text-[var(--muted)] font-medium">Seu guia de viagem e visto</p>
            </div>
          </a>
        </div>

        <nav aria-label="Navegação principal" className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChange(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-[inset_0_1px_0_0_rgba(37,99,235,0.08)]'
                        : 'text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--fg-strong)]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#2563EB]" />
                    )}
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted-soft)]'}`} aria-hidden="true" />
                    <span className="font-medium tracking-tight">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-2xl md:hidden shadow-[0_-4px_24px_rgba(37,99,235,0.08)]" aria-label="Navegação principal">
        <ul className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[9px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--fg-strong)]'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
