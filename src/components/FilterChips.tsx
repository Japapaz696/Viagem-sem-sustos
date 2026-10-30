'use client';

import { motion } from 'framer-motion';
import FilterChip from './FilterChip';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'exempt', label: 'Sem visto' },
  { id: 'south-america', label: 'América do Sul' },
  { id: 'schengen', label: 'Schengen' },
  { id: 'evisa', label: 'E-Visa' },
];

export default function FilterChips({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <motion.div
      className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filtros de destino"
    >
      {FILTERS.map((f) => (
        <FilterChip key={f.id} label={f.label} active={f.id === active} onClick={() => onChange(f.id)} />
      ))}
    </motion.div>
  );
}
