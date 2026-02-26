// ============================================================
// hooks/useTheme.js — Toggle de Tema Dark/Light
// ============================================================
// Hook customizado que gerencia o tema da aplicação.
//
// Como funciona:
//  1. O tema é salvo no localStorage (persiste entre reloads)
//  2. Adicionamos/removemos a classe 'dark' no <html>
//  3. O Tailwind usa essa classe para ativar dark:... classes
//  4. As variáveis CSS no globals.css também reagem à classe
//
// Uso:
//   const { theme, toggleTheme, isDark } = useTheme();
// ============================================================

import { useState, useEffect } from 'react';

export function useTheme() {
  // Lê o tema salvo ou usa 'dark' como padrão
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  // Aplica o tema no elemento <html> sempre que mudar
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Persiste no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Alterna entre dark e light
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
