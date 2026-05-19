// ─────────────────────────────────────────────
// RouteCard.tsx — Roteiro expandido com abas
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sunrise, Sun, Moon } from 'lucide-react'
import { mapsLink } from '../../lib/deeplinks'
import type { Guide, RouteDay } from '../../types/guide'

// ── Configuração dos períodos com Lucide ──────
const PERIODO_CONFIG = {
  'manhã': {
    Icon: Sunrise,
    label: 'Manhã',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
  },
  'tarde': {
    Icon: Sun,
    label: 'Tarde',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
  },
  'noite': {
    Icon: Moon,
    label: 'Noite',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.12)',
    border: 'rgba(129,140,248,0.25)',
  },
} as const

function PeriodBadge({ periodo }: { periodo: keyof typeof PERIODO_CONFIG }) {
  const cfg = PERIODO_CONFIG[periodo]
  const { Icon } = cfg
  return (
    <div
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl h-fit mt-0.5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <Icon size={13} strokeWidth={2} />
      <span className="text-[0.68rem] font-semibold">{cfg.label}</span>
    </div>
  )
}

function DayContent({ day }: { day: RouteDay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-3"
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
            className="group flex gap-3 p-4 rounded-xl no-underline transition-all duration-200"
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
            <PeriodBadge periodo={parada.periodo} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm" style={{ color: 'var(--color-fg-primary)' }}>
                  {parada.local}
                </p>
                <span
                  className="text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-yellow)' }}
                >
                  ver no maps ↗
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>
                {parada.descricao}
              </p>
              {parada.dica_local && (
                <p
                  className="text-xs mt-2 font-medium"
                  style={{ color: cfg.color, opacity: 0.85 }}
                >
                  💡 {parada.dica_local}
                </p>
              )}
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

  // Reset quando o guide muda — evita crash de índice fora dos limites
  useEffect(() => {
    setActiveDay(0)
  }, [guide])

  // Guard: garante índice válido
  const safeDay = Math.min(activeDay, guide.roteiro.length - 1)
  const currentDay = guide.roteiro[safeDay]

  if (!currentDay) return null

  return (
    <div>
      {/* Abas dos dias */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {guide.roteiro.map((day, i) => (
          <button
            key={day.dia}
            onClick={() => setActiveDay(i)}
            className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: safeDay === i ? 'var(--color-yellow)' : 'var(--color-bg-card)',
              color: safeDay === i ? '#0F0E0D' : 'var(--color-fg-secondary)',
              border: safeDay === i ? 'none' : '1px solid var(--color-bg-border)',
            }}
          >
            Dia {day.dia}
          </button>
        ))}
      </div>

      {/* Conteúdo do dia ativo */}
      <AnimatePresence mode="wait">
        <DayContent key={safeDay} day={currentDay} />
      </AnimatePresence>
    </div>
  )
}