// ============================================================
// routes/stemRoutes.js — Rotas de Separação de Stems
// ============================================================
// Rotas para iniciar e consultar a separação de stems.
// ============================================================

const express = require('express');
const router = express.Router();

const stemController = require('../controllers/stemController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/stems/separate/:id — inicia separação de stems da música :id
router.post('/separate/:id', stemController.separateStems);

// GET /api/stems/:id — lista os stems gerados para a música :id
router.get('/:id', stemController.getStems);

module.exports = router;
