import { motion } from 'motion/react'
import { mapsLink, symplaLink, googleHotelsLink, airbnbLink, flightsLink, decolarLink } from '../../lib/deeplinks'
import type { Guide } from '../../types/guide'

// ── Restaurantes ──────────────────────────────
const PRECO_CONFIG = {
  economico: { label: 'Econômico', color: '#00A878', bg: 'rgba(0,168,120,0.1)', border: 'rgba(0,168,120,0.25)' },
  moderado: { label: 'Moderado', color: '#5DADE2', bg: 'rgba(93,173,226,0.1)', border: 'rgba(93,173,226,0.25)' },
  sofisticado: { label: 'Sofisticado', color: '#E8A020', bg: 'rgba(232,160,32,0.1)', border: 'rgba(232,160,32,0.25)' },
}

export function RestaurantsExpanded({ guide }: { guide: Guide }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {guide.restaurantes.map((r, i) => {
        const preco = PRECO_CONFIG[r.preco]
        return (
          <motion.a
            key={r.nome}
            href={mapsLink(r.maps_query)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group flex gap-5 p-5 rounded-2xl no-underline transition-all duration-200"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
              e.currentTarget.style.background = 'var(--color-yellow-glow)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-bg-border)'
              e.currentTarget.style.background = 'var(--color-bg-card)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            {/* Avatar com letra */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 font-bold"
              style={{ background: `${preco.color}18`, border: `1px solid ${preco.border}`, color: preco.color }}>
              {r.nome.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="font-bold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{r.nome}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: preco.bg, border: `1px solid ${preco.border}`, color: preco.color }}>
                  {preco.label}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--color-fg-muted)' }}>{r.tipo}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{r.descricao}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: 'var(--color-amber)', opacity: 0.9 }}>
                  💡 {r.dica}
                </p>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-yellow)' }}>
                  Maps ↗
                </span>
              </div>
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}

// ── Eventos ───────────────────────────────────
export function EventsExpanded({ guide }: { guide: Guide }) {
  if (guide.eventos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}>
          🎭
        </div>
        <p className="font-bold" style={{ color: 'var(--color-fg-primary)' }}>Nenhum evento identificado</p>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-fg-muted)' }}>
          Tente pesquisar eventos locais no Sympla ou Eventbrite.
        </p>
        <a href={`https://www.sympla.com.br/eventos?q=${encodeURIComponent(guide.destino.nome)}`}
          target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
          Buscar no Sympla ↗
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {guide.eventos.map((ev, i) => (
        <motion.a
          key={ev.nome}
          href={symplaLink(ev.link_busca)}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="group flex gap-5 p-5 rounded-2xl no-underline transition-all duration-200"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
            e.currentTarget.style.background = 'var(--color-yellow-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-bg-border)'
            e.currentTarget.style.background = 'var(--color-bg-card)'
            e.currentTarget.style.transform = 'none'
          }}
        >
          {/* Data — calendário estilizado */}
          <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center rounded-2xl py-3"
            style={{ background: 'var(--color-amber-glow)', border: '1px solid var(--color-amber-border)' }}>
            <p className="text-xs font-bold leading-tight text-center"
              style={{ color: 'var(--color-amber)' }}>
              {ev.data}
            </p>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm mb-1" style={{ color: 'var(--color-fg-primary)' }}>{ev.nome}</p>
            <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--color-fg-muted)' }}>
              📍 {ev.local}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{ev.descricao}</p>
            <p className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-yellow)' }}>
              buscar no Sympla ↗
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  )
}

// ── Gastos ────────────────────────────────────
const BUDGET_ITEMS = [
  { key: 'hospedagem_por_noite_por_pessoa', label: 'Hospedagem', sub: 'por noite · por pessoa', icon: '🏠', color: '#5DADE2' },
  { key: 'alimentacao_por_dia_por_pessoa', label: 'Alimentação', sub: 'por dia · por pessoa', icon: '🍽', color: '#00A878' },
  { key: 'transporte_local_por_pessoa', label: 'Transporte', sub: 'por pessoa', icon: '🚌', color: '#E8A020' },
  { key: 'passeios_por_pessoa', label: 'Passeios', sub: 'por pessoa', icon: '🎒', color: '#9B59B6' },
] as const

export function BudgetExpanded({ guide }: { guide: Guide }) {
  const b = guide.orcamento

  return (
    <div className="flex flex-col gap-5">
      {/* Contexto */}
      <div className="p-4 rounded-2xl text-sm" style={{
        background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)',
        color: 'var(--color-fg-secondary)',
      }}>
        Estimativa para{' '}
        <strong style={{ color: 'var(--color-fg-primary)' }}>
          {guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''}
        </strong>{' '}
        durante{' '}
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.periodo.total_dias} dias</strong>{' '}
        em <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong>.
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-2 gap-3">
        {BUDGET_ITEMS.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="flex flex-col gap-3 p-4 rounded-2xl"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-fg-primary)' }}>{item.label}</p>
                <p style={{ fontSize: '0.62rem', color: 'var(--color-fg-muted)' }}>{item.sub}</p>
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: item.color }}>{b[item.key]}</p>
          </motion.div>
        ))}
      </div>

      {/* Totais */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-5 py-3 rounded-xl"
          style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)' }}>
          <span className="text-sm" style={{ color: 'var(--color-fg-secondary)' }}>Total por pessoa</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-fg-primary)' }}>{b.total_por_pessoa}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
        >
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--color-yellow)' }}>Total estimado</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(0,168,120,0.6)', marginTop: 2 }}>
              {guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''} × {guide.periodo.total_dias} dias
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-yellow)' }}>{b.total_geral}</p>
        </motion.div>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--color-fg-muted)' }}>
        * Preços médios — valores reais podem variar conforme época e disponibilidade.
      </p>
    </div>
  )
}

// ── Reservas ──────────────────────────────────
const BOOKING_OPTIONS = [
  {
    label: 'Google Hotels', desc: 'Compare hotéis e pousadas', icon: '🏨', color: '#4285F4',
    getUrl: (g: Guide) => googleHotelsLink({ destino: `${g.destino.nome} ${g.destino.estado}`, dataInicio: g.periodo.data_inicio, dataFim: g.periodo.data_fim, adultos: g.periodo.total_pessoas })
  },
  {
    label: 'Airbnb', desc: 'Casas e quartos com experiência local', icon: '🏡', color: '#FF5A5F',
    getUrl: (g: Guide) => airbnbLink({ destino: `${g.destino.nome} ${g.destino.estado}`, dataInicio: g.periodo.data_inicio, dataFim: g.periodo.data_fim, adultos: g.periodo.total_pessoas })
  },
  {
    label: 'Google Flights', desc: 'Compare passagens aéreas', icon: '✈️', color: '#34A853',
    getUrl: (g: Guide) => flightsLink({ destino: g.destino.nome })
  },
  {
    label: 'Decolar', desc: 'Voos, hotéis e pacotes', icon: '🛫', color: '#FF6600',
    getUrl: (g: Guide) => decolarLink({ destino: g.destino.nome })
  },
]

export function BookingExpanded({ guide }: { guide: Guide }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: 'var(--color-fg-secondary)' }}>
        Abre em nova aba com{' '}
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong>{' '}
        e suas datas já preenchidas.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {BOOKING_OPTIONS.map((opt, i) => (
          <motion.a
            key={opt.label}
            href={opt.getUrl(guide)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-center gap-4 p-5 rounded-2xl no-underline transition-all duration-200"
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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${opt.color}18`, border: `1px solid ${opt.color}28` }}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{opt.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>{opt.desc}</p>
            </div>
            <span className="text-base flex-shrink-0 opacity-30 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-yellow)' }}>↗</span>
          </motion.a>
        ))}
      </div>

      <div className="p-4 rounded-2xl text-sm" style={{
        background: 'var(--color-amber-glow)', border: '1px solid var(--color-amber-border)',
        color: 'var(--color-amber)',
      }}>
        💡 Reserve hospedagem com antecedência — preços sobem bastante em feriados e alta temporada.
      </div>
    </div>
  )
}