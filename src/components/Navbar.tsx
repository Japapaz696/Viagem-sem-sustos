'use client';

import { Compass, Map, Bookmark, Settings, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const items = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export default function Navbar({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:h-screen md:sticky md:top-0 md:border-r md:border-[#E2E8F0] md:bg-white/70 md:backdrop-blur-2xl shadow-[4px_0_24px_rgba(37,99,235,0.04)]">
        <div className="p-6">
          <a href="#" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 rounded-2xl p-2 -m-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/5 border border-[#E2E8F0] shadow-sm group-hover:shadow-md transition-all">
              <Plane className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight leading-tight">ViagemSemSusto</h2>
              <p className="text-[10px] text-[#94A3B8] font-medium">Seu guia de viagem e visto</p>
            </div>
          </a>
        </div>

        <nav aria-label="Navegação principal" className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChange(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
                      isActive
                        ? 'bg-[#F0F6FF] text-[#2563EB] shadow-[inset_0_1px_0_0_rgba(37,99,235,0.08)]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#2563EB]" />
                    )}
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`} aria-hidden="true" />
                    <span className="font-medium tracking-tight">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E8F0] bg-white/85 backdrop-blur-2xl md:hidden shadow-[0_-4px_24px_rgba(37,99,235,0.05)]" aria-label="Navegação principal">
        <ul className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
                    isActive ? 'text-[#2563EB]' : 'text-[#94A3B8] hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
