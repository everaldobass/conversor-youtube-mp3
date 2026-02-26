# 🚀 SoundWave — Guia de Migração para React + Vite

## Como usar o arquivo index.html

O `index.html` é uma versão **100% funcional** do frontend em HTML puro.
Abra no navegador e teste todas as funcionalidades antes de migrar para React.

---

## 📦 Iniciar o projeto React + Vite

```bash
npm create vite@latest frontend -- --template react
cd soundwave-frontend
npm install
npm install framer-motion lucide-react axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install @tailwindcss/vite
npm run dev
```

---

## 📁 Estrutura de Pastas

```
src/
 ├── components/
 │   ├── Sidebar.jsx          ← Menu lateral (colapso, nav items)
 │   ├── TopBar.jsx           ← Barra de busca + tema + avatar
 │   ├── MusicCard.jsx        ← Card com hover 3D + glow
 │   ├── TrackItem.jsx        ← Linha da track list
 │   ├── Player.jsx           ← Player fixo no rodapé
 │   ├── QuickCard.jsx        ← Card rápido do hero
 │   └── Toast.jsx            ← Sistema de notificações
 │
 ├── pages/
 │   ├── LoginPage.jsx        ← Tela de login com animações
 │   ├── HomePage.jsx         ← Dashboard principal
 │   ├── PlaylistPage.jsx     ← Gerenciar playlists
 │   └── StemsPage.jsx        ← Separação de stems
 │
 ├── layouts/
 │   └── AppLayout.jsx        ← Grid principal (sidebar+main+player)
 │
 ├── services/
 │   ├── api.js               ← Instância do Axios + interceptors
 │   ├── authService.js       ← Login, register, status
 │   ├── playlistService.js   ← CRUD da playlist
 │   ├── youtubeService.js    ← Conversão YouTube → MP3
 │   └── stemService.js       ← Separação de stems
 │
 ├── hooks/
 │   ├── useAuth.js           ← Contexto de autenticação
 │   ├── usePlayer.js         ← Estado global do player
 │   ├── useTheme.js          ← Toggle dark/light
 │   └── useToast.js          ← Sistema de notificações
 │
 ├── styles/
 │   ├── globals.css          ← CSS variables + reset + scrollbar
 │   └── animations.css       ← Keyframes reutilizáveis
 │
 └── App.jsx                  ← Roteamento + providers
```

---

## 🔌 services/api.js — Conexão com o Backend

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o token JWT automaticamente em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// Redireciona para login se o token expirar (401)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## 🔐 services/authService.js

```javascript
import api from './api';

export const authService = {
  login:    (email, senha) => api.post('/auth/login', { email, senha }),
  register: (nome, email, senha) => api.post('/auth/register', { nome, email, senha }),
  status:   () => api.get('/auth/status'),
};
```

---

## 🎵 services/playlistService.js

```javascript
import api from './api';

export const playlistService = {
  listar:  ()   => api.get('/playlist'),
  buscar:  (id) => api.get(`/playlist/${id}`),
  deletar: (id) => api.delete(`/playlist/${id}`),
};
```

---

## ▶️ services/youtubeService.js

```javascript
import api from './api';

export const youtubeService = {
  convert: (url) => api.post('/youtube/convert', { url }),
};
```

---

## 🎛️ services/stemService.js

```javascript
import api from './api';

export const stemService = {
  separate: (id) => api.post(`/stems/separate/${id}`),
  getStems: (id) => api.get(`/stems/${id}`),
};
```

---

## 🪝 hooks/usePlayer.js (Zustand ou Context)

```javascript
import { create } from 'zustand';

export const usePlayer = create((set, get) => ({
  tracks: [],
  currentIdx: 0,
  isPlaying: false,
  progress: 0,
  volume: 80,

  setTracks: (tracks) => set({ tracks }),
  playTrack: (idx) => set({ currentIdx: idx, isPlaying: true, progress: 0 }),
  togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
  nextTrack:  () => set(s => ({ currentIdx: (s.currentIdx+1) % s.tracks.length })),
  prevTrack:  () => set(s => ({ currentIdx: Math.max(0, s.currentIdx-1) })),
  setProgress:(p) => set({ progress: p }),
  setVolume:  (v) => set({ volume: v }),
}));
```

---

## 🎨 Tailwind config (tailwind.config.js)

```javascript
export default {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Montserrat', 'sans-serif'] },
      colors: {
        accent: '#1DB954',
        dark: {
          bg: '#0F172A', card: '#111827', surface: '#1E293B'
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
};
```

---

## 🔑 Funcionalidades Implementadas no index.html

| Feature | Status |
|---------|--------|
| Login com animações | ✅ |
| Ondas sonoras animadas | ✅ |
| Sidebar com colapso | ✅ |
| Dark/Light toggle | ✅ |
| Barra de busca | ✅ |
| Dashboard com cards | ✅ |
| Track list completa | ✅ |
| Player fixo | ✅ |
| Play/Pause/Prev/Next | ✅ |
| Barra de progresso clicável | ✅ |
| Volume + mute | ✅ |
| Shuffle + Repeat | ✅ |
| Sistema de curtidas | ✅ |
| Skeleton loading | ✅ (CSS pronto) |
| Toast notifications | ✅ |
| Modal YouTube URL | ✅ |
| Glassmorphism | ✅ |
| Equalizer animado | ✅ |
| Atalhos de teclado | ✅ (Espaço, →, ←, M) |
| Responsivo Mobile | ✅ |
| Integração com API | 🔌 Comentada no código |
