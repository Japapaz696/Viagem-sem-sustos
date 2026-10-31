import type { Country } from '@/types/country';
import { getPassportRule } from '@/utils/passportRules';

export function generateShareText(country: Country): string {
  const vaccines =
    country.vaccines.required.length > 0
      ? `Obrigatórias: ${country.vaccines.required.join(', ')}`
      : country.vaccines.recommended.length > 0
      ? `Recomendadas: ${country.vaccines.recommended.join(', ')}`
      : 'Nenhuma obrigatória';

  const passportRule = getPassportRule(
    country.id,
    country.passport.minValidityMonths,
    country.passport.details,
  );
  const passport = passportRule === 'origin'
    ? 'Não se aplica (país de origem)'
    : country.passport.minValidityMonths > 0
      ? `${country.passport.minValidityMonths} meses de validade mínima. ${country.passport.details}`
      : country.passport.details || 'Consulte a fonte oficial';
  const stay = country.id === 'br'
    ? 'Não se aplica (país de origem)'
    : country.maxStayDays > 0
      ? `${country.maxStayDays} dias`
      : 'Não informado nos dados cadastrados';

  return [
    `✈️ Requisitos de viagem para ${country.name} ${country.flag}:`,
    `🛂 Visto: ${country.visa.label}`,
    `📖 Passaporte: ${passport}`,
    `💉 Vacinas: ${vaccines}`,
    `⏱️ Permanência: ${stay}`,
    `🔎 Fonte principal: ${country.officialUrl}`,
    `📅 Dados revisados em: ${country.lastUpdated}`,
    '',
    'Confira no ViagemSemSusto!',
  ].join('\n');
}

