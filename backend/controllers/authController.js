// ============================================================
// controllers/authController.js — Lógica de Autenticação
// ============================================================
// Controllers contêm a "lógica de negócio" da aplicação.
// Eles recebem a requisição (req), executam as operações
// necessárias (consultar banco, validar dados, etc.) e
// enviam a resposta (res).
//
// Este controller cuida de:
//  - Cadastro de novos usuários (register)
//  - Login e geração de token JWT (login)
//  - Verificação do status do usuário logado (status)
// ============================================================

const bcrypt = require('bcryptjs'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT
const User = require('../models/User'); // Model de usuários

// ── Cadastro de Usuário ─────────────────────────────────────
// POST /api/auth/register
// Body esperado: { nome, email, senha }
async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica — todos os campos são obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Nome, email e senha são obrigatórios.' 
      });
    }

    // Verifica se já existe um usuário com este email
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ 
        erro: 'Este email já está cadastrado.' 
      });
    }

    // Criptografa a senha antes de salvar
    // O número 10 é o "salt rounds" — quanto maior, mais seguro (e mais lento)
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco de dados
    const novoUsuario = await User.create({
      nome,
      email,
      senha: senhaHash, // Salva o hash, nunca a senha original!
    });

    // Responde com os dados do usuário (sem a senha)
    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil,
      },
    });

  } catch (error) {
    next(error); // Passa o erro para o errorMiddleware
  }
}

// ── Login de Usuário ────────────────────────────────────────
// POST /api/auth/login
// Body esperado: { email, senha }
async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        erro: 'Email e senha são obrigatórios.' 
      });
    }

    // Busca o usuário pelo email
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ 
        erro: 'Email ou senha incorretos.' 
      });
    }

    // Compara a senha enviada com o hash salvo no banco
    // bcrypt.compare faz isso de forma segura
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        erro: 'Email ou senha incorretos.' 
      });
    }

    // Gera o token JWT com os dados do usuário
    // Este token será enviado em todas as próximas requisições protegidas
    const token = jwt.sign(
      // Payload: dados que ficam "dentro" do token
      { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
      // Chave secreta do .env para assinar o token
      process.env.JWT_SECRET,
      // Opções: token expira em 7 dias
      { expiresIn: '7d' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });

  } catch (error) {
    next(error);
  }
}

// ── Status do Usuário Logado ────────────────────────────────
// GET /api/auth/status (rota protegida — precisa de token)
// req.usuario foi preenchido pelo authMiddleware
async function status(req, res, next) {
  try {
    // Busca os dados atualizados do usuário no banco
    const usuario = await User.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] }, // Exclui a senha da resposta
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ usuario });

  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, status };
