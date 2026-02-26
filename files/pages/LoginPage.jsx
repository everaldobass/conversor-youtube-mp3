// ============================================================
// pages/LoginPage.jsx — Página de Login
// ============================================================
// Tela inicial com:
//  - Ondas concêntricas animadas no fundo
//  - Card centralizado com Framer Motion
//  - Logo animado com pulso
//  - Barras de som animadas
//  - Formulário de email/senha
//  - Botão de login com efeito glow
//  - Link para cadastro
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Headphones } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode,       setMode]       = useState('login');   // 'login' | 'register'
  const [nome,       setNome]       = useState('');
  const [email,      setEmail]      = useState('demo@soundwave.com');
  const [senha,      setSenha]      = useState('demo123');
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !senha) {
      setError('Preencha todos os campos.');
      return;
    }
    if (mode === 'register' && !nome) {
      setError('Informe seu nome.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, senha);
      } else {
        await register(nome, email, senha);
        await login(email, senha);
      }
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.erro || 'Erro ao conectar. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  }

  // Entrar como convidado (demo local sem backend)
  function enterAsGuest() {
    // Simula um usuário para testes sem backend
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] relative overflow-hidden">

      {/* ── Ondas concêntricas animadas ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-accent/10"
            style={{
              animation: `waveExpand 4s ease-out ${i * 1.33}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Gradiente de fundo ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.05) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Card de login ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="
          relative z-10
          w-full max-w-[420px] mx-4
          bg-[var(--card)] border border-[var(--glass-border)]
          rounded-[24px] p-11
          shadow-[0_40px_80px_rgba(0,0,0,0.5)]
          backdrop-blur-xl
        "
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="
            w-16 h-16 rounded-[18px] bg-accent
            flex items-center justify-center mx-auto mb-4
            animate-logo-pulse
          ">
            <Headphones size={32} className="text-black" />
          </div>
          <h1 className="text-[22px] font-extrabold text-[var(--text)]">SoundWave</h1>
          <p className="text-[var(--text2)] text-[13px] mt-1">Sua música. Sua plataforma.</p>

          {/* Barras de som animadas */}
          <div className="flex items-end gap-[3px] h-8 justify-center mt-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="sound-bar" />
            ))}
          </div>
        </div>

        {/* Toggle Login / Cadastro */}
        <div className="
          flex bg-[var(--bg3)] rounded-xl p-1 mb-6
          border border-[var(--glass-border)]
        ">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`
                flex-1 py-2 rounded-lg text-[13px] font-bold
                transition-all duration-200
                ${mode === m
                  ? 'bg-accent text-black shadow-glow-accent'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
                }
              `}
            >
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome (só no cadastro) */}
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-[12px] font-bold tracking-[0.5px] text-[var(--text2)] mb-1.5">
                NOME
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="
                  w-full bg-[var(--bg3)] border-[1.5px] border-[var(--glass-border)]
                  rounded-lg px-4 py-3 text-[var(--text)] text-[14px] font-medium
                  placeholder:text-[var(--text3)]
                  focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-dim)] focus:bg-[var(--bg2)]
                  transition-all duration-200
                "
              />
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[12px] font-bold tracking-[0.5px] text-[var(--text2)] mb-1.5">
              EMAIL
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="
                  w-full bg-[var(--bg3)] border-[1.5px] border-[var(--glass-border)]
                  rounded-lg pl-11 pr-4 py-3 text-[var(--text)] text-[14px] font-medium
                  placeholder:text-[var(--text3)]
                  focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-dim)] focus:bg-[var(--bg2)]
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-[12px] font-bold tracking-[0.5px] text-[var(--text2)] mb-1.5">
              SENHA
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
              <input
                type={showPass ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full bg-[var(--bg3)] border-[1.5px] border-[var(--glass-border)]
                  rounded-lg pl-11 pr-12 py-3 text-[var(--text)] text-[14px] font-medium
                  placeholder:text-[var(--text3)]
                  focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-dim)] focus:bg-[var(--bg2)]
                  transition-all duration-200
                "
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)] transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-[12.5px] font-semibold bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
            >
              ⚠️ {error}
            </motion.p>
          )}

          {/* Botão principal */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="
              w-full py-3.5 mt-2
              bg-accent hover:bg-accent-hover text-black
              rounded-full font-extrabold text-[14px] tracking-wide
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-glow-accent hover:shadow-glow-lg
              hover:-translate-y-0.5
            "
          >
            {loading
              ? '⏳ Aguarde…'
              : mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'
            }
          </motion.button>
        </form>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--glass-border)]" />
          <span className="text-[var(--text3)] text-[12px]">ou</span>
          <div className="flex-1 h-px bg-[var(--glass-border)]" />
        </div>

        {/* Botão de convidado */}
        <button
          onClick={enterAsGuest}
          className="
            w-full py-3 text-[13px] font-semibold
            bg-[var(--glass)] border-[1.5px] border-[var(--glass-border)]
            text-[var(--text)] rounded-full
            hover:border-accent hover:text-accent hover:bg-[var(--accent-dim)]
            transition-all duration-200
          "
        >
          🎵 Entrar como Convidado
        </button>

        {/* Rodapé */}
        <p className="text-center text-[12.5px] text-[var(--text2)] mt-6">
          {mode === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-accent font-bold hover:underline"
          >
            {mode === 'login' ? 'Cadastrar grátis' : 'Fazer login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
