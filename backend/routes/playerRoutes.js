// ============================================================
// routes/playerRoutes.js — Rotas do Player de Música
// ============================================================
// Fornece os dados necessários para o player do frontend.
// ============================================================

const express = require('express');
const router = express.Router();

const playerController = require('../controllers/playerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/player/:id — dados do player para a música de ID :id
// Retorna música atual + anterior + próxima para navegação
router.get('/:id', playerController.getPlayerData);

module.exports = router;
