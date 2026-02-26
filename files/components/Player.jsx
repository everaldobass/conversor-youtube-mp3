// ============================================================
// components/Player.jsx — Player de Música (rodapé fixo)
// ============================================================
// Player completo estilo Spotify, sempre visível na parte
// inferior da tela. Contém:
//  - Info da música atual (arte + título + artista + like)
//  - Controles: shuffle, prev, play/pause, next, repeat
//  - Barra de progresso clicável com tempo atual/total
//  - Volume com mute e slider
//  - Botões extras (stems, fila)
// ============================================================

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle, SkipBack, Play, Pause, SkipForward, Repeat,
  Heart, Volume2, VolumeX, Volume1, ListMusic, SplitSquareHorizontal
} from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';

const GRADIENTS = [
  'linear-gradient(135deg,#1a3a2a,#0d2011)',
  'linear-gradient(135deg,#1a1a3a,#0d0d20)',
  'linear-gradient(135deg,#3a1a1a,#201010)',
  'linear-gradient(135deg,#3a2a1a,#201508)',
  'linear-gradient(135deg,#1a3a3a,#0d2020)',
  'linear-gradient(135deg,#2a1a3a,#180d20)',
];

// Componente de botão de controle reutilizável
function CtrlBtn({ onClick, active, large, title, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center rounded-full
        transition-all duration-200
        ${large
          ? 'w-10 h-10 bg-[var(--text)] text-[var(--bg)] hover:scale-105'
          : `w-8 h-8 ${active ? 'text-accent' : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--glass)]'}`
        }
      `}
      style={large ? { boxShadow: '0 4px 16px rgba(0,0,0,0.4)' } : {}}
    >
      {children}
    </motion.button>
  );
}

export default function Player({ onShowToast }) {
  const progressRef = useRef(null);
  const {
    tracks, currentIdx,
    isPlaying, progress, volume, muted, shuffle, repeat,
    togglePlay, nextTrack, prevTrack,
    seekTo, setVolume, toggleMute,
    toggleShuffle, toggleRepeat, toggleLike,
    progressPercent, currentTimeFormatted, totalTimeFormatted,
  } = usePlayer();

  const track = tracks[currentIdx];
  const gradient = GRADIENTS[currentIdx % GRADIENTS.length];

  // Calcula o ícone de volume
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // Clique na barra de progresso → converte posição do mouse para %
  function handleProgressClick(e) {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    seekTo(pct);
  }

  return (
    <footer className="
      col-span-full
      grid items-center
      px-6
      bg-[var(--player-bg)] border-t border-[var(--glass-border)]
      backdrop-blur-[30px]
      relative z-[200]
    "
    style={{
      gridTemplateColumns: '1fr 2fr 1fr',
      height: 'var(--player-h)',
    }}>

      {/* Linha de destaque no topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* ══════════════════════════════════════
          COLUNA 1: Info da música
      ══════════════════════════════════════ */}
      <div className="flex items-center gap-3.5 overflow-hidden">

        {/* Arte do álbum (gira quando tocando) */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 min-w-[56px] rounded-lg flex items-center justify-center text-2xl overflow-hidden flex-shrink-0"
          style={{
            background: gradient,
            boxShadow: isPlaying ? '0 4px 16px var(--accent-glow)' : '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {track?.emoji || '🎵'}
        </motion.div>

        {/* Título e artista */}
        <div className="overflow-hidden">
          <p className="text-[var(--text)] text-[13px] font-bold truncate-1">
            {track?.titulo || 'Nenhuma música'}
          </p>
          <p className="text-[var(--text2)] text-[11.5px] font-medium mt-0.5 truncate-1">
            {track?.artista || 'Selecione uma faixa'}
          </p>
        </div>

        {/* Curtir */}
        <AnimatePresence>
          {track && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => toggleLike(currentIdx)}
              className={`
                ml-2 transition-all duration-200 flex-shrink-0
                ${track?.liked ? 'text-accent' : 'text-[var(--text3)] hover:text-accent'}
              `}
            >
              <Heart
                size={17}
                fill={track?.liked ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════
          COLUNA 2: Controles + Progresso
      ══════════════════════════════════════ */}
      <div className="flex flex-col items-center gap-2 py-3">

        {/* Botões de controle */}
        <div className="flex items-center gap-2">
          <CtrlBtn onClick={toggleShuffle} active={shuffle} title="Aleatório">
            <Shuffle size={14} />
          </CtrlBtn>

          <CtrlBtn onClick={prevTrack} title="Anterior">
            <SkipBack size={16} fill="currentColor" />
          </CtrlBtn>

          <CtrlBtn onClick={togglePlay} large title={isPlaying ? 'Pausar' : 'Reproduzir'}>
            {isPlaying
              ? <Pause  size={18} fill="currentColor" />
              : <Play   size={18} fill="currentColor" className="ml-0.5" />
            }
          </CtrlBtn>

          <CtrlBtn onClick={nextTrack} title="Próxima">
            <SkipForward size={16} fill="currentColor" />
          </CtrlBtn>

          <CtrlBtn onClick={toggleRepeat} active={repeat} title="Repetir">
            <Repeat size={14} />
          </CtrlBtn>
        </div>

        {/* Barra de progresso */}
        <div className="flex items-center gap-2.5 w-full">
          {/* Tempo atual */}
          <span className="text-[11px] text-[var(--text3)] font-medium min-w-[32px] text-right">
            {currentTimeFormatted}
          </span>

          {/* Barra clicável */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="
              flex-1 h-1 bg-[var(--bg3)] rounded-full
              relative cursor-pointer group
              hover:h-1.5 transition-all duration-150
            "
          >
            {/* Preenchimento */}
            <div
              className="h-full bg-gradient-to-r from-accent to-green-700 rounded-full relative"
              style={{ width: `${progressPercent}%`, transition: 'width 0.25s linear' }}
            >
              {/* Bolinha de progresso (aparece no hover) */}
              <div className="
                absolute -right-1.5 top-1/2 -translate-y-1/2
                w-3 h-3 rounded-full bg-white
                shadow-[0_0_8px_var(--accent-glow)]
                opacity-0 group-hover:opacity-100
                transition-opacity duration-150
              " />
            </div>
          </div>

          {/* Duração total */}
          <span className="text-[11px] text-[var(--text3)] font-medium min-w-[32px]">
            {totalTimeFormatted}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          COLUNA 3: Volume + Extras
      ══════════════════════════════════════ */}
      <div className="flex items-center justify-end gap-2">

        {/* Botão stems */}
        <CtrlBtn onClick={() => onShowToast?.('🎛️ Stems — em breve!')} title="Stems">
          <SplitSquareHorizontal size={15} />
        </CtrlBtn>

        {/* Fila */}
        <CtrlBtn onClick={() => onShowToast?.('📋 Fila — em breve!')} title="Fila de reprodução">
          <ListMusic size={15} />
        </CtrlBtn>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          >
            <VolumeIcon size={17} />
          </button>

          <input
            type="range"
            min="0" max="100"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="
              w-[90px] h-1 rounded-full cursor-pointer
              accent-accent
              hover:h-1.5 transition-all duration-150
            "
            style={{
              background: `linear-gradient(to right, var(--accent) ${muted ? 0 : volume}%, var(--bg3) ${muted ? 0 : volume}%)`,
            }}
          />
        </div>
      </div>
    </footer>
  );
}
