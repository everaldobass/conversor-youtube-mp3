// ============================================================
// tailwind.config.js — Configuração do Tailwind CSS
// ============================================================
// Tailwind é um framework CSS utilitário: em vez de escrever
// classes CSS manualmente, usamos classes prontas como:
//   bg-accent, text-white, rounded-xl, flex, gap-4...
//
// Aqui EXTENDEMOS o Tailwind com nossas cores e animações
// personalizadas, mantendo compatibilidade com as utilitárias
// padrão do Tailwind.
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Onde o Tailwind deve procurar as classes usadas (para tree-shaking)
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  // darkMode: 'class' = ativa modo escuro via classe no <html>
  // Ex: <html class="dark"> ativa todas as classes dark:...
  darkMode: 'class',

  theme: {
    extend: {
      // Fonte principal Montserrat (carregada no index.html)
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },

      // Cores personalizadas do SoundWave
      colors: {
        accent: {
          DEFAULT: '#1DB954',  // Verde Spotify
          dim:     'rgba(29,185,84,0.15)',
          glow:    'rgba(29,185,84,0.4)',
          hover:   '#1ed760',
        },
        dark: {
          bg:      '#0F172A', // Background principal
          card:    '#111827', // Fundo dos cards
          surface: '#1E293B', // Superfícies elevadas
          border:  'rgba(255,255,255,0.08)',
          glass:   'rgba(255,255,255,0.05)',
        },
        light: {
          bg:      '#F9FAFB',
          card:    '#FFFFFF',
          surface: '#F3F4F6',
          border:  'rgba(0,0,0,0.08)',
          glass:   'rgba(0,0,0,0.03)',
        },
      },

      // Animações personalizadas
      animation: {
        'spin-slow':   'spin 20s linear infinite',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
        'wave-expand': 'waveExpand 4s ease-out infinite',
        'sound-bar':   'soundBar 1.2s ease-in-out infinite',
        'orb-float':   'orbFloat 14s ease-in-out infinite alternate',
        'card-in':     'cardSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'toast-in':    'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'eq-bar':      'eqBar 0.9s ease-in-out infinite',
      },

      // Definição dos keyframes referenciados acima
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 40px rgba(29,185,84,0.4)' },
          '50%':     { boxShadow: '0 0 60px rgba(29,185,84,0.6), 0 0 100px rgba(29,185,84,0.3)' },
        },
        waveExpand: {
          '0%':   { width: '100px', height: '100px', opacity: '0.8' },
          '100%': { width: '800px', height: '800px', opacity: '0' },
        },
        soundBar: {
          '0%,100%': { transform: 'scaleY(0.3)', opacity: '0.4' },
          '50%':     { transform: 'scaleY(1)',   opacity: '1'   },
        },
        orbFloat: {
          from: { transform: 'translate(0,0) scale(1)' },
          to:   { transform: 'translate(-80px,60px) scale(1.2)' },
        },
        cardSlideUp: {
          from: { transform: 'translateY(40px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        toastIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        eqBar: {
          '0%,100%': { height: '4px'  },
          '50%':     { height: '14px' },
        },
      },

      // Bordas arredondadas personalizadas
      borderRadius: {
        'xl2': '14px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },

      // Sombras personalizadas
      boxShadow: {
        'glow-accent': '0 0 20px rgba(29,185,84,0.4)',
        'glow-lg':     '0 0 40px rgba(29,185,84,0.3)',
        'card':        '0 8px 32px rgba(0,0,0,0.3)',
        'card-hover':  '0 20px 40px rgba(0,0,0,0.5)',
      },

      // Backdrop blur (glassmorphism)
      backdropBlur: {
        xs: '4px',
      },
    },
  },

  plugins: [],
};
