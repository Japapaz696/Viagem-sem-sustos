'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { useRef } from 'react';

const mainRoute = 'M 42 252 C 174 51, 337 279, 492 148 S 754 20, 928 105';
const northRoute = 'M 226 238 C 340 190, 421 76, 576 84';
const southRoute = 'M 470 266 C 647 246, 792 73, 934 64';

export default function HeroFlightAnimation() {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sceneRef, { margin: '80px' });
  const shouldAnimate = !reduceMotion && isInView;

  return (
    <div ref={sceneRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.36] sm:opacity-50">
        <defs>
          <radialGradient id="globe-fill" cx="48%" cy="44%" r="58%">
            <stop offset="0" stopColor="#A9E7F5" stopOpacity="0.14" />
            <stop offset="1" stopColor="#A9E7F5" stopOpacity="0.015" />
          </radialGradient>
          <linearGradient id="route-main" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#BCEEFF" stopOpacity="0.4" />
            <stop offset="0.55" stopColor="#E4FAFF" stopOpacity="1" />
            <stop offset="1" stopColor="#91DDF4" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="route-secondary" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#83D8EF" stopOpacity="0.1" />
            <stop offset="1" stopColor="#83D8EF" stopOpacity="0.62" />
          </linearGradient>
        </defs>

        {/* Globo e linhas cartográficas */}
        <circle cx="756" cy="150" r="190" fill="url(#globe-fill)" stroke="#BCEEFF" strokeOpacity="0.12" />
        <ellipse cx="756" cy="150" rx="135" ry="190" fill="none" stroke="#BCEEFF" strokeOpacity="0.105" />
        <ellipse cx="756" cy="150" rx="62" ry="190" fill="none" stroke="#BCEEFF" strokeOpacity="0.09" />
        <ellipse cx="756" cy="150" rx="190" ry="116" fill="none" stroke="#BCEEFF" strokeOpacity="0.1" />
        <ellipse cx="756" cy="150" rx="190" ry="52" fill="none" stroke="#BCEEFF" strokeOpacity="0.09" />
        <path d="M 573 149 H 939 M 756 -40 V 340" stroke="#BCEEFF" strokeOpacity="0.08" strokeDasharray="2 9" />

        {/* Ligações de destinos: as rotas suaves ficam ao fundo da rota principal */}
        <motion.path d={northRoute} fill="none" stroke="url(#route-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 12"
          animate={shouldAnimate ? { strokeDashoffset: [0, -64] } : { strokeDashoffset: 0 }}
          transition={{ duration: 15, ease: 'linear', repeat: Infinity }} />
        <motion.path d={southRoute} fill="none" stroke="url(#route-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 12"
          animate={shouldAnimate ? { strokeDashoffset: [0, -64] } : { strokeDashoffset: 0 }}
          transition={{ duration: 19, ease: 'linear', repeat: Infinity, delay: 2 }} />
        <motion.path d={mainRoute} fill="none" stroke="url(#route-main)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 12"
          animate={shouldAnimate ? { strokeDashoffset: [0, -68] } : { strokeDashoffset: 0 }}
          transition={{ duration: 11, ease: 'linear', repeat: Infinity }} />

        {/* Pontos de partida e chegada */}
        <circle cx="42" cy="252" r="3.5" fill="#E4FAFF" fillOpacity="0.85" />
        <circle cx="492" cy="148" r="3" fill="#BCEEFF" fillOpacity="0.72" />
        <circle cx="928" cy="105" r="5" fill="#E4FAFF" fillOpacity="0.9" />
        <circle cx="928" cy="105" r="12" fill="none" stroke="#E4FAFF" strokeOpacity="0.5" />
        {shouldAnimate && (
          <motion.circle cx="928" cy="105" r="17" fill="none" stroke="#E4FAFF" strokeWidth="1"
            animate={{ opacity: [0.04, 0.58, 0.04] }}
            transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity, delay: 1 }} />
        )}
        {shouldAnimate ? (
          <motion.g animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity, repeatDelay: 2, delay: 1.5, times: [0, 0.06, 0.9, 1] }}>
            <motion.g
              initial={{ x: 42, y: 252 }}
              animate={{
                x: [42, 87, 125, 168, 213, 258, 305, 351, 398, 445, 492, 537, 580, 622, 662, 703, 744, 786, 833, 878, 928],
                y: [252, 204, 176, 166, 166, 174, 183, 190, 190, 178, 148, 113, 85, 66, 52, 46, 46, 52, 64, 82, 105],
              }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity, repeatDelay: 2, delay: 1.5 }}
            >
              <foreignObject x="-15" y="-15" width="30" height="30">
                <Plane className="h-[30px] w-[30px] text-sky-100 drop-shadow-sm" strokeWidth={1.7} />
              </foreignObject>
            </motion.g>
          </motion.g>
        ) : (
          <foreignObject x="913" y="90" width="30" height="30">
            <Plane className="h-[30px] w-[30px] text-sky-100" strokeWidth={1.7} />
          </foreignObject>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D4B78] via-[#0D4B78]/85 to-[#0D4B78]/15" />
    </div>
  );
}
