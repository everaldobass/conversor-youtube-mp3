// ============================================================
// services/api.js — Instância Central do Axios
// ============================================================
// Axios é uma biblioteca para fazer requisições HTTP (chamar a API).
// Aqui configuramos UMA instância central com:
//  - baseURL: endereço base do backend
//  - interceptors: código que roda automaticamente em TODA requisição
//
// Vantagem: não precisamos repetir o token e a URL base em cada
// componente. Tudo centralizado aqui.
// ============================================================

import axios from 'axios';

// Cria a instância do Axios com configurações padrão
const api = axios.create({
  baseURL: '/api', // O Vite proxy redireciona para http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos (conversão de vídeo pode demorar)
});

// ── Interceptor de Requisição ────────────────────────────────
// Executa ANTES de cada requisição ser enviada
// Injeta o token JWT automaticamente no cabeçalho Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de Resposta ──────────────────────────────────
// Executa DEPOIS de cada resposta recebida
// Trata erros globais automaticamente
api.interceptors.response.use(
  (response) => response, // Resposta OK: passa adiante sem modificar

  (error) => {
    const status = error.response?.status;

    // Token expirado ou inválido → redireciona para login
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // Não usamos navigate() aqui pois estamos fora do React
      // O AuthContext vai detectar a ausência do token e redirecionar
      window.dispatchEvent(new Event('auth:logout'));
    }

    // Erro de servidor → loga no console em desenvolvimento
    if (status >= 500) {
      console.error('❌ Erro interno do servidor:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;
