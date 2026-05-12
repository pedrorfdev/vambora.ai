// ─────────────────────────────────────────────
// GuideCards.tsx — Conteúdos expandidos
// Restaurantes, Eventos, Gastos, Reservas
// ─────────────────────────────────────────────

import { motion } from 'motion/react'
import { mapsLink, symplaLink, googleHotelsLink, airbnbLink, flightsLink, decolarLink } from '../../lib/deeplinks'
import type { Guide } from '../../types/guide'

// ── Utilitário de linha de item ───────────────
function ItemRow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 p-4 rounded-xl no-underline transition-all duration-200"
      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
        e.currentTarget.style.background = 'var(--color-yellow-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-bg-border)'
        e.currentTarget.style.background = 'var(--color-bg-card)'
      }}
    >
      {children}
    </a>
  )
}

// ── Restaurantes ──────────────────────────────
const PRECO_CONFIG = {
  economico: { label: 'Econômico', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  moderado: { label: 'Moderado', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)' },
  sofisticado: { label: 'Sofisticado', color: 'var(--color-yellow)', bg: 'var(--color-yellow-glow)', border: 'var(--color-yellow-border)' },
}

export function RestaurantsExpanded({ guide }: { guide: Guide }) {
  return (
    <div className="flex flex-col gap-3">
      {guide.restaurantes.map((r, i) => {
        const preco = PRECO_CONFIG[r.preco]
        return (
          <motion.div
            key={r.nome}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ItemRow href={mapsLink(r.maps_query)}>
              {/* Ícone */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)' }}>
                🍽
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{r.nome}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>{r.tipo}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: preco.bg, border: `1px solid ${preco.border}`, color: preco.color }}>
                    {preco.label}
                  </span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{r.descricao}</p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--color-yellow)', opacity: 0.85 }}>💡 {r.dica}</p>
                <p className="text-xs mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-yellow)' }}>
                  ver no Google Maps ↗
                </p>
              </div>
            </ItemRow>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Eventos ───────────────────────────────────
export function EventsExpanded({ guide }: { guide: Guide }) {
  if (guide.eventos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-4xl">🎭</span>
        <p className="font-semibold" style={{ color: 'var(--color-fg-primary)' }}>Nenhum evento identificado</p>
        <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>Tente pesquisar eventos locais no Sympla ou Eventbrite.</p>
        <a href={`https://www.sympla.com.br/eventos?q=${encodeURIComponent(guide.destino.nome)}`}
          target="_blank" rel="noopener noreferrer" className="btn-outline text-sm mt-2">
          Buscar no Sympla ↗
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {guide.eventos.map((ev, i) => (
        <motion.div
          key={ev.nome}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ItemRow href={symplaLink(ev.link_busca)}>
            {/* Data */}
            <div className="flex-shrink-0 w-14 text-center px-2 py-2 rounded-xl"
              style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}>
              <p className="text-xs font-bold leading-tight" style={{ color: 'var(--color-yellow)' }}>{ev.data}</p>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{ev.nome}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>📍 {ev.local}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{ev.descricao}</p>
              <p className="text-xs mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-yellow)' }}>
                buscar no Sympla ↗
              </p>
            </div>
          </ItemRow>
        </motion.div>
      ))}
    </div>
  )
}

// ── Gastos ────────────────────────────────────
const BUDGET_ROWS = [
  { key: 'hospedagem_por_noite_por_pessoa', label: 'Hospedagem', sub: 'por noite / pessoa', icon: '🏠' },
  { key: 'alimentacao_por_dia_por_pessoa', label: 'Alimentação', sub: 'por dia / pessoa', icon: '🍽' },
  { key: 'transporte_local_por_pessoa', label: 'Transporte', sub: 'por pessoa', icon: '🚌' },
  { key: 'passeios_por_pessoa', label: 'Passeios', sub: 'por pessoa', icon: '🎒' },
] as const

export function BudgetExpanded({ guide }: { guide: Guide }) {
  const b = guide.orcamento

  return (
    <div className="flex flex-col gap-4">
      {/* Contexto */}
      <div className="p-4 rounded-xl text-sm" style={{
        background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)', color: 'var(--color-fg-secondary)',
      }}>
        Estimativa para <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''}</strong>{' '}
        durante <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.periodo.total_dias} dias</strong> em{' '}
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong>.
      </div>

      {/* Linhas por categoria */}
      <div className="flex flex-col gap-2">
        {BUDGET_ROWS.map((row, i) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{row.icon}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-fg-primary)' }}>{row.label}</p>
                <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>{row.sub}</p>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-fg-primary)' }}>
              {b[row.key]}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subtotais */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-fg-secondary)' }}>Total por pessoa</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-fg-primary)' }}>{b.total_por_pessoa}</p>
        </div>

        {/* Total geral — destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center justify-between px-5 py-4 rounded-xl"
          style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-yellow)' }}>Total estimado</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(232,184,75,0.6)' }}>
              {guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''} × {guide.periodo.total_dias} dias
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-yellow)' }}>{b.total_geral}</p>
        </motion.div>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--color-fg-muted)' }}>
        * Estimativa com base em preços médios. Valores podem variar conforme época e disponibilidade.
      </p>
    </div>
  )
}

// ── Reservas ──────────────────────────────────
interface BookingOption {
  label: string
  desc: string
  icon: string
  color: string
  getUrl: (g: Guide) => string
}

const BOOKING_OPTIONS: BookingOption[] = [
  {
    label: 'Google Hotels',
    desc: 'Compare hotéis, pousadas e hostels com filtros de preço e avaliação',
    icon: '🏨',
    color: '#4285F4',
    getUrl: g => googleHotelsLink({
      destino: `${g.destino.nome} ${g.destino.estado}`,
      dataInicio: g.periodo.data_inicio,
      dataFim: g.periodo.data_fim,
      adultos: g.periodo.total_pessoas,
    }),
  },
  {
    label: 'Airbnb',
    desc: 'Casas, apartamentos e quartos com experiência local',
    icon: '🏡',
    color: '#FF5A5F',
    getUrl: g => airbnbLink({
      destino: `${g.destino.nome} ${g.destino.estado}`,
      dataInicio: g.periodo.data_inicio,
      dataFim: g.periodo.data_fim,
      adultos: g.periodo.total_pessoas,
    }),
  },
  {
    label: 'Google Flights',
    desc: 'Compare passagens aéreas e encontre o melhor preço',
    icon: '✈️',
    color: '#34A853',
    getUrl: g => flightsLink({ destino: g.destino.nome }),
  },
  {
    label: 'Decolar',
    desc: 'Voos, hotéis e pacotes completos para o destino',
    icon: '🛫',
    color: '#FF6600',
    getUrl: g => decolarLink({ destino: g.destino.nome }),
  },
]

export function BookingExpanded({ guide }: { guide: Guide }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: 'var(--color-fg-secondary)' }}>
        Abre em nova aba com <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong> e suas datas já preenchidas.
      </p>

      <div className="flex flex-col gap-3">
        {BOOKING_OPTIONS.map((opt, i) => (
          <motion.a
            key={opt.label}
            href={opt.getUrl(guide)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-center gap-4 p-5 rounded-xl no-underline transition-all duration-200"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-yellow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-bg-border)'
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Ícone */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${opt.color}18`, border: `1px solid ${opt.color}30` }}>
              {opt.icon}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{opt.label}</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>{opt.desc}</p>
            </div>

            <span className="text-sm flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-yellow)' }}>
              ↗
            </span>
          </motion.a>
        ))}
      </div>

      <div className="p-4 rounded-xl text-xs" style={{
        background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)', color: 'var(--color-fg-muted)',
      }}>
        💡 Dica: reserve a hospedagem com antecedência. Preços sobem bastante próximo à data, especialmente em feriados e alta temporada.
      </div>
    </div>
  )
}