// ============================================================
// config/database.js — Configuração do Banco de Dados
// ============================================================
// Este arquivo configura a conexão com o SQLite usando o
// Sequelize, que é um ORM (Object-Relational Mapper).
//
// ORM = ferramenta que permite trabalhar com o banco de dados
// usando JavaScript puro, sem precisar escrever SQL manual.
// Ex: em vez de "SELECT * FROM users", você escreve User.findAll()
//
// SQLite é um banco de dados que fica salvo em um único arquivo
// no seu computador — perfeito para projetos iniciantes!
// ============================================================

const { Sequelize } = require('sequelize');
const path = require('path');

// Cria a instância do Sequelize apontando para o arquivo SQLite
// process.env.DB_PATH lê o valor do .env (./database.sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',                          // Tipo do banco: SQLite
  storage: process.env.DB_PATH || './database.sqlite', // Caminho do arquivo
  logging: false,                             // false = não exibe SQL no console
});

// Função que conecta e sincroniza o banco de dados
// "Sincronizar" = cria as tabelas automaticamente se não existirem
async function connectDB() {
  // Importa os models aqui para garantir que estão registrados
  // antes de sincronizar (a ordem importa!)
  require('../models/User');
  require('../models/Playlist');
  require('../models/Stem');

  // Testa se a conexão funciona
  await sequelize.authenticate();

  // Cria/atualiza as tabelas no banco conforme os models definem
  // { alter: true } atualiza colunas existentes sem apagar dados
  await sequelize.sync({ alter: true });
}

// Exporta o sequelize para ser usado nos models
module.exports = { sequelize, connectDB };
