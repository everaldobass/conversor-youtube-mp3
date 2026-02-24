// ============================================================
// models/Playlist.js — Model (tabela) de Músicas/Playlist
// ============================================================
// Cada registro aqui representa uma música convertida do YouTube.
// Tem uma relação com User: cada música pertence a um usuário.
//
// Relacionamento: User → Playlist (1 usuário pode ter várias músicas)
// O campo userId é a "chave estrangeira" que faz essa ligação.
// ============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

// Define o model Playlist (tabela Playlists no banco)
const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Título da música (ex: "Bohemian Rhapsody")
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Nome do artista (ex: "Queen")
  artista: {
    type: DataTypes.STRING,
    allowNull: true, // Opcional — pode não ser identificado
  },

  // Gênero musical (ex: "Rock")
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Batidas por minuto — usado por DJs e produtores
  bpm: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Tom musical (ex: "Ré menor")
  tom: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Duração da música (ex: "3:45")
  duracao: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Caminho do arquivo MP3 no servidor (ex: "./storage/mp3/abc123.mp3")
  caminhoArquivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // URL da imagem thumbnail do vídeo do YouTube
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // URL original do vídeo do YouTube
  youtubeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Chave estrangeira — conecta a música ao usuário dono dela
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,   // Referencia a tabela Users
      key: 'id',     // Coluna da tabela Users que é referenciada
    },
  },
}, {
  timestamps: true,
});

// ── Relacionamentos ──────────────────────────────────────────
// Um usuário tem muitas músicas (1 para N)
User.hasMany(Playlist, { foreignKey: 'userId', as: 'musicas' });

// Cada música pertence a um usuário
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'dono' });

module.exports = Playlist;
