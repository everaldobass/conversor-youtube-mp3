// ============================================================
// controllers/stemController.js — Separação de Stems
// ============================================================
// "Stem separation" é o processo de separar as camadas de
// uma música usando IA (Demucs). De uma música completa,
// obtemos 4 arquivos separados:
//  - vocals.wav  → apenas a voz
//  - drums.wav   → apenas a bateria
//  - bass.wav    → apenas o baixo
//  - other.wav   → demais instrumentos
//
// Este processo usa muito processamento (CPU/GPU) e pode
// levar vários minutos dependendo da duração da música.
// ============================================================

const Playlist = require('../models/Playlist');
const Stem = require('../models/Stem');
const stemService = require('../services/stemService');

// ── Iniciar Separação de Stems ───────────────────────────────
// POST /api/stems/separate/:id (rota protegida)
// :id = ID da música na playlist
async function separateStems(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.usuario.id;

    // Verifica se a música existe e pertence ao usuário
    const musica = await Playlist.findOne({ where: { id, userId } });

    if (!musica) {
      return res.status(404).json({ 
        erro: 'Música não encontrada.' 
      });
    }

    // Verifica se os stems já foram gerados para esta música
    const stemsExistentes = await Stem.findAll({ where: { playlistId: id } });
    if (stemsExistentes.length > 0) {
      return res.status(409).json({
        erro: 'Os stems desta música já foram gerados.',
        stems: stemsExistentes,
      });
    }

    // Avisa o cliente que o processo foi iniciado
    // O processo pode demorar, então respondemos imediatamente
    // Em produção, usaríamos uma fila de jobs (Bull, RabbitMQ, etc.)
    res.status(202).json({
      mensagem: 'Separação de stems iniciada! Isso pode levar alguns minutos.',
    });

    // Processa os stems em background (não bloqueia o servidor)
    // ATENÇÃO: erros aqui não serão enviados ao cliente (já respondemos)
    stemService.separate(musica.caminhoArquivo, id)
      .then(async (stemsCriados) => {
        // Salva cada stem no banco de dados
        for (const stem of stemsCriados) {
          await Stem.create({
            tipo: stem.tipo,
            caminhoArquivo: stem.caminhoArquivo,
            playlistId: id,
          });
        }
        console.log(`✅ Stems gerados para música ID ${id}`);
      })
      .catch(err => {
        console.error(`❌ Erro ao gerar stems para música ID ${id}:`, err);
      });

  } catch (error) {
    next(error);
  }
}

// ── Listar Stems de uma Música ───────────────────────────────
// GET /api/stems/:id (rota protegida)
// :id = ID da música na playlist
async function getStems(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.usuario.id;

    // Verifica se a música pertence ao usuário
    const musica = await Playlist.findOne({ where: { id, userId } });

    if (!musica) {
      return res.status(404).json({ 
        erro: 'Música não encontrada.' 
      });
    }

    // Busca todos os stems desta música
    const stems = await Stem.findAll({ where: { playlistId: id } });

    if (stems.length === 0) {
      return res.status(404).json({
        erro: 'Nenhum stem encontrado. Inicie a separação primeiro.',
      });
    }

    // Adiciona a URL de áudio de cada stem para o frontend
    const stemsComUrl = stems.map(stem => ({
      ...stem.toJSON(),
      urlAudio: `/storage/stems/${stem.caminhoArquivo.split('/').pop()}`,
    }));

    res.json({ stems: stemsComUrl });

  } catch (error) {
    next(error);
  }
}

module.exports = { separateStems, getStems };
