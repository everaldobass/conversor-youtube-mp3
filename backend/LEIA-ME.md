# 🗺️ GUIA DO PROJETO — Para Iniciantes

## O que cada arquivo faz?

```
backend/
│
├── 📄 server.js          ← Ponto de partida. Liga o servidor.
├── 📄 app.js             ← Configura o Express, middlewares e rotas.
├── 📄 package.json       ← Lista de dependências (bibliotecas).
├── 📄 .env               ← Variáveis secretas (porta, senha JWT...).
│
├── 📁 config/
│   └── database.js       ← Conecta ao banco de dados SQLite.
│
├── 📁 models/            ← Representação das tabelas do banco.
│   ├── User.js           ← Tabela de usuários.
│   ├── Playlist.js       ← Tabela de músicas convertidas.
│   └── Stem.js           ← Tabela de stems (faixas separadas).
│
├── 📁 middleware/        ← Funções que ficam "no meio do caminho".
│   ├── authMiddleware.js ← Verifica se o usuário está logado.
│   └── errorMiddleware.js← Captura e trata erros da API.
│
├── 📁 controllers/       ← Lógica de cada funcionalidade.
│   ├── authController.js ← Cadastro, login, status.
│   ├── youtubeController.js ← Conversão YouTube → MP3.
│   ├── playlistController.js← Listar, buscar, deletar músicas.
│   ├── playerController.js  ← Dados para o player (prev/next).
│   └── stemController.js    ← Separação e listagem de stems.
│
├── 📁 routes/            ← Define os endereços (URLs) da API.
│   ├── authRoutes.js     ← /api/auth/register, /login, /status
│   ├── youtubeRoutes.js  ← /api/youtube/convert
│   ├── playlistRoutes.js ← /api/playlist/...
│   ├── playerRoutes.js   ← /api/player/:id
│   └── stemRoutes.js     ← /api/stems/...
│
├── 📁 services/          ← Integrações com ferramentas externas.
│   ├── youtubeService.js ← Usa yt-dlp + ffmpeg para baixar/converter.
│   └── stemService.js    ← Usa Demucs (IA) para separar stems.
│
└── 📁 storage/           ← Arquivos de áudio gerados.
    ├── mp3/              ← Músicas convertidas do YouTube.
    └── stems/            ← Stems gerados pelo Demucs.
```

---

## 🔄 Fluxo de uma Requisição (passo a passo)

Exemplo: usuário converte um vídeo do YouTube

```
Frontend (React)
    ↓ POST /api/youtube/convert  { url: "..." }
    
app.js (recebe a requisição)
    ↓ passa para youtubeRoutes.js
    
youtubeRoutes.js
    ↓ authMiddleware verifica o token JWT
    ↓ (se válido) passa para youtubeController
    
youtubeController.js
    ↓ valida os dados
    ↓ chama youtubeService.downloadAndConvert()
    
youtubeService.js
    ↓ executa yt-dlp (baixa o vídeo)
    ↓ converte para MP3
    ↓ retorna metadados (título, duração, etc.)
    
youtubeController.js
    ↓ salva no banco de dados (tabela Playlist)
    ↓ responde: { mensagem: "Sucesso!", musica: {...} }
    
Frontend (React)
    ← recebe a resposta JSON
```

---

## 🚀 Como Rodar

```bash
# 1. Instalar dependências do Node.js
npm install

# 2. Instalar ferramentas externas (Linux)
sudo apt install ffmpeg
pip install yt-dlp demucs

# 3. Copiar e configurar o .env
cp .env .env.example  # edite as variáveis conforme necessário

# 4. Iniciar o servidor
node server.js

# OU para desenvolvimento (reinicia automaticamente ao salvar)
npm run dev
```

---

## 🔐 Como Usar a API (exemplos com curl)

```bash
# Cadastro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"123456"}'

# Login (guarde o token retornado!)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Converter vídeo (use o token do login)
curl -X POST http://localhost:5000/api/youtube/convert \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## 📚 Conceitos Importantes para Iniciantes

| Conceito | O que é |
|----------|---------|
| **REST API** | Interface para comunicação via HTTP (GET, POST, DELETE...) |
| **JWT** | Token criptografado que autentica o usuário |
| **Middleware** | Função executada entre a requisição e a resposta |
| **ORM** | Ferramenta para trabalhar com banco de dados em JavaScript |
| **Stem** | Camada individual de uma música (vocal, bateria, baixo...) |
| **Hash** | Senha criptografada de forma irreversível |
| **async/await** | Sintaxe para trabalhar com operações que demoram (ex: banco de dados) |
