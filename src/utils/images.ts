export function getDestinationImage(countryId: string): string {
  const map: Record<string, string> = {
    br: 'https://images.unsplash.com/photo-1983062704458-cf9426a8e6b7?auto=format&fit=crop&w=1200&q=80',
    pt: 'https://images.unsplash.com/photo-1555140006-6f7f7dcc681d?auto=format&fit=crop&w=1200&q=80',
    us: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
    jp: 'https://images.unsplash.com/photo-1493933866599-e45e6506c99d?auto=format&fit=crop&w=1200&q=80',
    th: 'https://images.unsplash.com/photo-1508004466986-0807e19ca6e0?auto=format&fit=crop&w=1200&q=80',
    de: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    ar: 'https://images.unsplash.com/photo-1589275263666-6334223bd6d1?auto=format&fit=crop&w=1200&q=80',
    cl: 'https://images.unsplash.com/photo-1568515379083-9d1ca0d6c8d0?auto=format&fit=crop&w=1200&q=80',
    mx: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80',
    it: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    fr: 'https://images.unsplash.com/photo-1502602898657-3e9672bab152?auto=format&fit=crop&w=1200&q=80',
    ca: 'https://images.unsplash.com/photo-1517930238138-0ba9f417b69d?auto=format&fit=crop&w=1200&q=80',
    gb: 'https://images.unsplash.com/photo-1505873242700-6974d3567456?auto=format&fit=crop&w=1200&q=80',
    co: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
    uy: 'https://images.unsplash.com/photo-1525059861140-d6587f0041ad?auto=format&fit=crop&w=1200&q=80',
    es: 'https://images.unsplash.com/photo-1540051384758-baf192ee5a9d?auto=format&fit=crop&w=1200&q=80',
  };
  return map[countryId] ?? `https://images.unsplash.com/photo-1488646953014-85cb44e4592b?auto=format&fit=crop&w=1200&q=80`;
}

export function getFlagEmoji(countryId: string): string {
  const map: Record<string, string> = {
    br: '🇧🇷', pt: '🇵🇹', us: '🇺🇸', jp: '🇯🇵', th: '🇹🇭', de: '🇩🇪',
    ar: '🇦🇷', cl: '🇨🇱', mx: '🇲🇽', it: '🇮🇹', fr: '🇫🇷', ca: '🇨🇦',
    gb: '🇬🇧', co: '🇨🇴', uy: '🇺🇾', es: '🇪🇸',
  };
  return map[countryId] ?? '🌍';
}