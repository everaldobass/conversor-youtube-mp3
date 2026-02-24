// ============================================================
// models/Stem.js — Model (tabela) de Stems (faixas separadas)
// ============================================================
// "Stem" é um termo musical para cada camada individual de uma música.
// Ex: uma música tem stems de vocais, bateria, baixo e outros instrumentos.
//
// Quando o usuário separa os stems de uma música da Playlist,
// cada stem gerado é salvo aqui.
//
// Relacionamento: Playlist → Stem (1 música pode ter vários stems)
// ============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Playlist = require('./Playlist');

// Define o model Stem (tabela Stems no banco)
const Stem = sequelize.define('Stem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Tipo do stem: qual instrumento/camada é este arquivo
  // Ex: "vocals", "drums", "bass", "other"
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Caminho do arquivo de áudio do stem no servidor
  // Ex: "./storage/stems/abc123_vocals.wav"
  caminhoArquivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Chave estrangeira — conecta o stem à música de origem
  playlistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Playlist, // Referencia a tabela Playlists
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

// ── Relacionamentos ──────────────────────────────────────────
// Uma música tem muitos stems
Playlist.hasMany(Stem, { foreignKey: 'playlistId', as: 'stems' });

// Cada stem pertence a uma música
Stem.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'musica' });

module.exports = Stem;
