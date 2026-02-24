// ============================================================
// middleware/authMiddleware.js — Verificação de Autenticação
// ============================================================
// Este middleware protege as rotas que exigem login.
//
// Como funciona o fluxo:
//  1. Usuário faz login e recebe um TOKEN JWT
//  2. Nas próximas requisições, envia esse token no cabeçalho:
//     Authorization: Bearer eyJhbGci...
//  3. Este middleware intercepta a requisição, lê o token,
//     verifica se é válido e libera (ou bloqueia) o acesso
//
// JWT (JSON Web Token) é como um "crachá digital" — contém
// informações do usuário e uma assinatura criptográfica.
// ============================================================

const jwt = require('jsonwebtoken');

// Middleware de autenticação
// req = requisição do cliente
// res = resposta que vamos enviar
// next = função que chama o próximo middleware/rota
function authMiddleware(req, res, next) {
  try {
    // Lê o cabeçalho Authorization da requisição
    // Ex: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];

    // Verifica se o cabeçalho existe
    if (!authHeader) {
      return res.status(401).json({ 
        erro: 'Token não fornecido. Faça login para continuar.' 
      });
    }

    // O cabeçalho tem formato "Bearer TOKEN"
    // Usamos split(' ') para separar e pegamos só a parte do token [1]
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        erro: 'Formato inválido. Use: Bearer SEU_TOKEN' 
      });
    }

    // Verifica e decodifica o token usando a chave secreta do .env
    // Se o token for inválido ou expirado, jwt.verify lança um erro
    const dadosDecodificados = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa os dados do usuário à requisição para uso nas rotas
    // Ex: req.usuario.id, req.usuario.email
    req.usuario = dadosDecodificados;

    // Chama o próximo passo (a rota em si)
    next();

  } catch (error) {
    // Token inválido, expirado ou mal formatado
    return res.status(401).json({ 
      erro: 'Token inválido ou expirado. Faça login novamente.' 
    });
  }
}

module.exports = authMiddleware;
