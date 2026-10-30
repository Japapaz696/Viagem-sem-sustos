import { Plane, ShieldCheck } from 'lucide-react';

export default function BrandLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center ${inverse ? 'text-white' : 'text-[var(--accent)]'}`} aria-hidden="true">
        <ShieldCheck className="h-9 w-9" strokeWidth={1.8} />
        <Plane className={`absolute h-4 w-4 rotate-[-18deg] ${inverse ? 'fill-[#0D4B78]' : 'fill-[var(--surface)]'}`} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className={`text-[15px] font-bold tracking-[-0.035em] ${inverse ? 'text-white' : 'text-[var(--fg-strong)]'}`}>
          Viagem<span className={inverse ? 'text-sky-200' : 'text-[var(--accent)]'}>SemSusto</span>
        </span>
      )}
    </span>
  );
}
