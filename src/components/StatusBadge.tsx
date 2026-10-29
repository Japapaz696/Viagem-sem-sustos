import type { Country } from '@/types/country';

type VisaType = Country['visa']['type'];

const styles: Record<VisaType, string> = {
  exempt: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  evisa: 'bg-amber-50 text-amber-700 border-amber-200',
  arrival: 'bg-amber-50 text-amber-700 border-amber-200',
  required: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function StatusBadge({ type, label }: { type: VisaType; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase border ${styles[type]}`}>
      {label}
    </span>
  );
}
