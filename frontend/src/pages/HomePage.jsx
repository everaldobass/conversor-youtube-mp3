// ============================================================
// pages/HomePage.jsx — Dashboard Principal
// ============================================================
// Exibe:
//  - Saudação personalizada por hora do dia
//  - Grid de acesso rápido (últimas músicas)
//  - Carrossel horizontal de MusicCards
//  - Track List completa com busca
//  - Modal de conversão YouTube → MP3
// ============================================================

import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import TopBar     from '../components/TopBar';
import MusicCard  from '../components/MusicCard';
import QuickCard  from '../components/QuickCard';
import TrackItem  from '../components/TrackItem';
import { useAuth }    from '../hooks/useAuth';
import { usePlayer }  from '../hooks/usePlayer';
import { playlistService } from '../services/playlistService';
import { youtubeService  } from '../services/youtubeService';

// Dados de demonstração (usados quando não há backend)
const DEMO_TRACKS = [
  { id:1, emoji:'🎸', titulo:'Bohemian Rhapsody',      artista:'Queen',          album:'A Night at the Opera', duracao:'5:55', liked:true  },
  { id:2, emoji:'🎹', titulo:'Imagine',                 artista:'John Lennon',    album:'Imagine',              duracao:'3:07', liked:false },
  { id:3, emoji:'🎷', titulo:'So What',                 artista:'Miles Davis',    album:'Kind of Blue',         duracao:'9:22', liked:true  },
  { id:4, emoji:'🎺', titulo:'Enter Sandman',            artista:'Metallica',      album:'Metallica (Black)',    duracao:'5:32', liked:false },
  { id:5, emoji:'🥁', titulo:'Smells Like Teen Spirit', artista:'Nirvana',        album:'Nevermind',            duracao:'5:01', liked:true  },
  { id:6, emoji:'🎻', titulo:'November Rain',            artista:"Guns N' Roses",  album:'Use Your Illusion I', duracao:'8:57', liked:false },
  { id:7, emoji:'🎼', titulo:'Hotel California',         artista:'Eagles',         album:'Hotel California',    duracao:'6:30', liked:true  },
  { id:8, emoji:'🎤', titulo:'Purple Haze',              artista:'Jimi Hendrix',   album:'Are You Experienced', duracao:'2:50', liked:false },
];

// Saudação por hora do dia
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomePage() {
  const { showToast } = useOutletContext();
  const { usuario }   = useAuth();
  const {
    tracks, setTracks, currentIdx, isPlaying,
    playTrack, toggleLike,
  } = usePlayer();

  const [filtered,   setFiltered]   = useState([]);
  const [ytUrl,      setYtUrl]      = useState('');
  const [ytModal,    setYtModal]    = useState(false);
  const [converting, setConverting] = useState(false);

  // ── Carrega a playlist do backend (ou demo) ──────────────────
  useEffect(() => {
    async function loadPlaylist() {
      try {
        const { data } = await playlistService.listar();
        const loaded = data.musicas || [];
        if (loaded.length > 0) {
          setTracks(loaded);
          setFiltered(loaded);
        } else {
          // Sem músicas no backend: usa demo
          setTracks(DEMO_TRACKS);
          setFiltered(DEMO_TRACKS);
        }
      } catch {
        // Sem backend: usa demo
        setTracks(DEMO_TRACKS);
        setFiltered(DEMO_TRACKS);
      }
    }
    loadPlaylist();
  }, []);

  // Atualiza filtered quando tracks muda
  useEffect(() => {
    setFiltered(tracks);
  }, [tracks]);

  // ── Busca local ──────────────────────────────────────────────
  function handleSearch(val) {
    if (!val.trim()) { setFiltered(tracks); return; }
    const q = val.toLowerCase();
    setFiltered(tracks.filter((t) =>
      t.titulo?.toLowerCase().includes(q) ||
      t.artista?.toLowerCase().includes(q)
    ));
  }

  // ── Conversão YouTube → MP3 ──────────────────────────────────
  async function handleConvert() {
    if (!ytUrl.trim()) { showToast('⚠️ Cole uma URL do YouTube', 'warn'); return; }
    if (!ytUrl.includes('youtube.com') && !ytUrl.includes('youtu.be')) {
      showToast('⚠️ URL inválida. Use links do YouTube', 'warn'); return;
    }

    setConverting(true);
    setYtModal(false);
    showToast('⏳ Convertendo vídeo… isso pode levar um momento!');

    try {
      const { data } = await youtubeService.convert(ytUrl);
      const newTrack = { ...data.musica, emoji: '🎵' };
      setTracks([newTrack, ...tracks]);
      showToast('✅ Música adicionada com sucesso!', 'success');
    } catch {
      // Fallback demo quando não há backend
      const fakeTrack = {
        id: Date.now(), emoji: '🎵', liked: false,
        titulo: 'Novo do YouTube', artista: 'YouTube Artist',
        album: 'YouTube Import', duracao: '3:45',
      };
      setTracks([fakeTrack, ...tracks]);
      showToast('✅ Música adicionada! (modo demo)', 'success');
    } finally {
      setConverting(false);
      setYtUrl('');
    }
  }

  return (
    <>
      {/* ── TopBar ── */}
      <TopBar onSearch={handleSearch} />

      <div className="px-8 pb-10">

        {/* ── Saudação ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-[28px] font-extrabold text-gradient">
            {getGreeting()}, {usuario?.nome?.split(' ')[0] || 'Convidado'}! 👋
          </h1>
          <p className="text-[var(--text2)] text-[14px] font-medium mt-1">
            O que você quer ouvir hoje?
          </p>
        </motion.div>

        {/* ── Acesso Rápido ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-8">
          {tracks.slice(0, 6).map((t, i) => (
            <QuickCard
              key={t.id}
              track={t}
              index={i}
              onPlay={playTrack}
            />
          ))}
        </div>

        {/* ── Cards recentes ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-extrabold text-[var(--text)]">
              Adicionados Recentemente
            </h2>
            <button
              className="text-[12px] font-bold text-[var(--text3)] hover:text-accent uppercase tracking-widest transition-colors"
              onClick={() => showToast('📂 Biblioteca completa — em breve!')}
            >
              Ver tudo
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3">
            {tracks.map((t, i) => (
              <MusicCard
                key={t.id}
                track={t}
                index={i}
                onPlay={playTrack}
                onLike={toggleLike}
              />
            ))}
          </div>
        </section>

        {/* ── Track list ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-extrabold text-[var(--text)]">
              Sua Playlist
            </h2>
            <button
              onClick={() => setYtModal(true)}
              className="
                flex items-center gap-2
                text-[12px] font-bold text-accent
                hover:text-accent-hover uppercase tracking-widest
                transition-colors
              "
            >
              <Plus size={14} /> Adicionar do YouTube
            </button>
          </div>

          {/* Cabeçalho da lista */}
          <div
            className="
              grid gap-3 px-4 pb-2 mb-1
              text-[11px] font-bold tracking-[1px] uppercase text-[var(--text3)]
              border-b border-[var(--glass-border)]
            "
            style={{ gridTemplateColumns: '40px 1fr 1fr 80px 48px' }}
          >
            <span>#</span>
            <span>TÍTULO</span>
            <span className="hidden sm:block">ÁLBUM</span>
            <span className="text-right">DURAÇÃO</span>
            <span />
          </div>

          {/* Itens */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[var(--text3)] text-[14px]">
              Nenhuma música encontrada 🎵
            </div>
          ) : (
            filtered.map((t, i) => (
              <TrackItem
                key={t.id}
                track={t}
                index={i}
                isPlaying={i === currentIdx && isPlaying}
                onPlay={playTrack}
                onLike={toggleLike}
              />
            ))
          )}
        </section>
      </div>

      {/* ══════════════════════════════════════
          MODAL: YouTube → MP3
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {ytModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setYtModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="
                w-full max-w-[460px] mx-4
                bg-[var(--card)] border border-[var(--glass-border)]
                rounded-[20px] p-8
                shadow-[0_40px_80px_rgba(0,0,0,0.6)]
              "
            >
              {/* Cabeçalho do modal */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[18px] font-extrabold text-[var(--text)]">
                  🎥 YouTube → MP3
                </h3>
                <button
                  onClick={() => setYtModal(false)}
                  className="text-[var(--text3)] hover:text-[var(--text)] transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-[var(--text2)] text-[13px] mb-5">
                Cole a URL do vídeo para converter e adicionar à sua playlist.
              </p>

              {/* Input da URL */}
              <input
                type="url"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                placeholder="https://youtube.com/watch?v=..."
                autoFocus
                className="
                  w-full bg-[var(--bg3)] border-[1.5px] border-[var(--glass-border)]
                  rounded-lg px-4 py-3 text-[var(--text)] text-[14px] font-medium
                  placeholder:text-[var(--text3)] mb-4
                  focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-dim)]
                  transition-all duration-200
                "
              />

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={() => setYtModal(false)}
                  className="
                    flex-1 py-3 rounded-full
                    bg-[var(--bg3)] border border-[var(--glass-border)]
                    text-[var(--text2)] text-[13px] font-semibold
                    hover:text-[var(--text)] hover:border-[var(--text3)]
                    transition-all duration-200
                  "
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConvert}
                  disabled={converting}
                  className="
                    flex-[2] py-3 rounded-full
                    bg-accent hover:bg-accent-hover text-black
                    text-[13px] font-extrabold
                    transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-glow-accent
                  "
                >
                  {converting ? '⏳ Convertendo…' : 'Converter 🚀'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
