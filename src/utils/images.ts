export function getDestinationImage(countryId: string): string {
  // Fotos locais em public/imagens/Destinos/images-destinos, nomeadas pelo ID do país.
  return `/imagens/Destinos/images-destinos/${countryId.toLowerCase()}.jpg`;
}

