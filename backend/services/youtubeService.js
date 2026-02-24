// ============================================================
// services/youtubeService.js — Serviço de Download e Conversão
// ============================================================
// "Services" contêm lógica de negócio mais complexa ou que
// envolve ferramentas externas. Separar em services mantém
// os controllers limpos e o código reutilizável.
//
// Este serviço usa:
//  - yt-dlp: ferramenta de linha de comando para baixar vídeos
//  - ffmpeg: ferramenta para converter formatos de mídia
//
// ⚠️ REQUISITO: yt-dlp e ffmpeg precisam estar instalados
//    no sistema operacional para este código funcionar!
//    Linux: sudo apt install ffmpeg yt-dlp
//    Windows: baixe os executáveis e adicione ao PATH
// ============================================================

const { exec } = require('child_process'); // Permite executar comandos no terminal
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Converte exec (callback) para Promise (async/await)
const execAsync = promisify(exec);

// Pasta onde os MP3s serão salvos
const MP3_FOLDER = process.env.MP3_FOLDER || './storage/mp3';

// Garante que a pasta existe ao iniciar o serviço
if (!fs.existsSync(MP3_FOLDER)) {
  fs.mkdirSync(MP3_FOLDER, { recursive: true });
}

// ── Download e Conversão ─────────────────────────────────────
// Recebe a URL do YouTube e retorna os dados da música convertida
async function downloadAndConvert(url) {
  // Gera um nome único para o arquivo usando o timestamp atual
  const nomeArquivo = `audio_${Date.now()}`;
  const caminhoSaida = path.join(MP3_FOLDER, `${nomeArquivo}.mp3`);

  try {
    // PASSO 1: Busca os metadados do vídeo sem baixar
    // --dump-json = retorna informações em formato JSON
    // --no-playlist = não baixa playlists inteiras
    const { stdout: metadataJson } = await execAsync(
      `yt-dlp --dump-json --no-playlist "${url}"`
    );

    const metadata = JSON.parse(metadataJson);

    // PASSO 2: Baixa e converte para MP3
    // -x = extrai apenas áudio
    // --audio-format mp3 = converte para MP3
    // --audio-quality 0 = melhor qualidade possível
    // -o = define o nome do arquivo de saída
    await execAsync(
      `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${caminhoSaida}" "${url}"`
    );

    // Verifica se o arquivo foi criado com sucesso
    if (!fs.existsSync(caminhoSaida)) {
      throw new Error('Falha ao criar o arquivo MP3.');
    }

    // Retorna os dados da música para o controller
    return {
      titulo: metadata.title || 'Sem título',
      artista: metadata.uploader || metadata.channel || 'Desconhecido',
      duracao: formatarDuracao(metadata.duration), // Converte segundos para mm:ss
      thumbnail: metadata.thumbnail || null,
      caminhoArquivo: caminhoSaida,
    };

  } catch (error) {
    // Se algo falhou, tenta limpar o arquivo parcialmente criado
    if (fs.existsSync(caminhoSaida)) {
      fs.unlinkSync(caminhoSaida);
    }
    throw new Error(`Falha na conversão: ${error.message}`);
  }
}

// ── Função auxiliar para formatar duração ────────────────────
// Converte segundos (ex: 225) para formato mm:ss (ex: "3:45")
function formatarDuracao(segundos) {
  if (!segundos) return '0:00';
  const minutos = Math.floor(segundos / 60);
  const segsRestantes = Math.floor(segundos % 60);
  return `${minutos}:${segsRestantes.toString().padStart(2, '0')}`;
}

module.exports = { downloadAndConvert };
