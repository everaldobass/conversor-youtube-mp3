// ============================================================
// services/authService.js — Serviço de Autenticação
// ============================================================
import api from './api';

export const authService = {
  // POST /api/auth/login → { token, usuario }
  login: (email, senha) =>
    api.post('/auth/login', { email, senha }),

  // POST /api/auth/register → { mensagem, usuario }
  register: (nome, email, senha) =>
    api.post('/auth/register', { nome, email, senha }),

  // GET /api/auth/status → { usuario } (requer token)
  status: () =>
    api.get('/auth/status'),
};
