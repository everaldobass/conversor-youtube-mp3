// ============================================================
// routes/playlistRoutes.js — Rotas da Playlist
// ============================================================
// Rotas para gerenciar a playlist do usuário.
// Todas protegidas por authMiddleware.
// ============================================================

const express = require('express');
const router = express.Router();

const playlistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege todas as rotas deste arquivo
router.use(authMiddleware);

// GET /api/playlist — lista todas as músicas do usuário logado
router.get('/', playlistController.listarPlaylist);

// GET /api/playlist/:id — busca uma música específica pelo ID
router.get('/:id', playlistController.buscarMusica);

// DELETE /api/playlist/:id — remove uma música pelo ID
router.delete('/:id', playlistController.deletarMusica);

module.exports = router;
