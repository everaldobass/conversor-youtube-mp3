// ============================================================
// controllers/playerController.js — Player de Músicas
// ============================================================
// Fornece os dados necessários para o player do frontend.
// Retorna a música atual + músicas anterior e próxima,
// permitindo a navegação na playlist.
// ============================================================

const Playlist = require('../models/Playlist');

// ── Dados do Player para uma música ─────────────────────────
// GET /api/player/:id (rota protegida)
// Retorna a música atual e links de navegação para prev/next
async function getPlayerData(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.usuario.id;

    // Busca a música atual
    const musicaAtual = await Playlist.findOne({
      where: { id, userId },
    });

    if (!musicaAtual) {
      return res.status(404).json({ 
        erro: 'Música não encontrada.' 
      });
    }

    // Busca todas as músicas do usuário em ordem de criação
    // para poder calcular qual é a anterior e a próxima
    const todasMusicas = await Playlist.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'titulo', 'artista', 'thumbnail'],
    });

    // Encontra o índice (posição) da música atual na lista
    const indiceAtual = todasMusicas.findIndex(m => m.id === musicaAtual.id);

    // Calcula música anterior (null se for a primeira)
    const musicaAnterior = indiceAtual > 0 
      ? todasMusicas[indiceAtual - 1] 
      : null;

    // Calcula próxima música (null se for a última)
    const proximaMusica = indiceAtual < todasMusicas.length - 1 
      ? todasMusicas[indiceAtual + 1] 
      : null;

    // Monta a URL do arquivo de áudio para streaming
    // O frontend usa essa URL para reproduzir o MP3
    const urlAudio = `/storage/mp3/${musicaAtual.caminhoArquivo.split('/').pop()}`;

    res.json({
      musicaAtual: {
        ...musicaAtual.toJSON(),
        urlAudio, // URL para o frontend reproduzir
      },
      navegacao: {
        anterior: musicaAnterior,
        proxima: proximaMusica,
        posicao: indiceAtual + 1,    // Ex: 3 (de 10)
        total: todasMusicas.length,   // Ex: 10
      },
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { getPlayerData };
