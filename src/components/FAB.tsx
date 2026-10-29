'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB({ onClick, label = 'Ação rápida' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-[0_8px_30px_rgba(0,122,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 md:bottom-8 md:right-8"
    >
      <Plus className="h-6 w-6" aria-hidden="true" />
    </motion.button>
  );
}
