// ============================================================
// middleware/errorMiddleware.js — Tratamento Global de Erros
// ============================================================
// Este middleware captura TODOS os erros não tratados da API.
//
// No Express, um middleware de erro se diferencia dos normais
// por ter 4 parâmetros: (err, req, res, next).
// O Express reconhece isso e chama este middleware sempre que
// alguma rota disparar um erro com next(erro).
//
// Centralizar o tratamento de erros aqui evita repetição de
// código de tratamento de erro em cada rota.
// ============================================================

function errorMiddleware(err, req, res, next) {
  // Exibe o erro no console do servidor para depuração
  console.error('❌ Erro capturado:', err.message);
  console.error(err.stack); // Mostra onde exatamente o erro ocorreu

  // Define o status HTTP (usa o do erro, ou 500 como padrão)
  // 500 = Internal Server Error (erro interno do servidor)
  const statusCode = err.statusCode || 500;

  // Responde ao cliente com uma mensagem de erro padronizada
  res.status(statusCode).json({
    erro: err.message || 'Erro interno no servidor.',
    // Em produção, não expomos detalhes técnicos do erro
    detalhes: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorMiddleware;
