// ============================================================
// models/User.js — Model (tabela) de Usuários
// ============================================================
// Um "Model" representa uma tabela do banco de dados.
// Cada propriedade definida aqui vira uma coluna na tabela.
//
// O Sequelize vai criar automaticamente a tabela "Users" no
// banco de dados com todas as colunas que definirmos aqui.
// ============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define o model User (tabela Users no banco)
const User = sequelize.define('User', {
  // Coluna: id — chave primária, gerada automaticamente
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Cada novo usuário recebe um número único
  },

  // Coluna: nome — obrigatório
  nome: {
    type: DataTypes.STRING,
    allowNull: false, // Não pode ser vazio
  },

  // Coluna: email — obrigatório e único (não pode repetir)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Dois usuários não podem ter o mesmo email
    validate: {
      isEmail: true, // Valida se é um email válido
    },
  },

  // Coluna: senha — será armazenada com hash (criptografada)
  // Nunca salvamos a senha em texto puro por segurança!
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Coluna: perfil — define o papel do usuário no sistema
  perfil: {
    type: DataTypes.ENUM('admin', 'user'), // Só aceita esses dois valores
    defaultValue: 'user',                  // Padrão: usuário comum
  },
}, {
  // O Sequelize adiciona automaticamente createdAt e updatedAt
  timestamps: true,
});

module.exports = User;
