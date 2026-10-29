import type { Country } from '@/types/country';

export function generateShareText(country: Country): string {
  const vaccines =
    country.vaccines.required.length > 0
      ? `Obrigatórias: ${country.vaccines.required.join(', ')}`
      : country.vaccines.recommended.length > 0
      ? `Recomendadas: ${country.vaccines.recommended.join(', ')}`
      : 'Nenhuma obrigatória';

  return [
    `✈️ Requisitos de viagem para ${country.name} ${country.flag}:`,
    `🛂 Visto: ${country.visa.label}`,
    `📖 Passaporte: ${country.passport.minValidityMonths} meses de validade mínima`,
    `💉 Vacinas: ${vaccines}`,
    `⏱️ Permanência: ${country.maxStayDays} dias`,
    '',
    'Confira no ViagemSemSusto!',
  ].join('\n');
}

export function buildShareText(countryName: string, visaLabel: string, maxStayDays: number): string {
  return `Viagem sem Susto — ${countryName}\nVisto: ${visaLabel}\nEstadia máxima: ${maxStayDays} dias\nPlaneje sua viagem com segurança.`;
}

export async function shareCountry(countryName: string, visaLabel: string, maxStayDays: number): Promise<boolean> {
  const text = buildShareText(countryName, visaLabel, maxStayDays);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: `Viagem sem Susto — ${countryName}`, text });
      return true;
    } catch {
      return false;
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
