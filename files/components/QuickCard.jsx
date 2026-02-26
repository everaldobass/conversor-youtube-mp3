// ============================================================
// components/QuickCard.jsx — Card de Acesso Rápido (Hero)
// ============================================================
// Card horizontal menor usado na grade de acesso rápido do
// dashboard. Mostra arte + título + botão de play no hover.
// ============================================================

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg,#1a3a2a,#0d2011)',
  'linear-gradient(135deg,#1a1a3a,#0d0d20)',
  'linear-gradient(135deg,#3a1a1a,#201010)',
  'linear-gradient(135deg,#3a2a1a,#201508)',
  'linear-gradient(135deg,#1a3a3a,#0d2020)',
  'linear-gradient(135deg,#2a1a3a,#180d20)',
];

export default function QuickCard({ track, index = 0, onPlay }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 32px var(--shadow)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPlay?.(index)}
      className="
        group flex items-center gap-3.5 overflow-hidden
        bg-[var(--bg3)] rounded-lg cursor-pointer
        border border-[var(--glass-border)]
        relative
      "
      style={{ transition: 'all var(--transition)' }}
    >
      {/* Brilho ao hover */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-r from-[var(--accent-dim)] to-transparent
        transition-opacity duration-300 pointer-events-none
      " />

      {/* Arte */}
      <div
        className="w-14 h-14 min-w-[56px] flex items-center justify-center text-2xl"
        style={{ background: gradient }}
      >
        {track?.emoji || '🎵'}
      </div>

      {/* Título */}
      <span className="
        flex-1 text-[var(--text)] text-[13px] font-bold
        truncate-1 pr-2
      ">
        {track?.titulo || track?.title || 'Sem título'}
      </span>

      {/* Botão play (aparece no hover) */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="
          w-9 h-9 rounded-full bg-accent mr-3
          flex items-center justify-center
          shadow-glow-accent
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-300
          flex-shrink-0
        "
      >
        <Play size={14} fill="black" className="text-black ml-0.5" />
      </motion.div>
    </motion.div>
  );
}
