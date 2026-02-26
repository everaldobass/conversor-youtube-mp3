// ============================================================
// vite.config.js — Configuração do Vite (bundler)
// ============================================================
// Vite é a ferramenta que compila e serve o projeto React
// em modo de desenvolvimento com hot reload (atualização
// automática ao salvar), e gera o build de produção.
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Proxy redireciona chamadas /api para o backend Node.js
  // Assim o frontend em localhost:5173 fala com localhost:5000
  // sem problemas de CORS em desenvolvimento
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
});
