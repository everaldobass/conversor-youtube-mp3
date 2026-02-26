// ============================================================
// context/AuthContext.jsx — Contexto Global de Autenticação
// ============================================================
// "Context" no React é uma forma de compartilhar estado entre
// componentes sem precisar passar props manualmente por vários
// níveis. É como uma "variável global" segura do React.
//
// Este contexto guarda:
//  - usuario: dados do usuário logado (nome, email, perfil)
//  - token: JWT salvo no localStorage
//  - login(): função para fazer login
//  - logout(): função para deslogar
//  - isAuthenticated: true/false
//  - loading: true enquanto verifica o token salvo
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

// 1. Cria o contexto com valor padrão vazio
const AuthContext = createContext(null);

// 2. Provider: componente que "envolve" a aplicação e fornece os dados
export function AuthProvider({ children }) {
  const [usuario, setUsuario]       = useState(null);
  const [loading, setLoading]       = useState(true); // começa true para verificar o token salvo

  // ── Verifica token salvo ao abrir o app ─────────────────────
  // useEffect roda uma vez quando o componente é montado
  useEffect(() => {
    async function verificarToken() {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verifica se o token ainda é válido consultando o backend
        const { data } = await authService.status();
        setUsuario(data.usuario);
      } catch {
        // Token inválido ou expirado: limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setLoading(false);
      }
    }

    verificarToken();

    // Escuta o evento de logout disparado pelo interceptor do Axios
    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // ── Função de Login ──────────────────────────────────────────
  const login = useCallback(async (email, senha) => {
    const { data } = await authService.login(email, senha);

    // Salva o token no localStorage (persiste entre reloads)
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);

    return data;
  }, []);

  // ── Função de Cadastro ───────────────────────────────────────
  const register = useCallback(async (nome, email, senha) => {
    const { data } = await authService.register(nome, email, senha);
    return data;
  }, []);

  // ── Função de Logout ─────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  // Valor disponibilizado para todos os componentes filhos
  const value = {
    usuario,
    loading,
    isAuthenticated: !!usuario, // converte para boolean
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook customizado para consumir o contexto facilmente
// Uso: const { usuario, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>');
  }
  return context;
}
