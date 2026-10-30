'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const TONE_CLASSES = {
  default: 'border-[var(--border)] bg-[var(--card)] text-[var(--fg-strong)]',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300',
} as const;

export default function RequirementCard({
  icon: Icon,
  title,
  value,
  description,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className={`rounded-card border p-4 ${toneClass}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
      </div>

      {value && (
        <p className="text-xl font-bold tracking-tight leading-none mb-1">{value}</p>
      )}
      {description && (
        <p className="text-xs text-[var(--muted)] leading-relaxed">{description}</p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
}