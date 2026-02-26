// ============================================================
// services/youtubeService.js — Conversão YouTube → MP3
// ============================================================
import api from './api';

export const youtubeService = {
  // POST /api/youtube/convert → { mensagem, musica }
  // Timeout maior pois o processo de conversão pode demorar
  convert: (url) =>
    api.post('/youtube/convert', { url }, { timeout: 120000 }), // 2 min
};
