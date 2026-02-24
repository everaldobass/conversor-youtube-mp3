
# 🎧 YouTube MP3 API - Node.js + Express + SQLite

API REST profissional para conversão de vídeos do YouTube em MP3, gerenciamento de playlists e separação de stems, consumida por um frontend em ReactJS.

---

# 🚀 Visão Geral

Esta API permite:

- Cadastro e login de usuários (JWT)
- Conversão de vídeos do YouTube para MP3
- Armazenamento de playlist por usuário
- Player com navegação entre músicas
- Separação de stems (vocais, bateria, baixo, outros)
- API REST JSON
- Banco de dados SQLite3
- Arquitetura profissional de pastas

---

# 🏗️ Arquitetura do Projeto

```
backend/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   ├── youtubeController.js
│   ├── playlistController.js
│   ├── playerController.js
│   └── stemController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Playlist.js
│   └── Stem.js
│
├── routes/
│   ├── authRoutes.js
│   ├── youtubeRoutes.js
│   ├── playlistRoutes.js
│   ├── playerRoutes.js
│   └── stemRoutes.js
│
├── services/
│   ├── youtubeService.js
│   └── stemService.js
│
├── storage/
│   ├── mp3/
│   └── stems/
│
├── .env
├── app.js
├── server.js
└── package.json
```

---

# ⚙️ Tecnologias Utilizadas

- Node.js
- Express.js
- SQLite3
- Sequelize ORM
- JWT Authentication
- bcryptjs
- yt-dlp
- ffmpeg
- Demucs
- Multer
- dotenv

---

# 🗄️ Banco de Dados (SQLite)

## 👤 Tabela Users

| Campo | Tipo |
|-------|------|
| id | INTEGER PK |
| nome | STRING |
| email | STRING UNIQUE |
| senha | STRING (bcrypt) |
| perfil | ENUM(admin, user) |
| createdAt | DATE |

---

## 🎵 Tabela Playlist

| Campo | Tipo |
|-------|------|
| id | INTEGER PK |
| titulo | STRING |
| artista | STRING |
| genero | STRING |
| bpm | STRING |
| tom | STRING |
| duracao | STRING |
| caminhoArquivo | STRING |
| thumbnail | STRING |
| youtubeUrl | STRING |
| userId | FK Users |

---

## 🎧 Tabela Stems

| Campo | Tipo |
|-------|------|
| id | INTEGER PK |
| tipo | STRING |
| caminhoArquivo | STRING |
| playlistId | FK Playlist |

---

# 🔐 Autenticação (JWT)

Header:
```
Authorization: Bearer SEU_TOKEN
```

---

# 🌐 Endpoints da API

## 🔐 Autenticação

### Cadastro
POST /api/auth/register

### Login
POST /api/auth/login

### Status
GET /api/auth/status

---

## 🎵 Playlist

GET /api/playlist  
GET /api/playlist/:id  
DELETE /api/playlist/:id  

---

## 🎥 Conversão YouTube → MP3

POST /api/youtube/convert

---

## ▶️ Player

GET /api/player/:id

---

## 🎧 Stems

POST /api/stems/separate/:id  
GET /api/stems/:id  

---

# 📦 Variáveis de Ambiente (.env)

```
PORT=5000
JWT_SECRET=super_secret_key
DB_PATH=./database.sqlite
MP3_FOLDER=./storage/mp3
STEMS_FOLDER=./storage/stems
```

---

# ▶️ Como Rodar Localmente

```
git clone https://github.com/seu-usuario/youtube-mp3-api.git
cd backend
npm install
cp .env.example .env
node server.js
```

---

# 👨‍💻 Autor

Everaldo Nascimento (Teacher Dev)

---

# 📜 Licença

MIT License
