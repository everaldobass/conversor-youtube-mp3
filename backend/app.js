// ============================================================
// app.js — Configuração central do Express
// ============================================================
// Aqui configuramos o "coração" da API:
//  - Criamos a instância do Express
//  - Registramos middlewares globais (CORS, JSON, etc.)
//  - Registramos todas as rotas da API
//  - Registramos o middleware de tratamento de erros
//
// "Middleware" é uma função que fica no meio do caminho entre
// a requisição do cliente e a resposta do servidor.
// Pense como um filtro ou pré-processador da requisição.
// ============================================================

const express = require('express');
const cors = require('cors');

// Importa todos os arquivos de rotas
const authRoutes     = require('./routes/authRoutes');
const youtubeRoutes  = require('./routes/youtubeRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const playerRoutes   = require('./routes/playerRoutes');
const stemRoutes     = require('./routes/stemRoutes');

// Importa o middleware de erros (sempre o último a ser registrado)
const errorMiddleware = require('./middleware/errorMiddleware');

// Cria a aplicação Express
const app = express();

// ── Middlewares Globais ──────────────────────────────────────
// Permite que o frontend (em outro domínio/porta) acesse a API
app.use(cors());

// Permite que o Express leia o corpo das requisições em JSON
// Ex: quando o frontend envia { "email": "...", "senha": "..." }
app.use(express.json());

// Serve os arquivos de áudio diretamente pela URL
// Ex: GET /storage/mp3/musica.mp3
app.use('/storage', express.static('storage'));

// ── Rotas da API ─────────────────────────────────────────────
// Cada grupo de rotas tem um prefixo (/api/auth, /api/youtube, etc.)
app.use('/api/auth',     authRoutes);
app.use('/api/youtube',  youtubeRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/player',   playerRoutes);
app.use('/api/stems',    stemRoutes);

// Rota raiz — apenas para confirmar que a API está no ar
app.get('/', (req, res) => {
  res.json({ mensagem: '🎧 YouTube MP3 API está funcionando!' });
});

// ── Middleware de Erros (deve ser o ÚLTIMO) ──────────────────
// Captura qualquer erro que ocorra nas rotas acima
app.use(errorMiddleware);

// Exporta o app para ser usado no server.js
module.exports = app;
