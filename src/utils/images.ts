export function getDestinationImage(countryId: string): string {
  // Usar picsum.photos com seed determinístico por país para garantir disponibilidade
  return `https://picsum.photos/seed/${countryId}-travel/1200/800`;
}

export function getFlagEmoji(countryId: string): string {
  const map: Record<string, string> = {
    br: '🇧🇷', pt: '🇵🇹', us: '🇺🇸', jp: '🇯🇵', th: '🇹🇭', de: '🇩🇪',
    ar: '🇦🇷', cl: '🇨🇱', mx: '🇲🇽', it: '🇮🇹', fr: '🇫🇷', ca: '🇨🇦',
    gb: '🇬🇧', co: '🇨🇴', uy: '🇺🇾', es: '🇪🇸',
  };
  return map[countryId] ?? '🌍';
}