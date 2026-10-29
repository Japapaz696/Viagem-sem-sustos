'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-[420px] overflow-y-auto border-l border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.5)] md:w-[420px]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0B0F17]/95 px-6 py-5 backdrop-blur-xl">
              <h2 className="text-base font-bold text-white tracking-tight">{title ?? 'Detalhes'}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Fechar painel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
