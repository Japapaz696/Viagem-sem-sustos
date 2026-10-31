'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SideSheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusable = () => panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    requestAnimationFrame(() => (focusable()?.[0] ?? panel)?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items?.length) {
        event.preventDefault();
        panel?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-sheet-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-dvh w-full max-w-[420px] overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-2xl outline-none md:w-[420px]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <h2 id="destination-sheet-title" className="text-base font-bold tracking-tight text-[var(--fg-strong)]">{title ?? 'Detalhes'}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--fg-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label="Fechar painel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
