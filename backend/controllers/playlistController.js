// ============================================================
// controllers/playlistController.js — Gerenciamento de Playlist
// ============================================================
// Controla as operações da playlist do usuário:
//  - Listar todas as músicas
//  - Buscar uma música específica por ID
//  - Deletar uma música
//
// Importante: cada usuário só pode ver e gerenciar as
// SUAS PRÓPRIAS músicas. Filtramos sempre por userId.
// ============================================================

const fs = require('fs'); // Módulo nativo do Node para trabalhar com arquivos
const Playlist = require('../models/Playlist');

// ── Listar todas as músicas do usuário ───────────────────────
// GET /api/playlist (rota protegida)
async function listarPlaylist(req, res, next) {
  try {
    const userId = req.usuario.id;

    // Busca todas as músicas que pertencem ao usuário logado
    const musicas = await Playlist.findAll({
      where: { userId },            // Filtra pelo ID do usuário
      order: [['createdAt', 'DESC']], // Mais recentes primeiro
    });

    res.json({
      total: musicas.length,
      musicas,
    });

  } catch (error) {
    next(error);
  }
}

// ── Buscar uma música específica ─────────────────────────────
// GET /api/playlist/:id (rota protegida)
// :id é um parâmetro dinâmico na URL — ex: /api/playlist/5
async function buscarMusica(req, res, next) {
  try {
    const { id } = req.params; // Lê o :id da URL
    const userId = req.usuario.id;

    // Busca a música pelo ID e pelo userId (segurança!)
    const musica = await Playlist.findOne({
      where: { id, userId }, // Garante que a música pertence ao usuário
    });

    if (!musica) {
      return res.status(404).json({ 
        erro: 'Música não encontrada.' 
      });
    }

    res.json({ musica });

  } catch (error) {
    next(error);
  }
}

// ── Deletar uma música ───────────────────────────────────────
// DELETE /api/playlist/:id (rota protegida)
async function deletarMusica(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.usuario.id;

    // Busca a música para verificar se existe e pertence ao usuário
    const musica = await Playlist.findOne({ where: { id, userId } });

    if (!musica) {
      return res.status(404).json({ 
        erro: 'Música não encontrada.' 
      });
    }

    // Remove o arquivo MP3 físico do servidor (libera espaço em disco)
    if (musica.caminhoArquivo && fs.existsSync(musica.caminhoArquivo)) {
      fs.unlinkSync(musica.caminhoArquivo); // unlinkSync = deletar arquivo
    }

    // Remove o registro do banco de dados
    await musica.destroy();

    res.json({ mensagem: 'Música removida com sucesso!' });

  } catch (error) {
    next(error);
  }
}

module.exports = { listarPlaylist, buscarMusica, deletarMusica };
