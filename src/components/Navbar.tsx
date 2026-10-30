'use client';

import { Compass, Map, Bookmark, Settings, Plane, ClipboardList, GitCompare, Calendar, MoreHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const desktopItems = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'planejar', label: 'Planejar', icon: Calendar },
  { id: 'checklist', label: 'Checklist', icon: ClipboardList },
  { id: 'comparar', label: 'Comparar', icon: GitCompare },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

const mobileVisibleItems = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'planejar', label: 'Planejar', icon: Calendar },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

const mobileMoreItems = [
  { id: 'checklist', label: 'Checklist', icon: ClipboardList },
  { id: 'comparar', label: 'Comparar', icon: GitCompare },
];

export default function Navbar({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:h-screen md:sticky md:top-0 md:shrink-0 md:border-r md:border-[var(--border)] md:bg-[var(--surface)]">
        <div className="p-5">
          <a href="#" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 rounded-lg p-1 -m-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]">
              <Plane className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--fg-strong)] tracking-tight leading-tight">ViagemSemSusto</h2>
              <p className="text-[10px] text-[var(--muted)]">Guia de viagem e visto</p>
            </div>
          </a>
        </div>

        <nav aria-label="Navegação principal" className="flex-1 px-3 py-2">
          <ul className="space-y-0.5">
            {desktopItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChange(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[var(--accent)]" />
                    )}
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted-soft)]'}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] md:hidden" aria-label="Navegação principal">
        <ul className="flex items-center justify-around px-1 py-1.5">
          {mobileVisibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => { onChange(item.id); setMoreOpen(false); }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
              aria-label="Mais opções"
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                mobileMoreItems.some(i => i.id === active) ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`}
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
              <span>Mais</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile More Menu */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-16 left-2 right-2 z-50 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-md md:hidden"
          >
            <ul className="p-2 space-y-1">
              {mobileMoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => { onChange(item.id); setMoreOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)]'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-muted)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span>Fechar</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}