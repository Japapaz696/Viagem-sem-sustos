'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const TONE_CLASSES = {
  default: 'border-white/[0.06] bg-white/[0.03] text-white text-slate-300',
  danger: 'border-rose-500/20 bg-rose-950/30 text-rose-300 dark:border-rose-500/40 dark:bg-rose-950/20 dark:text-rose-400',
  warning: 'border-amber-500/20 bg-amber-950/30 text-amber-300 dark:border-amber-500/40 dark:bg-amber-950/20 dark:text-amber-400',
  success: 'border-emerald-500/20 bg-emerald-950/30 text-emerald-300 dark:border-emerald-500/40 dark:bg-emerald-950/20 dark:text-emerald-400',
} as const;

export default function RequirementCard({
  icon: Icon,
  title,
  value,
  description,
  accent = 'text-indigo-400',
  tone = 'default',
  children,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  value?: string;
  description?: string;
  accent?: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  children?: React.ReactNode;
  index?: number;
}) {
  const toneClass = TONE_CLASSES[tone];

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
      className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${toneClass}`}
    >
      <div className="flex items-center justify-between gap-4 mb-4 pr-4">
        <div className={`flex items-center gap-2.5 ${accent}`}>
          <div className="h-8 w-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm shadow-md shadow-indigo-900/10">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
        </div>
        <span className="relative h-7 w-7 rounded-full border border-white/[0.12] bg-white/[0.03] flex items-center justify-center text-[10px] font-bold text-slate-300 z-10">
          {String(index + 1)}
        </span>
      </div>

      {value && (
        <div className="mb-2">
          <p className="text-3xl font-extrabold text-white tracking-tight leading-none">{value}</p>
        </div>
      )}
      {description && (
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </motion.div>
  );
}
