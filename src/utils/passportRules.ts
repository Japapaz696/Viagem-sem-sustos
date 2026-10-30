export type PassportRuleKind = 'origin' | 'identity-document' | 'during-stay' | 'after-return' | 'after-travel' | 'ambiguous';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function getPassportRule(countryId: string, minValidityMonths: number, details: string): PassportRuleKind {
  if (countryId === 'br') return 'origin';
  const text = normalize(details);
  if (/\brg\b|identidade/.test(text)) return 'identity-document';
  if (/durante (toda )?a estadia|durante toda a permanencia|ao longo da estadia/.test(text)) return 'during-stay';
  if (/retorno|saida/.test(text) || /apos.{0,30}(retorno|saida)/.test(text) || /alem da data de retorno/.test(text)) return 'after-return';
  if (minValidityMonths > 0 && /data (da|de) (viagem|embarque|entrada)/.test(text)) return 'after-travel';
  return minValidityMonths > 0 ? 'ambiguous' : 'during-stay';
}

export function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  result.setDate(Math.min(day, new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()));
  return result;
}
