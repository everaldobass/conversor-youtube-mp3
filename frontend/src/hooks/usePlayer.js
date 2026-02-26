// ============================================================
// hooks/usePlayer.js — Estado Global do Player (Zustand)
// ============================================================
// Zustand é uma biblioteca de gerenciamento de estado simples.
// É como um useState() que pode ser acessado de qualquer
// componente sem precisar de Context/Provider.
//
// O player precisa ser global porque:
//  - O componente Player fica no rodapé (AppLayout)
//  - As TrackItems ficam na HomePage/PlaylistPage
//  - Ambos precisam saber qual música está tocando
//
// Uso nos componentes:
//   const { tracks, currentIdx, isPlaying, playTrack } = usePlayer();
// ============================================================

import { create } from 'zustand';

// Função auxiliar: converte "3:45" → 225 (segundos)
function parseDuration(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  return parts[0] * 60 + (parts[1] || 0);
}

// Função auxiliar: converte 225 → "3:45"
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const usePlayer = create((set, get) => ({
  // ── Estado ──────────────────────────────────────────────────
  tracks:       [],       // Lista completa de músicas
  currentIdx:   0,        // Índice da música atual
  isPlaying:    false,    // Está tocando?
  progress:     0,        // Progresso em segundos
  volume:       80,       // Volume de 0 a 100
  muted:        false,    // Mudo?
  shuffle:      false,    // Aleatório?
  repeat:       false,    // Repetir?
  progressTimer: null,    // Referência do setInterval

  // ── Getters calculados ───────────────────────────────────────
  get currentTrack() {
    const { tracks, currentIdx } = get();
    return tracks[currentIdx] || null;
  },

  get currentTimeFormatted() {
    return formatTime(get().progress);
  },

  get totalTimeFormatted() {
    const t = get().tracks[get().currentIdx];
    return t ? t.duracao || '0:00' : '0:00';
  },

  get progressPercent() {
    const { tracks, currentIdx, progress } = get();
    const t = tracks[currentIdx];
    if (!t) return 0;
    const total = parseDuration(t.duracao);
    return total > 0 ? (progress / total) * 100 : 0;
  },

  // ── Actions ─────────────────────────────────────────────────

  // Define a lista completa de músicas (chamado ao carregar a playlist)
  setTracks: (tracks) => set({ tracks }),

  // Toca uma música pelo índice
  playTrack: (idx) => {
    const { tracks, _startProgressTimer } = get();
    if (idx < 0 || idx >= tracks.length) return;

    // Para o timer anterior
    get()._stopProgressTimer();

    set({ currentIdx: idx, isPlaying: true, progress: 0 });

    // Inicia o timer de progresso simulado
    _startProgressTimer(parseDuration(tracks[idx]?.duracao));
  },

  // Play / Pause
  togglePlay: () => {
    const { isPlaying, tracks, currentIdx, progress, _startProgressTimer, _stopProgressTimer } = get();
    if (tracks.length === 0) return;

    if (isPlaying) {
      _stopProgressTimer();
      set({ isPlaying: false });
    } else {
      set({ isPlaying: true });
      _startProgressTimer(parseDuration(tracks[currentIdx]?.duracao));
    }
  },

  // Próxima música
  nextTrack: () => {
    const { tracks, currentIdx, shuffle, repeat, playTrack } = get();
    if (tracks.length === 0) return;

    let next;
    if (shuffle) {
      next = Math.floor(Math.random() * tracks.length);
    } else {
      next = (currentIdx + 1) % tracks.length;
    }
    playTrack(next);
  },

  // Música anterior
  prevTrack: () => {
    const { tracks, currentIdx, progress, playTrack } = get();
    if (tracks.length === 0) return;

    // Se mais de 3 segundos passaram, reinicia a música atual
    if (progress > 3) {
      playTrack(currentIdx);
      return;
    }
    const prev = currentIdx === 0 ? tracks.length - 1 : currentIdx - 1;
    playTrack(prev);
  },

  // Busca (seek) para uma posição específica na barra de progresso
  seekTo: (percent) => {
    const { tracks, currentIdx, isPlaying, _startProgressTimer, _stopProgressTimer } = get();
    const t = tracks[currentIdx];
    if (!t) return;
    const total   = parseDuration(t.duracao);
    const newProg = (percent / 100) * total;
    _stopProgressTimer();
    set({ progress: newProg });
    if (isPlaying) _startProgressTimer(total);
  },

  // Volume
  setVolume: (v) => set({ volume: v, muted: v === 0 }),
  toggleMute: () => {
    const { muted, volume } = get();
    set({ muted: !muted, volume: muted ? (volume || 50) : volume });
  },

  // Toggle shuffle e repeat
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  toggleRepeat:  () => set((s) => ({ repeat:  !s.repeat  })),

  // Curtir / descurtir música
  toggleLike: (idx) => {
    const tracks = [...get().tracks];
    if (tracks[idx]) {
      tracks[idx] = { ...tracks[idx], liked: !tracks[idx].liked };
      set({ tracks });
    }
  },

  // ── Internos (timer de progresso simulado) ───────────────────
  // Em produção com áudio real, o progresso viria do evento
  // 'timeupdate' do elemento <audio>. Aqui simulamos.
  _startProgressTimer: (totalSeconds) => {
    if (!totalSeconds) return;
    const startTime = Date.now() - get().progress * 1000;

    const timer = setInterval(() => {
      if (!get().isPlaying) return;

      const elapsed = (Date.now() - startTime) / 1000;
      const newProg = Math.min(elapsed, totalSeconds);
      set({ progress: newProg });

      // Chegou ao fim
      if (newProg >= totalSeconds) {
        clearInterval(timer);
        set({ progressTimer: null });
        const { repeat, nextTrack, playTrack, currentIdx } = get();
        repeat ? playTrack(currentIdx) : nextTrack();
      }
    }, 250);

    set({ progressTimer: timer });
  },

  _stopProgressTimer: () => {
    const { progressTimer } = get();
    if (progressTimer) {
      clearInterval(progressTimer);
      set({ progressTimer: null });
    }
  },
}));
