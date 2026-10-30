'use client';

import { geoDistance, geoGraticule10, geoOrthographic, geoPath, geoRotation, type GeoPermissibleObjects } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, MoveDown, MoveLeft, MoveRight, MoveUp, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { Country } from '@/types/country';
import worldAtlas from 'world-atlas/countries-110m.json';

const COORDS: Record<string, [number, number]> = {
  br: [-55, -15], pt: [-8, 39.5], us: [-100, 38], jp: [138, 36], th: [101, 15], de: [9.5, 51.5],
  ar: [-62, -36], cl: [-71, -34], mx: [-102, 23], it: [12.5, 42.5], fr: [2, 46], ca: [-106, 56],
  gb: [-1.5, 52], co: [-75, 5], uy: [-56, -33], es: [-3, 40],
};

const worldTopology = worldAtlas as unknown as Parameters<typeof mesh>[0];
const land = feature(worldTopology, worldTopology.objects.land) as GeoPermissibleObjects;
const countryBorders = mesh(
  worldTopology,
  worldTopology.objects.countries as unknown as Parameters<typeof mesh>[1],
  (a, b) => a !== b,
);

const MARKER_COLORS: Record<string, string> = {
  exempt: '#16845B',
  evisa: '#C88716',
  arrival: '#C88716',
  required: '#C34E52',
};
const REGION_ROTATIONS: Record<string, [number, number]> = {
  all: [20, 0],
  'south-america': [55, 15],
  'north-america': [100, -38],
  europe: [-10, -48],
  asia: [-115, -25],
};

const wrapAngle = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180;

export default function MapView({ countries, selected, region, onSelect }: {
  countries: Country[];
  selected: Country | null;
  region: string;
  onSelect: (country: Country) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [rotation, setRotation] = useState<[number, number]>([20, 0]);
  const dragOrigin = useRef<{ x: number; y: number; rotation: [number, number] } | null>(null);

  useEffect(() => {
    setRotation(REGION_ROTATIONS[region] ?? REGION_ROTATIONS.all);
  }, [region]);

  useEffect(() => {
    if (!selected) return;
    const coordinates = COORDS[selected.id];
    if (coordinates) setRotation([wrapAngle(-coordinates[0]), wrapAngle(-coordinates[1])]);
  }, [selected?.id]);

  const projection = useMemo(() => geoOrthographic()
    .translate([500, 250])
    .scale(232)
    .clipAngle(90)
    .precision(0.6)
    .rotate([rotation[0], rotation[1], 0]), [rotation]);
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const graticulePath = useMemo(() => pathGenerator(geoGraticule10()) ?? '', [pathGenerator]);
  const spherePath = useMemo(() => pathGenerator({ type: 'Sphere' }) ?? '', [pathGenerator]);
  const landPath = useMemo(() => pathGenerator(land) ?? '', [pathGenerator]);
  const countryBordersPath = useMemo(() => pathGenerator(countryBorders) ?? '', [pathGenerator]);
  const rotatePoint = useMemo(() => geoRotation(projection.rotate()), [projection]);

  const rotateBy = (longitude: number, latitude: number) => {
    setRotation(([currentLongitude, currentLatitude]) => [
      wrapAngle(currentLongitude + longitude),
      wrapAngle(currentLatitude + latitude),
    ]);
  };

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest('button')) return;
    dragOrigin.current = { x: event.clientX, y: event.clientY, rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragOrigin.current) return;
    const deltaX = event.clientX - dragOrigin.current.x;
    const deltaY = event.clientY - dragOrigin.current.y;
    setRotation([
      wrapAngle(dragOrigin.current.rotation[0] + deltaX * 0.45),
      wrapAngle(dragOrigin.current.rotation[1] - deltaY * 0.45),
    ]);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    dragOrigin.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const pins = countries.flatMap((country) => {
    const coordinates = COORDS[country.id];
    if (!coordinates) return [];
    const rotatedCoordinates = rotatePoint(coordinates);
    if (geoDistance([0, 0], rotatedCoordinates) > Math.PI / 2) return [];
    const point = projection(coordinates);
    if (!point) return [];
    return [{ country, x: point[0], y: point[1] }];
  });

  return (
    <div
      className="group/globe relative aspect-[2/1] min-h-[180px] touch-none select-none overflow-hidden bg-[#E8F1F3] cursor-grab active:cursor-grabbing dark:bg-[#1A2A30] sm:min-h-[280px] lg:min-h-[340px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={() => { dragOrigin.current = null; }}
    >
      <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" role="img" aria-label="Globo interativo com países disponíveis para consulta">
        <defs>
          <radialGradient id="globe-ocean" cx="33%" cy="25%" r="78%">
            <stop offset="0" stopColor="#A9D6DE" />
            <stop offset="0.58" stopColor="#5796A8" />
            <stop offset="1" stopColor="#173F54" />
          </radialGradient>
          <radialGradient id="globe-land" cx="32%" cy="24%" r="82%">
            <stop offset="0" stopColor="#D8D7B8" />
            <stop offset="0.63" stopColor="#9CA987" />
            <stop offset="1" stopColor="#5D776C" />
          </radialGradient>
          <radialGradient id="globe-shade" cx="34%" cy="27%" r="78%">
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.82" stopColor="#103347" stopOpacity="0.12" />
            <stop offset="1" stopColor="#071E2D" stopOpacity="0.58" />
          </radialGradient>
          <clipPath id="globe-clip"><circle cx="500" cy="250" r="232" /></clipPath>
        </defs>
        <path d={spherePath} fill="url(#globe-ocean)" />
        <g clipPath="url(#globe-clip)">
          <path d={graticulePath} fill="none" stroke="#E7F4F3" strokeOpacity="0.2" strokeWidth="0.75" />
          <path d={landPath} fill="url(#globe-land)" stroke="#E0DFC2" strokeOpacity="0.44" strokeWidth="0.8" />
          <path d={countryBordersPath} fill="none" stroke="#F3F1DB" strokeOpacity="0.53" strokeWidth="0.48" />
          <path d={graticulePath} fill="none" stroke="#15475A" strokeOpacity="0.14" strokeWidth="0.6" />
          <circle cx="500" cy="250" r="232" fill="url(#globe-shade)" />
        </g>
        <circle cx="500" cy="250" r="232" fill="none" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.5" />
        <circle cx="500" cy="250" r="236" fill="none" stroke="#668D96" strokeOpacity="0.23" strokeWidth="1" />
      </svg>

      {pins.map(({ country, x, y }) => {
        const isSelected = selected?.id === country.id;
        const markerColor = MARKER_COLORS[country.visa.type] ?? '#64748B';
        return (
          <motion.button
            key={country.id}
            type="button"
            onClick={() => onSelect(country)}
            title={`${country.flag} ${country.name} — ${country.visa.label}`}
            aria-label={`Selecionar ${country.name}. ${country.visa.label}`}
            aria-pressed={isSelected}
            whileHover={reduceMotion ? undefined : { scale: 1.18 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124D68] focus-visible:ring-offset-2"
            style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 500) * 100}%` }}
          >
            <span className={`absolute inset-1 rounded-full transition-transform duration-200 ${isSelected ? 'scale-125 border border-white/90' : 'scale-75 border border-transparent group-hover/globe:scale-100'}`} style={{ backgroundColor: `${markerColor}35` }} />
            <span className={`relative rounded-full border-2 border-white shadow-[0_1px_5px_rgba(20,50,60,.4)] transition-[width,height,box-shadow] ${isSelected ? 'h-4 w-4 ring-2 ring-[#14516F]/35' : 'h-3 w-3'}`} style={{ backgroundColor: markerColor }} />
            {isSelected && <span className="absolute left-6 top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-semibold text-[var(--fg-strong)] shadow-md">{country.name}</span>}
          </motion.button>
        );
      })}

      <div className="absolute right-3 top-3 grid grid-cols-3 gap-1 rounded-lg border border-white/70 bg-white/85 p-1 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/80" aria-label="Controles de rotação do globo">
        <span />
        <button type="button" onClick={() => rotateBy(0, 24)} aria-label="Girar o globo para cima" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-slate-200 dark:hover:bg-white/10"><MoveUp className="h-4 w-4" aria-hidden="true" /></button>
        <span />
        <button type="button" onClick={() => rotateBy(-24, 0)} aria-label="Girar o globo para a esquerda" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-slate-200 dark:hover:bg-white/10"><MoveLeft className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => setRotation([20, 0])} aria-label="Centralizar o globo" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-slate-200 dark:hover:bg-white/10"><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => rotateBy(24, 0)} aria-label="Girar o globo para a direita" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-slate-200 dark:hover:bg-white/10"><MoveRight className="h-4 w-4" aria-hidden="true" /></button>
        <span />
        <button type="button" onClick={() => rotateBy(0, -24)} aria-label="Girar o globo para baixo" className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-slate-200 dark:hover:bg-white/10"><MoveDown className="h-4 w-4" aria-hidden="true" /></button>
        <span />
      </div>

      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md border border-white/70 bg-white/85 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
        <MapPin className="h-3 w-3" aria-hidden="true" /> {countries.length} países <span className="mx-1 text-slate-400">·</span> Arraste para girar
      </div>
    </div>
  );
}
