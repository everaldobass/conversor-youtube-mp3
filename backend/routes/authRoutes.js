// ============================================================
// routes/authRoutes.js — Rotas de Autenticação
// ============================================================
// As rotas definem QUAIS endpoints existem e QUAL função
// do controller será chamada para cada um.
//
// Router do Express funciona como um mini-app que agrupa
// rotas relacionadas. Depois registramos no app.js com:
//   app.use('/api/auth', authRoutes)
//
// Resultado:
//   POST /api/auth/register → authController.register
//   POST /api/auth/login    → authController.login
//   GET  /api/auth/status   → authController.status (protegida)
// ============================================================

const express = require('express');
const router = express.Router(); // Cria o mini-roteador

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota pública — qualquer pessoa pode acessar
router.post('/register', authController.register);

// Rota pública — qualquer pessoa pode acessar
router.post('/login', authController.login);

// Rota protegida — precisa estar logado (ter token válido)
// authMiddleware é executado ANTES do authController.status
// Se o token for inválido, authMiddleware já responde com erro 401
// e o authController.status nem é chamado
router.get('/status', authMiddleware, authController.status);

module.exports = router;
