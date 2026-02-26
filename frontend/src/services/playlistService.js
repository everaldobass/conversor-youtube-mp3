// ============================================================
// services/playlistService.js — CRUD da Playlist
// ============================================================
import api from './api';

export const playlistService = {
  // GET /api/playlist → { total, musicas: [...] }
  listar: () =>
    api.get('/playlist'),

  // GET /api/playlist/:id → { musica }
  buscar: (id) =>
    api.get(`/playlist/${id}`),

  // DELETE /api/playlist/:id → { mensagem }
  deletar: (id) =>
    api.delete(`/playlist/${id}`),
};
