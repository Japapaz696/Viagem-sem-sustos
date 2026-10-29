'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useState, useMemo } from 'react';
import countriesData from '@/data/countries.json';
import type { Country } from '@/types/country';

const countries = countriesData as Country[];

const COORDS: Record<string, [number, number]> = {
  br: [-55, -15],
  pt: [-8, 39.5],
  us: [-100, 38],
  jp: [138, 36],
  th: [101, 15],
  de: [9.5, 51.5],
  ar: [-62, -36],
  cl: [-71, -34],
  mx: [-102, 23],
  it: [12.5, 42.5],
  fr: [2, 46],
  ca: [-106, 56],
  gb: [-1.5, 52],
  co: [-75, 5],
  uy: [-56, -33],
  es: [-3, 40],
};

function getPinColor(type: string) {
  switch (type) {
    case 'exempt': return '#10b981'; // verde
    case 'evisa': return '#f59e0b'; // amarelo
    case 'arrival': return '#f59e0b';
    case 'required': return '#f43f5e'; // vermelho
    default: return '#64748b';
  }
}

export default function MapView({
  selected,
  onSelect,
}: {
  selected: Country | null;
  onSelect: (c: Country) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pins = useMemo(() => countries.map((c) => {
    const [x, y] = COORDS[c.id] ?? [0, 0];
    const color = getPinColor(c.visa.type);
    return { c, x, y, color };
  }), []);

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden glass-strong shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className="relative h-[520px] bg-gradient-to-br from-[#0B0F17] via-[#111827] to-[#0B0F17] overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        {/* World outline (simplified SVG) */}
        <svg viewBox="-180 -90 360 180" className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMid meet">
          <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" fill="none">
            <ellipse cx="0" cy="0" rx="170" ry="85" />
            <path d="M -40 -70 Q 20 -50 80 -30 L 120 -20 L 140 -5 L 160 15 L 120 30 L 80 10 L 20 20 L -60 -10 Z" />
          </g>
        </svg>

        {/* Pins */}
        {pins.map(({ c, x, y, color }) => {
          const isSelected = selected?.id === c.id;
          const isHovered = hoveredId === c.id;
          const cx = ((x + 180) / 360) * 100;
          const cy = ((90 - y) / 180) * 100;
          return (
            <motion.button
              key={c.id}
              type="button"
              onMouseEnter={() => setHoveredId(c.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(c)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="absolute z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
              style={{ left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%, -50%)' }}
              aria-label={`Ver detalhes de ${c.name}`}
            >
              <span className="relative block" style={{ filter: isSelected || isHovered ? 'drop-shadow(0 0 14px rgba(255,255,255,0.6))' : 'none' }}>
                {/* Pulse ring */}
                <span className="absolute -inset-2 rounded-full animate-ping" style={{ backgroundColor: color + '40' }} aria-hidden="true" />
                <span
                  className="relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg ring-2 ring-white/20"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
                <span
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-white/90"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                >
                  {c.name}
                </span>
              </span>
            </motion.button>
          );
        })}

        {/* Tooltip on hover */}
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-40 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl pointer-events-none"
              style={{
                left: (() => {
                  const p = pins.find((p) => p.c.id === hoveredId);
                  if (!p) return '50%';
                  const cx = ((p.x + 180) / 360) * 100;
                  if (cx < 35) return '10%';
                  if (cx > 65) return '90%';
                  return '50%';
                })(),
                top: (() => {
                  const p = pins.find((p) => p.c.id === hoveredId);
                  if (!p) return '20%';
                  const cy = ((90 - p.y) / 180) * 100;
                  return `${Math.min(Math.max(cy, 12), 88)}%`;
                })(),
              }}
            >
              {(() => {
                const c = countries.find((c) => c.id === hoveredId);
                if (!c) return null;
                return (
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 w-56 shadow-2xl">
                    <img
                      src={`https://picsum.photos/seed/${c.id}-map/120/120`}
                      alt={c.name}
                      className="h-12 w-12 rounded-xl object-cover shadow-md"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-white/60">{c.flag} · {c.visa.label}</div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header overlay */}
      <div className="absolute top-4 left-5 z-20">
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="h-4 w-4 text-[var(--accent)]" />
          <h2 className="text-base font-bold tracking-tight">Mapa de Destinos</h2>
        </div>
        <p className="text-xs text-white/50 mt-0.5">Toque em um pin para ver detalhes</p>
      </div>
    </div>
  );
}
