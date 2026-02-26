// ============================================================
// components/Toast.jsx — Notificações Toast
// ============================================================
// Exibe notificações temporárias no canto inferior direito.
// Recebe a lista de toasts do hook useToast via props.
// Usa Framer Motion para animações de entrada/saída suaves.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// Mapa de ícones e cores por tipo de toast
const TOAST_CONFIG = {
  success: { icon: CheckCircle, color: '#1DB954',  border: 'rgba(29,185,84,0.3)'  },
  warn:    { icon: AlertTriangle,color: '#f59e0b',  border: 'rgba(245,158,11,0.3)' },
  error:   { icon: XCircle,     color: '#ef4444',  border: 'rgba(239,68,68,0.3)'  },
  info:    { icon: Info,         color: '#3b82f6',  border: 'rgba(59,130,246,0.3)' },
};

// Componente de um toast individual
function ToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,   scale: 1   }}
      exit={{    opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ borderColor: config.border }}
      className="
        flex items-center gap-3
        bg-[var(--bg3)] border rounded-xl
        px-4 py-3 min-w-[260px] max-w-[340px]
        shadow-card
      "
    >
      {/* Ícone colorido */}
      <Icon size={18} style={{ color: config.color, flexShrink: 0 }} />

      {/* Mensagem */}
      <span className="text-[var(--text)] text-[13px] font-semibold flex-1 leading-snug">
        {toast.message}
      </span>

      {/* Botão fechar */}
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[var(--text3)] hover:text-[var(--text)] transition-colors p-0.5 rounded"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

// Componente container que renderiza todos os toasts
export default function Toast({ toasts, onRemove }) {
  return (
    // Portal-like: posicionado fixo na tela
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          // pointer-events-auto restaura cliques apenas nos toasts
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
