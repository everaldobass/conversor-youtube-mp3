// ============================================================
// components/MusicCard.jsx — Card de Música (grade)
// ============================================================
// Card com:
//  - Arte do álbum com gradiente personalizado
//  - Overlay de play ao hover
//  - Efeito 3D sutil de perspectiva no hover
//  - Glassmorphism
//  - Botão de curtir
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';

// Array de gradientes para as artes (roda pelo índice)
const GRADIENTS = [
  'linear-gradient(135deg,#1a3a2a,#0d2011)',
  'linear-gradient(135deg,#1a1a3a,#0d0d20)',
  'linear-gradient(135deg,#3a1a1a,#201010)',
  'linear-gradient(135deg,#3a2a1a,#201508)',
  'linear-gradient(135deg,#1a3a3a,#0d2020)',
  'linear-gradient(135deg,#2a1a3a,#180d20)',
];

export default function MusicCard({ track, index = 0, onPlay, onLike }) {
  const [hovered, setHovered] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => onPlay?.(index)}
      className="
        relative min-w-[168px] w-[168px]
        bg-[var(--card)] rounded-[var(--radius)]
        p-3.5 cursor-pointer flex-shrink-0
        border border-[var(--glass-border)]
        overflow-hidden
      "
      style={{
        boxShadow: hovered
          ? '0 20px 40px var(--shadow), 0 0 0 1px var(--accent-dim)'
          : '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Brilho de fundo ao hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,var(--accent-dim),transparent)' }}
      />

      {/* ── Arte do álbum ── */}
      <div
        className="relative w-full aspect-square rounded-lg mb-3.5 overflow-hidden"
        style={{ background: gradient, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
      >
        {/* Emoji da música */}
        <div className="w-full h-full flex items-center justify-center text-5xl select-none">
          {track?.emoji || '🎵'}
        </div>

        {/* Gradiente escuro na base */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        {/* Overlay de play */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg"
        >
          <motion.div
            animate={{ scale: hovered ? 1 : 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="
              w-12 h-12 rounded-full bg-accent
              flex items-center justify-center
              shadow-glow-accent
            "
          >
            <Play size={20} fill="black" className="text-black ml-0.5" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Título e artista ── */}
      <div className="relative z-10">
        <p className="text-[var(--text)] text-[13px] font-bold truncate-1 mb-1">
          {track?.titulo || track?.title || 'Sem título'}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[var(--text2)] text-[11.5px] font-medium truncate-1 flex-1">
            {track?.artista || track?.artist || 'Artista desconhecido'}
          </p>
          {/* Botão curtir */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onLike?.(index); }}
            className={`
              text-sm transition-all duration-200 flex-shrink-0
              ${track?.liked ? 'text-accent' : 'text-[var(--text3)] hover:text-accent'}
            `}
          >
            <Heart
              size={14}
              fill={track?.liked ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
