// ─────────────────────────────────────────────
// GuideHeader.tsx — Header com imagem do destino
// e card de clima estilo widget de celular
// ─────────────────────────────────────────────

import { motion } from 'motion/react'
import type { Guide } from '../../types/guide'

interface GuideHeaderProps {
  guide: Guide
  onReset: () => void
}

function unsplashUrl(query: string) {
  return `https://images.unsplash.com/featured/?${encodeURIComponent(query)}&w=1200&q=85`
}

// Card de clima estilo widget iOS
function WeatherWidget({ clima }: { clima: Guide['clima'] }) {
  // Mapeia condição pra ícone
  const icon = clima.condicao.toLowerCase().includes('chuv') ? '🌧'
    : clima.condicao.toLowerCase().includes('nublado') ? '⛅'
      : clima.condicao.toLowerCase().includes('parcial') ? '🌤'
        : '☀️'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(16,185,129,0.08) 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        backdropFilter: 'blur(8px)',
        minWidth: 180,
      }}
    >
      {/* Temp + ícone */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-fg-primary)', lineHeight: 1 }}>
            {clima.temperatura_media}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-fg-secondary)' }}>
            {clima.condicao}
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>

      {/* Divisor */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

      {/* Dica */}
      <div>
        <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(232,184,75,0.8)' }}>
          Melhor época
        </p>
        <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
          {clima.melhor_epoca}
        </p>
      </div>

      {/* Dica de roupa */}
      {clima.dica && (
        <p className="text-xs" style={{ color: 'var(--color-fg-muted)', fontStyle: 'italic' }}>
          💡 {clima.dica}
        </p>
      )}
    </motion.div>
  )
}

export function GuideHeader({ guide, onReset }: GuideHeaderProps) {
  const { destino, periodo, clima, dica_golden } = guide

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between mb-10">
        <button onClick={onReset} className="btn-ghost flex items-center gap-2 text-sm">
          ← Nova busca
        </button>
        <span className="badge-gold">guia gerado</span>
      </div>

      {/* Hero image do destino */}
      <div className="relative rounded-[2rem] overflow-hidden mb-10" style={{ height: 380, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3)' }}>
        <img
          src={unsplashUrl(destino.unsplash_query)}
          alt={destino.nome}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.75)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,14,13,0.95) 0%, rgba(15,14,13,0.4) 40%, transparent 100%)' }}
        />

        {/* Info sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#F2EEE8', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                {destino.nome}
              </h1>
              <span style={{ fontSize: '1.5rem', color: 'rgba(242,238,232,0.6)', fontWeight: 300, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {destino.estado}
              </span>
            </div>
            <p className="mt-1 text-base leading-relaxed" style={{ color: 'rgba(242,238,232,0.85)', maxWidth: '480px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {destino.descricao_curta}
            </p>

            {/* Período + pessoas */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-wrap gap-2">
                <span className="badge-gold">
                  📅 {periodo.data_inicio} → {periodo.data_fim}
                </span>
                <span className="badge-blue" style={{ color: 'var(--color-blue-soft)' }}>
                  {periodo.total_dias} dias · {periodo.total_pessoas} pessoa{periodo.total_pessoas > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[10.5px] font-medium opacity-60 mt-0.5 tracking-wide" style={{ color: '#F2EEE8' }}>
                * Caso não tenham sido especificados, datas e orçamento são inferidos com base no destino.
              </p>
            </div>
          </div>

          {/* Weather widget sobreposto na imagem */}
          <div className="hidden md:block shrink-0">
            <WeatherWidget clima={clima} />
          </div>
        </div>
      </div>

      {/* Weather widget mobile — abaixo da imagem */}
      <div className="md:hidden mb-8">
        <WeatherWidget clima={clima} />
      </div>

      {/* Destaques */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {destino.destaques.map(d => (
          <motion.span 
            key={d} 
            className="text-xs px-3.5 py-1.5 rounded-full cursor-default" 
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(232,184,75,0.15)' }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-fg-primary)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ color: 'var(--color-yellow)', marginRight: 4, opacity: 0.8 }}>✧</span>
            {d}
          </motion.span>
        ))}
      </div>

      {/* Dica golden */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative p-6 rounded-2xl overflow-hidden mb-4"
        style={{
          background: 'var(--color-yellow-glow)',
          border: '1px solid var(--color-yellow-border)',
          boxShadow: '0 8px 32px -8px rgba(232,184,75,0.15)'
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: 'var(--color-yellow)' }} />
        <div className="pl-4">
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--color-yellow)' }}>
            ✦ Dica golden
          </span>
          <p className="mt-2.5 text-base leading-relaxed" style={{ color: 'var(--color-fg-primary)' }}>
            {dica_golden}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}