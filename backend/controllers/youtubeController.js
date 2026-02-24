// ============================================================
// controllers/youtubeController.js — Conversão YouTube → MP3
// ============================================================
// Este controller recebe uma URL do YouTube, usa o serviço
// youtubeService para baixar e converter o vídeo em MP3,
// e salva as informações no banco de dados.
// ============================================================

const Playlist = require('../models/Playlist');
const youtubeService = require('../services/youtubeService');

// ── Converter Vídeo do YouTube para MP3 ─────────────────────
// POST /api/youtube/convert (rota protegida)
// Body esperado: { url: "https://youtube.com/watch?v=..." }
async function convert(req, res, next) {
  try {
    const { url } = req.body;
    const userId = req.usuario.id; // ID do usuário logado (vem do token JWT)

    // Valida se a URL foi enviada
    if (!url) {
      return res.status(400).json({ 
        erro: 'A URL do YouTube é obrigatória.' 
      });
    }

    // Valida se parece uma URL do YouTube
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ 
        erro: 'Por favor, envie uma URL válida do YouTube.' 
      });
    }

    // Chama o serviço que faz o trabalho pesado de download/conversão
    // Isso pode demorar alguns segundos dependendo do tamanho do vídeo
    console.log(`⏳ Iniciando conversão de: ${url}`);
    const dadosMusica = await youtubeService.downloadAndConvert(url);

    // Salva os metadados da música no banco de dados
    const novaMusica = await Playlist.create({
      titulo: dadosMusica.titulo,
      artista: dadosMusica.artista,
      duracao: dadosMusica.duracao,
      thumbnail: dadosMusica.thumbnail,
      caminhoArquivo: dadosMusica.caminhoArquivo,
      youtubeUrl: url,
      userId,
    });

    res.status(201).json({
      mensagem: 'Vídeo convertido com sucesso!',
      musica: novaMusica,
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { convert };
