'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { generateShareText } from '@/utils/share';
import type { Country } from '@/types/country';

export default function ShareButton({ country }: { country: Country }) {
  const [canShare] = useState(
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  );

  async function handleShare() {
    if (!canShare) return;
    try {
      await navigator.share({
        title: `Viagem sem Susto — ${country.name}`,
        text: generateShareText(country),
      });
    } catch {
      // user cancelled or unsupported
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full bg-[#007AFF] px-6 py-3 font-medium text-white shadow-sm transition-transform active:scale-95 hover:bg-[#0062cc]"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </button>
      )}
    </div>
  );
}
