// ============================================================
// components/Sidebar.jsx — Menu Lateral Fixo
// ============================================================
// Sidebar estilo Spotify com:
//  - Logo + nome da app
//  - Itens de navegação com ícones Lucide
//  - Badge de contagem (playlist)
//  - Hover com glow no accent
//  - Modo colapsado (só ícones)
//  - Animações suaves com Framer Motion
// ============================================================

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Library, Music, Heart,
  SplitSquareHorizontal, Youtube, ChevronLeft, ChevronRight, Headphones
} from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';

// Definição dos itens de navegação
// path: rota do React Router | icon: componente Lucide | badge: chave do estado
const NAV_ITEMS = [
  { label: 'Início',          path: '/',          icon: Home,                  section: 'menu'    },
  { label: 'Buscar',          path: '/buscar',     icon: Search,                section: 'menu'    },
  { label: 'Biblioteca',      path: '/biblioteca', icon: Library,               section: 'menu'    },
  { label: 'Playlists',       path: '/playlist',   icon: Music,                 section: 'musica', badge: 'tracks' },
  { label: 'Curtidas',        path: '/curtidas',   icon: Heart,                 section: 'musica'  },
  { label: 'Stems',           path: '/stems',      icon: SplitSquareHorizontal, section: 'musica'  },
  { label: 'YouTube → MP3',   path: '/youtube',    icon: Youtube,               section: 'musica'  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { tracks } = usePlayer();

  return (
    // motion.aside: versão animável do <aside>
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="
        flex flex-col h-full overflow-hidden
        bg-[var(--bg2)] border-r border-[var(--glass-border)]
      "
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-6 border-b border-[var(--glass-border)] overflow-hidden">
        <div className="
          w-10 h-10 min-w-[40px] rounded-xl
          bg-accent flex items-center justify-center
          shadow-glow-accent
          animate-logo-pulse
        ">
          <Headphones size={22} className="text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-gradient-accent font-extrabold text-lg whitespace-nowrap"
            >
              SoundWave
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navegação ── */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden">
        {/* Renderiza os itens agrupados por section */}
        {['menu', 'musica'].map((section) => (
          <div key={section}>
            {/* Label da seção (só aparece quando expandido) */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--text3)] px-2 pt-4 pb-2 whitespace-nowrap"
                >
                  {section === 'menu' ? 'Menu' : 'Minha Música'}
                </motion.div>
              )}
            </AnimatePresence>

            {NAV_ITEMS.filter((i) => i.section === section).map((item) => {
              const Icon = item.icon;
              const badgeCount = item.badge === 'tracks' ? tracks.length : null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    relative flex items-center gap-3.5
                    px-2 py-[10px] rounded-lg
                    text-[13.5px] font-semibold
                    transition-all duration-200
                    overflow-hidden whitespace-nowrap
                    group
                    ${isActive
                      ? 'text-[var(--text)] bg-[var(--glass)]'
                      : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Indicador lateral ativo */}
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-accent rounded-r-sm" />
                      )}

                      {/* Ícone */}
                      <Icon
                        size={18}
                        className={`min-w-[18px] transition-all duration-200 ${
                          isActive
                            ? 'text-accent drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]'
                            : 'group-hover:text-accent'
                        }`}
                      />

                      {/* Label (oculto quando colapsado) */}
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge de contagem */}
                      {!collapsed && badgeCount !== null && badgeCount > 0 && (
                        <span className="ml-auto bg-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Botão Colapsar/Expandir ── */}
      <button
        onClick={onToggle}
        className="
          m-3 p-2.5 rounded-lg
          bg-[var(--glass)] border border-[var(--glass-border)]
          text-[var(--text2)] hover:text-accent hover:bg-[var(--accent-dim)]
          transition-all duration-200
          flex items-center justify-center
        "
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
