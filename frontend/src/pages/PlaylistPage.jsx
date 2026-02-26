// ============================================================
// pages/PlaylistPage.jsx — Gerenciamento de Playlist
// ============================================================
// Lista todas as músicas com opções de:
//  - Reproduzir
//  - Curtir/Descurtir
//  - Deletar (com confirmação)
//  - Busca local
//  - Ordenação
// ============================================================

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, SortAsc, Music } from 'lucide-react';
import TopBar    from '../components/TopBar';
import TrackItem from '../components/TrackItem';
import { usePlayer } from '../hooks/usePlayer';
import { playlistService } from '../services/playlistService';

export default function PlaylistPage() {
  const { showToast } = useOutletContext();
  const { tracks, setTracks, currentIdx, isPlaying, playTrack, toggleLike } = usePlayer();

  const [filtered,     setFiltered]     = useState(null);   // null = mostra tudo
  const [deleteId,     setDeleteId]     = useState(null);   // ID aguardando confirmação
  const [sortBy,       setSortBy]       = useState('date'); // 'date' | 'title' | 'artist'

  const displayTracks = filtered ?? tracks;

  // ── Busca ────────────────────────────────────────────────────
  function handleSearch(val) {
    if (!val.trim()) { setFiltered(null); return; }
    const q = val.toLowerCase();
    setFiltered(tracks.filter((t) =>
      t.titulo?.toLowerCase().includes(q) ||
      t.artista?.toLowerCase().includes(q)
    ));
  }

  // ── Ordenação ────────────────────────────────────────────────
  function sortedTracks(list) {
    return [...list].sort((a, b) => {
      if (sortBy === 'title')  return (a.titulo  || '').localeCompare(b.titulo  || '');
      if (sortBy === 'artist') return (a.artista || '').localeCompare(b.artista || '');
      return 0; // 'date' mantém a ordem original
    });
  }

  // ── Deletar ──────────────────────────────────────────────────
  async function handleDelete(trackId) {
    try {
      await playlistService.deletar(trackId);
      setTracks(tracks.filter((t) => t.id !== trackId));
      showToast('🗑️ Música removida', 'success');
    } catch {
      // Demo mode: remove localmente
      setTracks(tracks.filter((t) => t.id !== trackId));
      showToast('🗑️ Música removida (demo)', 'success');
    }
    setDeleteId(null);
  }

  const total    = tracks.length;
  const curtidas = tracks.filter((t) => t.liked).length;

  return (
    <>
      <TopBar onSearch={handleSearch} />

      <div className="px-8 pb-10">

        {/* ── Cabeçalho ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-emerald-700 flex items-center justify-center shadow-glow-accent">
                <Music size={28} className="text-black" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text3)]">Playlist</p>
                <h1 className="text-[28px] font-extrabold text-gradient">Minhas Músicas</h1>
              </div>
            </div>
            <p className="text-[var(--text2)] text-[13px] font-medium">
              {total} músicas • {curtidas} curtidas
            </p>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <SortAsc size={16} className="text-[var(--text3)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                bg-[var(--bg3)] border border-[var(--glass-border)]
                text-[var(--text2)] text-[13px] font-semibold
                rounded-lg px-3 py-2 cursor-pointer
                focus:border-accent outline-none
                transition-colors
              "
            >
              <option value="date">Data</option>
              <option value="title">Título</option>
              <option value="artist">Artista</option>
            </select>
          </div>
        </motion.div>

        {/* ── Lista ── */}
        {displayTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--text3)]">
            <Music size={48} strokeWidth={1} className="mb-4 opacity-30" />
            <p className="text-[16px] font-semibold">Nenhuma música encontrada</p>
            <p className="text-[13px] mt-1">Adicione músicas pelo YouTube na tela inicial</p>
          </div>
        ) : (
          <>
            {/* Cabeçalho da tabela */}
            <div
              className="grid gap-3 px-4 pb-2 mb-1 text-[11px] font-bold tracking-[1px] uppercase text-[var(--text3)] border-b border-[var(--glass-border)]"
              style={{ gridTemplateColumns: '40px 1fr 1fr 80px 48px' }}
            >
              <span>#</span><span>TÍTULO</span>
              <span className="hidden sm:block">ÁLBUM</span>
              <span className="text-right">DURAÇÃO</span>
              <span />
            </div>

            {sortedTracks(displayTracks).map((t, i) => (
              <div key={t.id} className="group/row relative">
                <TrackItem
                  track={t}
                  index={i}
                  isPlaying={i === currentIdx && isPlaying}
                  onPlay={playTrack}
                  onLike={toggleLike}
                />
                {/* Botão deletar (aparece no hover) */}
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="
                    absolute right-14 top-1/2 -translate-y-1/2
                    opacity-0 group-hover/row:opacity-100
                    text-[var(--text3)] hover:text-red-400
                    transition-all duration-200 p-1.5 rounded
                  "
                  title="Remover música"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Modal de confirmação de delete ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.9, opacity: 0 }}
              className="bg-[var(--card)] border border-[var(--glass-border)] rounded-2xl p-8 w-full max-w-[360px] mx-4 shadow-card-hover text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[var(--text)] mb-2">Remover música?</h3>
              <p className="text-[var(--text2)] text-[13px] mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-full bg-[var(--bg3)] border border-[var(--glass-border)] text-[var(--text2)] text-[13px] font-semibold hover:text-[var(--text)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-colors"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
