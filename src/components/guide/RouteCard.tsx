// ─────────────────────────────────────────────
// RouteCard.tsx — Roteiro expandido com abas
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { mapsLink } from '../../lib/deeplinks'
import type { Guide, RouteDay } from '../../types/guide'

const PERIODO_CONFIG = {
  'manhã': { icon: '🌅', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  'tarde': { icon: '☀️', color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  'noite': { icon: '🌙', color: '#818CF8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.2)' },
}

function DayContent({ day }: { day: RouteDay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-4"
    >
      <h3 className="font-semibold text-base" style={{ color: 'var(--color-fg-primary)' }}>
        {day.titulo}
      </h3>

      {day.paradas.map((parada, i) => {
        const cfg = PERIODO_CONFIG[parada.periodo]
        return (
          <a
            key={i}
            href={mapsLink(parada.maps_query)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 p-4 rounded-xl no-underline transition-all duration-200"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-bg-border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
              e.currentTarget.style.background = 'var(--color-yellow-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-bg-border)'
              e.currentTarget.style.background = 'var(--color-bg-card)'
            }}
          >
            {/* Badge período */}
            <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold h-fit mt-0.5" style={{
              background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
            }}>
              {cfg.icon} {parada.periodo}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm transition-colors" style={{ color: 'var(--color-fg-primary)' }}>
                  {parada.local}
                </p>
                <span className="text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-yellow)' }}>
                  ver no maps ↗
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>
                {parada.descricao}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-yellow)', opacity: 0.8 }}>
                💡 {parada.dica_local}
              </p>
            </div>
          </a>
        )
      })}
    </motion.div>
  )
}

// Exportado pro GuideView usar no expanded
export function RouteExpanded({ guide }: { guide: Guide }) {
  const [activeDay, setActiveDay] = useState(0)

  return (
    <div>
      {/* Abas dos dias */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {guide.roteiro.map((day, i) => (
          <button
            key={day.dia}
            onClick={() => setActiveDay(i)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeDay === i ? 'var(--color-yellow)' : 'var(--color-bg-card)',
              color: activeDay === i ? '#0F0E0D' : 'var(--color-fg-secondary)',
              border: activeDay === i ? 'none' : '1px solid var(--color-bg-border)',
            }}
          >
            Dia {day.dia}
          </button>
        ))}
      </div>

      {/* Conteúdo do dia ativo */}
      <AnimatePresence mode="wait">
        <DayContent key={activeDay} day={guide.roteiro[activeDay]} />
      </AnimatePresence>
    </div>
  )
}