'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { generateShareText } from '@/utils/share';
import type { Country } from '@/types/country';

export default function ShareButton({ country }: { country: Country }) {
  const [status, setStatus] = useState('');

  async function copyText(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Não foi possível copiar o texto.');
  }

  async function handleShare() {
    const text = generateShareText(country);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Viagem sem Susto — ${country.name}`, text });
        setStatus('Compartilhamento concluído.');
      } else {
        await copyText(text);
        setStatus('Requisitos copiados para a área de transferência.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      try {
        await copyText(text);
        setStatus('Não foi possível abrir o compartilhamento. Texto copiado.');
      } catch {
        setStatus('Não foi possível compartilhar nem copiar.');
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Compartilhar ou copiar
      </button>
      <span className="sr-only" aria-live="polite">{status}</span>
    </div>
  );
}
