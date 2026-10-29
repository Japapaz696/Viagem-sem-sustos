'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  function handleClear() {
    setInput('');
    setAiResponse(null);
  }

  function simulateAI() {
    const q = input.toLowerCase();
    if (q.includes('eu quero para a europa sem visto') || q.includes('eu quero ir para europa sem visto')) {
      setAiResponse(`Ótima escolha! Vou mostrar os países que permitem entrada sem visto para você. Procure por Portugal (Schengen), Espanha, França e Alemanha — todos têm entrada isenta de visto para muitos nacionais (incluindo Brasil). Use os filtros 'Sem Visto' e 'Schengen' para encontrar o destino perfeito para você.`);
    } else if (q.includes('o que eu preciso para ir para o japão') || q.includes('japão visto')) {
      setAiResponse(`O Japão é isento de visto para muitas nacionalidades (incluindo Brasil) para até 90 dias. Você só precisará de um passaporte válido e interesse turístico. Não há visto necessário — é só saber da conveniência!`);
    } else if (q.includes('onde posso ficar sem visto por 30 dias') || q.includes('30 dias')) {
      setAiResponse(`Maravilhosa escolha de duração! Para países Schengen como Portugal, Espanha, Itália e França, você pode ficar até 90 dias no total a cada 180 dias. Pergunte sobre países específicos que aceitem sua permanência desejada.`);
    } else if (q.includes('febre amarela') || q.includes('vacina')) {
      setAiResponse(`A febre amarela é obrigatória para entrada em alguns países da América do Sul e África. Na nossa plataforma, os requisitos de vacina aparecem destacados para cada destino. Explore o destino e veja a lista completa de vacinas obrigatórias ou recomendadas!`);
    } else {
      setAiResponse(`Posso ajudar a encontrar seu destino ideal! Descreva para mim onde quer ir e qual seu passaporte. Vou sugerir países onde se encaixa no perfil (sem visto, e-Visa, duração de estadia, vacinas obrigatórias) e filtrar tudo rapidamente.`);
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto relative w-[380px] max-w-[92vw] glass-strong rounded-[24px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Assistente de Viagem com IA</h3>
                <p className="text-xs text-white/60">Encontre o país certo para você</p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="Para onde você quer ir e qual seu passaporte?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] px-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={simulateAI}
                  disabled={!input.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 font-medium text-white transition-all active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Perguntar à IA
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--muted)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  Limpar
                </button>
              </div>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-xl bg-white/5 p-4 border border-white/5 text-sm text-white/80"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                      <span className="font-medium">Sugerido para você</span>
                    </div>
                    <p className="leading-relaxed">{aiResponse}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão toggle fixo */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto absolute bottom-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 shadow-lg text-white ring-2 ring-white/10 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      </motion.button>
    </div>
  );
}
