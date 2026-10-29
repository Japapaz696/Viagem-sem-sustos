'use client';

import { Compass, Map, Bookmark, Settings } from 'lucide-react';

const items = [
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'destinations', label: 'Destinos', icon: Map },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/5 bg-white/80 px-2 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 md:hidden"
      aria-label="Navegação principal"
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] ${
                  isActive ? 'text-[#007AFF]' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
