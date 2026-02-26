// ============================================================
// layouts/AppLayout.jsx — Layout Principal da Aplicação
// ============================================================
// Define o grid de 3 áreas:
//  ┌─────────────┬──────────────────────┐
//  │   Sidebar   │    Main Content      │
//  │  (coluna 1) │    (coluna 2)        │
//  ├─────────────┴──────────────────────┤
//  │         Player (rodapé)            │
//  └────────────────────────────────────┘
//
// Também renderiza os orbs de fundo animados e o Toast.
// O <Outlet /> do React Router injeta as páginas aqui.
// ============================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Player  from '../components/Player';
import Toast   from '../components/Toast';
import { useToast } from '../hooks/useToast';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  return (
    <div className="relative h-screen overflow-hidden">

      {/* ── Orbs animados de fundo ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orb verde (canto superior direito) */}
        <div
          className="absolute w-[700px] h-[700px] -top-48 -right-48 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(29,185,84,0.07) 0%, transparent 70%)',
            animation: 'orbFloat1 18s ease-in-out infinite alternate',
          }}
        />
        {/* Orb azul (canto inferior esquerdo) */}
        <div
          className="absolute w-[500px] h-[500px] -bottom-24 -left-24 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            animation: 'orbFloat2 14s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* ── Grid principal ── */}
      <div
        className="relative z-10 h-full grid"
        style={{
          gridTemplateColumns: sidebarCollapsed ? '72px 1fr' : '240px 1fr',
          gridTemplateRows: '1fr 88px',
          transition: 'grid-template-columns 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Conteúdo principal (páginas via React Router) */}
        <main className="overflow-y-auto relative" id="main-scroll">
          {/* Outlet = página atual renderizada pelo React Router */}
          <Outlet context={{ showToast }} />
        </main>

        {/* Player */}
        <Player onShowToast={showToast} />
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
