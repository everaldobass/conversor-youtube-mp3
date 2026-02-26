// ============================================================
// hooks/useAuth.js — Re-exporta o hook de autenticação
// ============================================================
// O hook useAuth está definido no AuthContext, mas re-exportamos
// aqui para manter a convenção de importar hooks de src/hooks/.
//
// Uso nos componentes:
//   import { useAuth } from '../hooks/useAuth';
//   const { usuario, login, logout, isAuthenticated } = useAuth();
// ============================================================

export { useAuth } from '../context/AuthContext';
