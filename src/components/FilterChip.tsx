'use client';

import { motion } from 'framer-motion';

export default function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      animate={active ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
        active
          ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] scale-105'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--fg-strong)] hover:bg-[var(--accent-soft)]'
      }`}
    >
      {label}
    </motion.button>
  );
}
