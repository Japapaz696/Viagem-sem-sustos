'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bookmark, Compass, Map, Settings, X } from 'lucide-react';
import { useEffect } from 'react';
import BrandLogo from './BrandLogo';

const desktopItems = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

const mobileVisibleItems = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];
export function MenuToggle({ open, onClick, inverse = false }: { open: boolean; onClick: () => void; inverse?: boolean }) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' as const };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={open}
      aria-controls="primary-navigation-drawer"
      className={`group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 ${inverse ? 'text-white hover:bg-white/10 focus-visible:ring-white' : 'text-[var(--fg-strong)] hover:bg-[var(--surface-muted)] focus-visible:ring-[var(--accent)]'}`}
    >
      <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
      <span className="relative h-5 w-5" aria-hidden="true">
        <motion.span animate={open ? { top: 9, rotate: 45 } : { top: 3, rotate: 0 }} transition={transition} className="absolute left-0 h-[2px] w-5 rounded-full bg-current" />
        <motion.span animate={open ? { opacity: 0, scaleX: 0.5 } : { opacity: 1, scaleX: 1 }} transition={transition} className="absolute left-0 top-[9px] h-[2px] w-5 rounded-full bg-current" />
        <motion.span animate={open ? { top: 9, rotate: -45 } : { top: 15, rotate: 0 }} transition={transition} className="absolute left-0 h-[2px] w-5 rounded-full bg-current" />
      </span>
    </button>
  );
}

export default function Navbar({ active, onChange, open, onClose }: {
  active: string;
  onChange: (id: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar menu de navegação"
              onClick={onClose}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="fixed inset-0 z-50 cursor-default bg-slate-950/35"
            />
            <motion.aside
              id="primary-navigation-drawer"
              aria-label="Menu principal"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: reduceMotion ? 'tween' : 'spring', stiffness: 360, damping: 34, duration: reduceMotion ? 0 : undefined }}
              className="fixed inset-y-0 left-0 z-[51] flex w-[min(18rem,88vw)] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            >
              <div className="flex h-[68px] items-center justify-between border-b border-[var(--border)] px-5">
                <BrandLogo />
                <button type="button" onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-5">
                <p className="px-3 pb-2 text-xs font-medium text-[var(--muted)]">Seu espaço de viagem</p>
                <ul className="space-y-1">
                  {desktopItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === active;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => { onChange(item.id); onClose(); }}
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--fg)] hover:bg-[var(--surface-muted)]'}`}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="border-t border-[var(--border)] px-5 py-4 text-xs text-[var(--muted)]">Viaje com informação e tranquilidade.</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] md:hidden" aria-label="Navegação principal">
        <ul className="flex items-center justify-around px-1 py-1.5">
          {mobileVisibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <button type="button" onClick={() => onChange(item.id)} aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" /><span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
