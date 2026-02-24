// ============================================================
// server.js — Ponto de entrada da aplicação
// ============================================================
// Este é o primeiro arquivo que o Node.js executa.
// Ele simplesmente carrega o app.js e inicia o servidor
// na porta definida no arquivo .env.
// Separar server.js de app.js é uma boa prática: facilita
// os testes automatizados, pois podemos importar o app
// sem precisar "subir" o servidor de verdade.
// ============================================================

// Carrega as variáveis do arquivo .env para process.env
require('dotenv').config();

// Importa o app configurado (rotas, middlewares, etc.)
const app = require('./app');

// Importa a função que conecta ao banco de dados
const { connectDB } = require('./config/database');

// Define a porta: usa a do .env ou 5000 como padrão
const PORT = process.env.PORT || 5000;

// Função assíncrona para iniciar tudo na ordem certa
async function startServer() {
  try {
    // 1º — Conecta e sincroniza o banco de dados
    await connectDB();
    console.log('✅ Banco de dados conectado com sucesso!');

    // 2º — Inicia o servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1); // Encerra o processo com código de erro
  }
}

// Chama a função para iniciar
startServer();
