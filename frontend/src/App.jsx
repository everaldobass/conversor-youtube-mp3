// ============================================================
// App.jsx — Roteamento e Providers
// ============================================================
// Este é o componente raiz do React. Ele configura:
//
//  1. AuthProvider: disponibiliza dados de autenticação para
//     toda a aplicação via Context API
//
//  2. BrowserRouter + Routes: define o sistema de navegação
//     por URLs (React Router v6)
//
//  3. ProtectedRoute: componente que redireciona para /login
//     se o usuário não estiver autenticado
//
// Hierarquia de rotas:
//   /login                → LoginPage (pública)
//   /                     → AppLayout (protegida)
//     /                   → HomePage
//     /playlist           → PlaylistPage
//     /stems              → StemsPage
//     /buscar             → HomePage (com busca ativa)
//     /biblioteca         → HomePage
//     /curtidas           → PlaylistPage filtrada
//     /youtube            → HomePage (abre modal YouTube)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts e Páginas
import AppLayout    from './layouts/AppLayout';
import LoginPage    from './pages/LoginPage';
import HomePage     from './pages/HomePage';
import PlaylistPage from './pages/PlaylistPage';
import StemsPage    from './pages/StemsPage';

// ── ProtectedRoute ───────────────────────────────────────────
// Componente wrapper: se não estiver logado, redireciona para /login
// "children" é o componente a ser renderizado se estiver logado
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto verifica o token salvo, mostra tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4 animate-logo-pulse">
            🎧
          </div>
          <p className="text-[var(--text2)] text-sm font-medium">Carregando…</p>
        </div>
      </div>
    );
  }

  // Não autenticado → redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ── Componente Principal ─────────────────────────────────────
export default function App() {
  return (
    // AuthProvider precisa envolver tudo que usa useAuth()
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Rota pública: Login ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Rotas protegidas (precisam de login) ── */}
          {/*
            AppLayout é o "pai" de todas as rotas protegidas.
            Ele renderiza a Sidebar + Player + <Outlet /> (onde
            as páginas filhas são injetadas).
          */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Página inicial */}
            <Route index element={<HomePage />} />

            {/* Reutiliza HomePage para buscar e biblioteca */}
            <Route path="buscar"    element={<HomePage />} />
            <Route path="biblioteca" element={<HomePage />} />

            {/* Playlist */}
            <Route path="playlist"  element={<PlaylistPage />} />
            <Route path="curtidas"  element={<PlaylistPage />} />

            {/* Stems */}
            <Route path="stems"     element={<StemsPage />} />

            {/* YouTube (redireciona para home que tem o modal) */}
            <Route path="youtube"   element={<HomePage />} />

            {/* Qualquer rota não encontrada → volta para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
