// ============================================================
// pages/StemsPage.jsx — Separação de Stems com IA
// ============================================================
// Permite ao usuário selecionar uma música da playlist e
// iniciar a separação de stems (Demucs AI).
// Exibe os stems gerados com player individual para cada um.
// ============================================================

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitSquareHorizontal, Play, Pause, Loader2, Mic, Drum, Music, Guitar } from 'lucide-react';
import TopBar from '../components/TopBar';
import { usePlayer } from '../hooks/usePlayer';
import { stemService } from '../services/stemService';

// Configuração visual de cada tipo de stem
const STEM_CONFIG = {
  Vocais:              { icon: Mic,    color: '#1DB954', bg: 'rgba(29,185,84,0.1)'   },
  Bateria:             { icon: Drum,   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  Baixo:               { icon: Music,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  'Outros Instrumentos':{ icon: Guitar, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

// Card de um stem individual
function StemCard({ stem, isPlaying, onToggle }) {
  const config = STEM_CONFIG[stem.tipo] || STEM_CONFIG['Outros Instrumentos'];
  const Icon   = config.icon;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="
        flex items-center gap-4
        bg-[var(--card)] border border-[var(--glass-border)]
        rounded-xl p-4 cursor-pointer
        transition-all duration-200
      "
      style={{ boxShadow: isPlaying ? `0 0 0 1px ${config.color}40, 0 8px 24px rgba(0,0,0,0.3)` : '' }}
    >
      {/* Ícone colorido */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: config.bg, border: `1px solid ${config.color}30` }}
      >
        <Icon size={22} style={{ color: config.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <p className="text-[var(--text)] text-[14px] font-bold">{stem.tipo}</p>
        <p className="text-[var(--text3)] text-[11.5px] font-medium mt-0.5">
          {stem.caminhoArquivo?.split('/').pop() || 'stem.wav'}
        </p>
      </div>

      {/* Botão play */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          background: isPlaying ? config.color : 'var(--bg3)',
          color: isPlaying ? '#000' : 'var(--text2)',
          boxShadow: isPlaying ? `0 4px 16px ${config.color}60` : 'none',
        }}
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </motion.button>
    </motion.div>
  );
}

export default function StemsPage() {
  const { showToast }      = useOutletContext();
  const { tracks }         = usePlayer();

  const [selectedId,    setSelectedId]    = useState(null);
  const [stems,         setStems]         = useState({});     // { [musicaId]: [...] }
  const [processing,    setProcessing]    = useState(null);   // ID em processamento
  const [playingStem,   setPlayingStem]   = useState(null);   // tipo do stem tocando

  const selectedTrack = tracks.find((t) => t.id === selectedId);

  // ── Iniciar separação ────────────────────────────────────────
  async function handleSeparate(musicaId) {
    setProcessing(musicaId);
    showToast('🎛️ Separação iniciada! Isso pode levar minutos…');

    try {
      await stemService.separate(musicaId);
      showToast('⏳ Processando em background… atualize em alguns minutos.', 'info');
    } catch (err) {
      // Demo: simula stems depois de 3s
      showToast('⏳ Simulando stems (modo demo)…');
      setTimeout(() => {
        const demoStems = [
          { id:1, tipo:'Vocais',               caminhoArquivo:'./storage/stems/vocals.mp3' },
          { id:2, tipo:'Bateria',              caminhoArquivo:'./storage/stems/drums.mp3'  },
          { id:3, tipo:'Baixo',                caminhoArquivo:'./storage/stems/bass.mp3'   },
          { id:4, tipo:'Outros Instrumentos',  caminhoArquivo:'./storage/stems/other.mp3'  },
        ];
        setStems((prev) => ({ ...prev, [musicaId]: demoStems }));
        setProcessing(null);
        showToast('✅ Stems gerados com sucesso! (demo)', 'success');
      }, 3000);
      return;
    }

    setProcessing(null);
  }

  // ── Buscar stems existentes ──────────────────────────────────
  async function handleLoadStems(musicaId) {
    try {
      const { data } = await stemService.getStems(musicaId);
      setStems((prev) => ({ ...prev, [musicaId]: data.stems }));
    } catch {
      showToast('Nenhum stem encontrado. Inicie a separação primeiro.', 'warn');
    }
  }

  return (
    <>
      <TopBar />

      <div className="px-8 pb-10">

        {/* ── Cabeçalho ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)] border border-accent/20 flex items-center justify-center">
              <SplitSquareHorizontal size={24} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[24px] font-extrabold text-[var(--text)]">Separação de Stems</h1>
              <p className="text-[var(--text2)] text-[13px]">Separe vocais, bateria, baixo e instrumentos com IA</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Coluna 1: Selecionar música ── */}
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text2)] uppercase tracking-widest mb-3">
              1. Selecione a Música
            </h2>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {tracks.length === 0 ? (
                <p className="text-[var(--text3)] text-[13px] py-8 text-center">
                  Adicione músicas na tela inicial primeiro.
                </p>
              ) : (
                tracks.map((t, i) => (
                  <motion.div
                    key={t.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedId(t.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer
                      border transition-all duration-200
                      ${selectedId === t.id
                        ? 'bg-[var(--accent-dim)] border-accent/30'
                        : 'bg-[var(--card)] border-[var(--glass-border)] hover:bg-[var(--glass)]'
                      }
                    `}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg3)] flex items-center justify-center text-xl flex-shrink-0">
                      {t.emoji || '🎵'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-[13.5px] font-bold truncate-1 ${selectedId === t.id ? 'text-accent' : 'text-[var(--text)]'}`}>
                        {t.titulo}
                      </p>
                      <p className="text-[var(--text3)] text-[11.5px]">{t.artista}</p>
                    </div>
                    {selectedId === t.id && (
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ── Coluna 2: Processar e ver stems ── */}
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text2)] uppercase tracking-widest mb-3">
              2. Processar e Reproduzir
            </h2>

            <AnimatePresence mode="wait">
              {!selectedId ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    flex flex-col items-center justify-center
                    h-64 rounded-xl
                    bg-[var(--card)] border border-[var(--glass-border)]
                    text-[var(--text3)] text-[14px]
                  "
                >
                  <SplitSquareHorizontal size={40} strokeWidth={1} className="mb-3 opacity-30" />
                  <p>Selecione uma música ao lado</p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Info da música selecionada */}
                  <div className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--glass-border)] rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg3)] flex items-center justify-center text-2xl">
                      {selectedTrack?.emoji}
                    </div>
                    <div>
                      <p className="text-[var(--text)] font-bold">{selectedTrack?.titulo}</p>
                      <p className="text-[var(--text2)] text-[12px]">{selectedTrack?.artista}</p>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSeparate(selectedId)}
                      disabled={!!processing}
                      className="
                        flex-1 py-3 rounded-full bg-accent text-black
                        font-bold text-[13px] transition-all duration-200
                        disabled:opacity-60 disabled:cursor-not-allowed
                        shadow-glow-accent hover:bg-accent-hover
                        flex items-center justify-center gap-2
                      "
                    >
                      {processing === selectedId ? (
                        <><Loader2 size={15} className="animate-spin" /> Processando…</>
                      ) : (
                        <><SplitSquareHorizontal size={15} /> Separar Stems</>
                      )}
                    </motion.button>

                    <button
                      onClick={() => handleLoadStems(selectedId)}
                      className="
                        px-4 py-3 rounded-full
                        bg-[var(--bg3)] border border-[var(--glass-border)]
                        text-[var(--text2)] text-[13px] font-semibold
                        hover:text-[var(--text)] transition-colors
                      "
                      title="Carregar stems já processados"
                    >
                      Carregar
                    </button>
                  </div>

                  {/* Lista de stems */}
                  {stems[selectedId] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text3)] mb-2">
                        Stems Gerados
                      </p>
                      {stems[selectedId].map((stem) => (
                        <StemCard
                          key={stem.id}
                          stem={stem}
                          isPlaying={playingStem === stem.tipo}
                          onToggle={() => setPlayingStem(
                            playingStem === stem.tipo ? null : stem.tipo
                          )}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
