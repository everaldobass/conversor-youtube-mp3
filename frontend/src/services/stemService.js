// ============================================================
// services/stemService.js — Separação de Stems
// ============================================================
import api from './api';

export const stemService = {
  // POST /api/stems/separate/:id → { mensagem } (202 Accepted)
  separate: (id) =>
    api.post(`/stems/separate/${id}`, {}, { timeout: 600000 }), // 10 min

  // GET /api/stems/:id → { stems: [...] }
  getStems: (id) =>
    api.get(`/stems/${id}`),
};
