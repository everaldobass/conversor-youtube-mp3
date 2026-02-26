// ============================================================
// src/main.jsx — Ponto de Entrada do React
// ============================================================
// Este arquivo é o "gatilho" que inicializa o React.
// Ele pega o div#root do index.html e injeta toda a árvore
// de componentes React dentro dele.
// StrictMode detecta problemas potenciais em desenvolvimento.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css'; // CSS global e variáveis CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
