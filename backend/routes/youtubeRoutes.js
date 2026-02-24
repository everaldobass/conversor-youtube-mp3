// ============================================================
// routes/youtubeRoutes.js — Rotas de Conversão YouTube
// ============================================================
// Todas as rotas aqui são protegidas (requerem login).
// O authMiddleware é aplicado a todas usando router.use()
// ============================================================

const express = require('express');
const router = express.Router();

const youtubeController = require('../controllers/youtubeController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplica authMiddleware em TODAS as rotas deste arquivo
// Equivale a colocar authMiddleware em cada rota individualmente
router.use(authMiddleware);

// POST /api/youtube/convert
// Body: { url: "https://youtube.com/watch?v=..." }
router.post('/convert', youtubeController.convert);

module.exports = router;
