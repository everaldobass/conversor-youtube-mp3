// ============================================================
// components/TopBar.jsx — Barra Superior
// ============================================================
// Contém:
//  - Botões de navegação (voltar/avançar do React Router)
//  - Barra de busca com animação de foco
//  - Toggle de tema (dark/light) com ícone animado
//  - Avatar do usuário com menu dropdown
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function TopBar({ onSearch }) {
  const navigate      = useNavigate();
  const { usuario, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal,     setSearchVal]     = useState('');
  const [avatarMenu,    setAvatarMenu]    = useState(false);

  // Pega as iniciais do nome para o avatar
  const initials = usuario?.nome
    ? usuario.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'SW';

  function handleSearch(val) {
    setSearchVal(val);
    onSearch?.(val); // chama a prop opcional onSearch
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="
      sticky top-0 z-[100]
      flex items-center gap-4
      px-8 pt-5 pb-4
      bg-gradient-to-b from-[var(--bg)] via-[var(--bg)/80] to-transparent
      backdrop-blur-sm
    ">
      {/* ── Botões de navegação ── */}
      <div className="flex gap-2">
        {[
          { icon: ChevronLeft,  action: () => navigate(-1), title: 'Voltar'   },
          { icon: ChevronRight, action: () => navigate(1),  title: 'Avançar'  },
        ].map(({ icon: Icon, action, title }) => (
          <button
            key={title}
            onClick={action}
            title={title}
            className="
              w-8 h-8 rounded-full
              bg-[var(--bg3)] text-[var(--text2)]
              hover:bg-[var(--glass-border)] hover:text-[var(--text)]
              flex items-center justify-center
              transition-all duration-200
            "
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* ── Barra de busca ── */}
      <div className="relative flex-1 max-w-[380px]">
        {/* Ícone de lupa */}
        <Search
          size={15}
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
            transition-colors duration-200
            ${searchFocused ? 'text-accent' : 'text-[var(--text3)]'}
          `}
        />

        <input
          type="text"
          value={searchVal}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Buscar músicas, artistas…"
          className="
            w-full bg-[var(--bg3)]
            border-[1.5px] border-transparent
            rounded-full py-2.5 pl-11 pr-4
            text-[var(--text)] text-[13px] font-medium
            placeholder:text-[var(--text3)]
            transition-all duration-200
            focus:border-accent focus:bg-[var(--card)]
            focus:shadow-[0_0_0_3px_var(--accent-dim)]
          "
        />

        {/* Limpar busca */}
        <AnimatePresence>
          {searchVal && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.8 }}
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
            >
              ✕
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Ações do lado direito ── */}
      <div className="ml-auto flex items-center gap-3">

        {/* Toggle de tema */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
          className="
            w-9 h-9 rounded-full
            bg-[var(--glass)] border border-[var(--glass-border)]
            text-[var(--text2)] hover:text-accent hover:bg-[var(--accent-dim)]
            flex items-center justify-center
            transition-all duration-200
          "
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setAvatarMenu((v) => !v)}
            className="
              w-9 h-9 rounded-full cursor-pointer
              bg-gradient-to-br from-accent to-sky-400
              flex items-center justify-center
              text-sm font-bold text-white
              border-2 border-transparent
              hover:border-accent hover:shadow-glow-accent
              transition-all duration-200
            "
            title="Meu perfil"
          >
            {initials}
          </motion.div>

          {/* Dropdown menu */}
          <AnimatePresence>
            {avatarMenu && (
              <>
                {/* Overlay para fechar ao clicar fora */}
                <div className="fixed inset-0 z-40" onClick={() => setAvatarMenu(false)} />

                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="
                    absolute right-0 top-12 z-50
                    bg-[var(--bg3)] border border-[var(--glass-border)]
                    rounded-xl shadow-card-hover
                    min-w-[180px] overflow-hidden
                  "
                >
                  {/* Info do usuário */}
                  <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                    <p className="text-[var(--text)] text-sm font-bold truncate-1">
                      {usuario?.nome || 'Usuário'}
                    </p>
                    <p className="text-[var(--text3)] text-[11px] font-medium truncate-1">
                      {usuario?.email || ''}
                    </p>
                  </div>

                  {/* Item: Perfil */}
                  <button
                    onClick={() => setAvatarMenu(false)}
                    className="
                      w-full flex items-center gap-3
                      px-4 py-2.5 text-[var(--text2)] text-sm font-semibold
                      hover:bg-[var(--glass)] hover:text-[var(--text)]
                      transition-colors duration-150
                    "
                  >
                    <User size={15} /> Meu Perfil
                  </button>

                  {/* Item: Sair */}
                  <button
                    onClick={handleLogout}
                    className="
                      w-full flex items-center gap-3
                      px-4 py-2.5 text-[var(--text2)] text-sm font-semibold
                      hover:bg-red-500/10 hover:text-red-400
                      transition-colors duration-150
                    "
                  >
                    <LogOut size={15} /> Sair
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
