// ============================================================
// hooks/useToast.js — Sistema de Notificações (Toast)
// ============================================================
// Gerencia uma lista de notificações temporárias que aparecem
// no canto inferior direito da tela.
//
// Uso nos componentes:
//   const { toasts, showToast, removeToast } = useToast();
//   showToast('✅ Música adicionada!', 'success');
//   showToast('⚠️ URL inválida', 'warn');
//   showToast('❌ Erro ao converter', 'error');
// ============================================================

import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  // Adiciona um novo toast
  // type: 'info' | 'success' | 'warn' | 'error'
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random(); // ID único

    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove automaticamente após o duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id; // Retorna o ID caso queira remover manualmente
  }, []);

  // Remove um toast pelo ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
