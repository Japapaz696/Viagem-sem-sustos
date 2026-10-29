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
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
        active
          ? 'border-[#2563EB]/30 bg-gradient-to-r from-[#2563EB]/10 to-[#2563EB]/5 text-[#0F172A] shadow-[0_0_20px_rgba(37,99,235,0.12)]'
          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
      }`}
    >
      {label}
    </motion.button>
  );
}
