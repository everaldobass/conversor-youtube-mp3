// ============================================================
// services/stemService.js — Serviço de Separação de Stems (IA)
// ============================================================
// Este serviço usa o Demucs, um modelo de IA da Meta (Facebook),
// para separar os componentes de uma música.
//
// ⚠️ REQUISITO: Demucs precisa ser instalado via Python:
//    pip install demucs
//    (recomendado ter uma GPU para não demorar horas!)
//
// Demucs gera 4 arquivos .wav em uma subpasta:
//    ./storage/stems/htdemucs/[nome_do_arquivo]/
//      ├── vocals.wav
//      ├── drums.wav
//      ├── bass.wav
//      └── other.wav
// ============================================================

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Pasta onde os stems serão salvos
const STEMS_FOLDER = process.env.STEMS_FOLDER || './storage/stems';

// Garante que a pasta existe
if (!fs.existsSync(STEMS_FOLDER)) {
  fs.mkdirSync(STEMS_FOLDER, { recursive: true });
}

// ── Separar Stems com Demucs ─────────────────────────────────
// Recebe o caminho do MP3 e o ID da música
// Retorna um array com os stems gerados: [{ tipo, caminhoArquivo }]
async function separate(caminhoMp3, musicaId) {
  // Nome do arquivo sem extensão (ex: "audio_1710000000000")
  const nomeBase = path.basename(caminhoMp3, path.extname(caminhoMp3));

  try {
    // Executa o Demucs via linha de comando
    // --two-stems vocals = separa apenas vocais vs. resto (mais rápido)
    // Para 4 stems, remova o --two-stems
    // -o = pasta de saída
    console.log(`🎛️ Iniciando Demucs para: ${caminhoMp3}`);

    await execAsync(
      `demucs --mp3 -o "${STEMS_FOLDER}" "${caminhoMp3}"`
    );

    // Demucs cria os arquivos em: STEMS_FOLDER/htdemucs/[nome_base]/
    const pastaStems = path.join(STEMS_FOLDER, 'htdemucs', nomeBase);

    // Verifica se a pasta foi criada
    if (!fs.existsSync(pastaStems)) {
      throw new Error('Demucs não gerou a pasta de stems esperada.');
    }

    // Lista os tipos de stems que o Demucs gera
    const tiposDeStems = ['vocals', 'drums', 'bass', 'other'];
    const stemsCriados = [];

    // Para cada tipo, verifica se o arquivo existe e registra
    for (const tipo of tiposDeStems) {
      // Demucs pode gerar .mp3 ou .wav dependendo das opções
      const possiveisExtensoes = ['mp3', 'wav'];

      for (const ext of possiveisExtensoes) {
        const caminhoStem = path.join(pastaStems, `${tipo}.${ext}`);

        if (fs.existsSync(caminhoStem)) {
          stemsCriados.push({
            tipo: traduzirTipo(tipo), // Traduz para português
            caminhoArquivo: caminhoStem,
          });
          break; // Encontrou para este tipo, passa pro próximo
        }
      }
    }

    if (stemsCriados.length === 0) {
      throw new Error('Nenhum stem foi gerado pelo Demucs.');
    }

    return stemsCriados;

  } catch (error) {
    throw new Error(`Falha na separação de stems: ${error.message}`);
  }
}

// ── Traduz os nomes dos stems para português ─────────────────
function traduzirTipo(tipo) {
  const traducoes = {
    vocals: 'Vocais',
    drums: 'Bateria',
    bass: 'Baixo',
    other: 'Outros Instrumentos',
  };
  return traducoes[tipo] || tipo;
}

module.exports = { separate };
