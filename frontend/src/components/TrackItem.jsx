// ============================================================
// components/TrackItem.jsx — Linha da Track List
// ============================================================
// Componente que representa uma faixa na lista de músicas.
// Exibe:
//  - Número da faixa (ou equalizador animado se tocando)
//  - Arte miniatura + título + artista
//  - Álbum
//  - Duração
//  - Botão de curtir
//
// Usa CSS classes do animations.css para o equalizador.
// ============================================================

import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg,#1a3a2a,#0d2011)',
  'linear-gradient(135deg,#1a1a3a,#0d0d20)',
  'linear-gradient(135deg,#3a1a1a,#201010)',
  'linear-gradient(135deg,#3a2a1a,#201508)',
  'linear-gradient(135deg,#1a3a3a,#0d2020)',
  'linear-gradient(135deg,#2a1a3a,#180d20)',
];

// Equalizador animado (3 barrinhas pulsando)
function Equalizer() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      <div className="eq-bar" />
      <div className="eq-bar" />
      <div className="eq-bar" />
    </div>
  );
}

export default function TrackItem({
  track,
  index,
  isPlaying,  // esta faixa está tocando agora?
  onPlay,
  onLike,
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={() => onPlay?.(index)}
      className={`
        group
        grid items-center gap-3
        px-4 py-2 rounded-lg cursor-pointer
        border transition-all duration-200
        ${isPlaying
          ? 'bg-[var(--accent-dim)] border-[var(--accent-dim)]'
          : 'border-transparent hover:bg-[var(--glass)] hover:border-[var(--glass-border)]'
        }
      `}
      style={{ gridTemplateColumns: '40px 1fr 1fr 80px 48px' }}
    >
      {/* ── Número / Equalizador / Play ── */}
      <div className="flex items-center justify-center w-8">
        {isPlaying ? (
          // Equalizador animado quando tocando
          <Equalizer />
        ) : (
          <>
            {/* Número normal */}
            <span className="text-[var(--text2)] text-[13px] font-semibold group-hover:hidden">
              {index + 1}
            </span>
            {/* Ícone de play ao hover */}
            <span className="hidden group-hover:flex text-accent">
              <Play size={14} fill="currentColor" />
            </span>
          </>
        )}
      </div>

      {/* ── Info da faixa ── */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Arte miniatura */}
        <div
          className="w-10 h-10 min-w-[40px] rounded flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: gradient }}
        >
          {track?.emoji || '🎵'}
        </div>

        {/* Título + artista */}
        <div className="overflow-hidden">
          <p className={`
            text-[13.5px] font-semibold truncate-1
            ${isPlaying ? 'text-accent' : 'text-[var(--text)]'}
          `}>
            {track?.titulo || track?.title || 'Sem título'}
          </p>
          <p className="text-[12px] text-[var(--text2)] font-medium truncate-1">
            {track?.artista || track?.artist || '—'}
          </p>
        </div>
      </div>

      {/* ── Álbum ── */}
      <p className="text-[12.5px] text-[var(--text2)] truncate-1 hidden sm:block">
        {track?.album || '—'}
      </p>

      {/* ── Duração ── */}
      <p className="text-[13px] text-[var(--text2)] font-medium text-right">
        {track?.duracao || track?.duration || '—'}
      </p>

      {/* ── Ações ── */}
      <div className="flex items-center justify-end">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); onLike?.(index); }}
          className={`
            p-1.5 rounded transition-all duration-200
            ${track?.liked
              ? 'text-accent'
              : 'text-[var(--text3)] opacity-0 group-hover:opacity-100 hover:text-accent'
            }
          `}
          title="Curtir"
        >
          <Heart
            size={15}
            fill={track?.liked ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
