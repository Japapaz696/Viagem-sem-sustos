export function getDestinationImage(countryId: string): string {
  // Fotos locais em public/imagens/Destinos/images-destinos, nomeadas pelo ID do país.
  return `/imagens/Destinos/images-destinos/${countryId.toLowerCase()}.jpg`;
}

export function getFlagEmoji(countryId: string): string {
  const map: Record<string, string> = {
    br: '🇧🇷', pt: '🇵🇹', us: '🇺🇸', jp: '🇯🇵', th: '🇹🇭', de: '🇩🇪',
    ar: '🇦🇷', cl: '🇨🇱', mx: '🇲🇽', it: '🇮🇹', fr: '🇫🇷', ca: '🇨🇦',
    gb: '🇬🇧', co: '🇨🇴', uy: '🇺🇾', es: '🇪🇸',
  };
  return map[countryId] ?? '🌍';
}
