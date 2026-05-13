import { motion } from 'motion/react'
import type { Guide } from '../../types/guide'

interface GuideHeaderProps {
  guide: Guide
  onReset: () => void
}

function unsplashUrl(query: string) {
  return `https://images.unsplash.com/featured/?${encodeURIComponent(query)}&w=1400&q=90`
}

function WeatherWidget({ clima }: { clima: Guide['clima'] }) {
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
        background: 'linear-gradient(135deg, rgba(30,58,138,0.5) 0%, rgba(6,78,59,0.3) 100%)',
        border: '1px solid rgba(96,165,250,0.25)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        minWidth: 190,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F2EEE8', lineHeight: 1 }}>
            {clima.temperatura_media}
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(242,238,232,0.6)' }}>
            {clima.condicao}
          </p>
        </div>
        <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{icon}</span>
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(232,184,75,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Melhor época
        </p>
        <p className="text-xs" style={{ color: 'rgba(242,238,232,0.55)' }}>{clima.melhor_epoca}</p>
      </div>
      {clima.dica && (
        <p className="text-xs" style={{ color: 'rgba(242,238,232,0.45)', fontStyle: 'italic' }}>
          💡 {clima.dica}
        </p>
      )}
    </motion.div>
  )
}

// Badge grande — datas e pessoas
function HeroBadge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'blue' }) {
  const styles = color === 'gold'
    ? { background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.4)', color: '#E8B84B' }
    : { background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.35)', color: '#93C5FD' }

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
      style={{ ...styles, backdropFilter: 'blur(8px)', letterSpacing: '0.01em' }}
    >
      {children}
    </div>
  )
}

export function GuideHeader({ guide, onReset }: GuideHeaderProps) {
  const { destino, periodo, clima, dica_golden } = guide

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

      {/* Nav */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onReset} className="btn-ghost flex items-center gap-2 text-sm">
          ← Nova busca
        </button>
        <span className="badge-gold">guia gerado</span>
      </div>

      {/* Hero image */}
      <div
        className="relative overflow-hidden mb-10"
        style={{ height: 420, borderRadius: '2rem', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)' }}
      >
        <img
          src={unsplashUrl(destino.unsplash_query)}
          alt={destino.nome}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) saturate(0.9)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.5) 40%, rgba(10,9,8,0.05) 100%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-4 min-w-0">

            {/* Nome + estado */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: '#F2EEE8', fontWeight: 800,
                letterSpacing: '-0.025em', lineHeight: 1,
                textShadow: '0 4px 16px rgba(0,0,0,0.6)',
              }}>
                {destino.nome}
              </h1>
              <span style={{ fontSize: '1.5rem', color: 'rgba(242,238,232,0.5)', fontWeight: 300 }}>
                {destino.estado}
              </span>
            </div>

            {/* Descrição */}
            <p style={{ color: 'rgba(242,238,232,0.75)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {destino.descricao_curta}
            </p>

            {/* Badges de período e pessoas — destaque maior */}
            <div className="flex flex-wrap gap-2.5">
              <HeroBadge color="gold">
                📅 {periodo.data_inicio} → {periodo.data_fim}
              </HeroBadge>
              <HeroBadge color="blue">
                👥 {periodo.total_pessoas} pessoa{periodo.total_pessoas > 1 ? 's' : ''}
              </HeroBadge>
              <HeroBadge color="blue">
                🗓 {periodo.total_dias} dias
              </HeroBadge>
            </div>

          </div>

          {/* Weather widget */}
          <div className="hidden md:block flex-shrink-0">
            <WeatherWidget clima={clima} />
          </div>
        </div>
      </div>

      {/* Weather mobile */}
      <div className="md:hidden mb-8">
        <WeatherWidget clima={clima} />
      </div>

      {/* Destaques */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {destino.destaques.map(d => (
          <motion.span
            key={d}
            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(232,184,75,0.12)' }}
            className="text-xs px-4 py-2 rounded-full"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-bg-border)',
              color: 'var(--color-fg-secondary)',
              cursor: 'default',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ color: 'var(--color-yellow)', marginRight: 5, opacity: 0.7 }}>✧</span>
            {d}
          </motion.span>
        ))}
      </div>

      {/* Aviso inferências */}
      <p className="text-xs mb-6" style={{ color: 'var(--color-fg-muted)', fontStyle: 'italic' }}>
        * Datas, duração e orçamento não informados foram inferidos com base no destino e contexto.
      </p>

      {/* Dica golden */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="relative p-6 rounded-2xl mb-2 overflow-hidden"
        style={{
          background: 'var(--color-yellow-glow)',
          border: '1px solid var(--color-yellow-border)',
          boxShadow: '0 8px 32px -8px rgba(232,184,75,0.12)',
        }}
      >
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full" style={{ background: 'var(--color-yellow)' }} />
        <div className="pl-5">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-yellow)' }}>
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