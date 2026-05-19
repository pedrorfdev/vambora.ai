import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { getPexelsUrl } from '../../hooks/usePexelsImage'
import { airbnbLink, decolarLink, flightsLink, googleHotelsLink, mapsLink, symplaLink } from '../../lib/deeplinks'
import type { Guide } from '../../types/guide'

// ── Glass card — theme-aware ──────────────────
function glassStyle() {
  return {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-bg-border)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  } as React.CSSProperties
}

// ── Restaurantes ──────────────────────────────
const PRECO_CONFIG = {
  economico: { label: 'Econômico', color: '#00A878', bg: 'rgba(0,168,120,0.15)', border: 'rgba(0,168,120,0.3)' },
  moderado: { label: 'Moderado', color: '#5DADE2', bg: 'rgba(93,173,226,0.15)', border: 'rgba(93,173,226,0.3)' },
  sofisticado: { label: 'Sofisticado', color: '#E8A020', bg: 'rgba(232,160,32,0.15)', border: 'rgba(232,160,32,0.3)' },
}

export function RestaurantsExpanded({ guide }: { guide: Guide }) {
  return (
    <div className="flex flex-col gap-3">
      {guide.restaurantes.map((r, i) => {
        const preco = PRECO_CONFIG[r.preco]
        return (
          <motion.a
            key={r.nome}
            href={mapsLink(r.maps_query)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group flex gap-4 p-4 rounded-2xl no-underline transition-all duration-250"
            style={glassStyle()}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-yellow-glow)'
              e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-bg-card)'
              e.currentTarget.style.borderColor = 'var(--color-bg-border)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            {/* Avatar inicial */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
              style={{ background: preco.bg, border: `1px solid ${preco.border}`, color: preco.color }}>
              {r.nome.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-bold text-sm" style={{ color: 'var(--color-fg-primary)' }}>{r.nome}</p>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0"
                  style={{ background: preco.bg, border: `1px solid ${preco.border}`, color: preco.color }}>
                  {preco.label}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--color-fg-muted)' }}>{r.tipo}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{r.descricao}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: 'var(--color-amber)' }}>💡 {r.dica}</p>
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

// ── Eventos ────────────────────────────────────
export function EventsExpanded({ guide }: { guide: Guide }) {
  if (guide.eventos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={glassStyle()}>
          🎭
        </div>
        <p className="font-bold" style={{ color: 'var(--color-fg-primary)' }}>Nenhum evento identificado</p>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-fg-secondary)' }}>
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
    <div className="grid grid-cols-1 gap-3">
      {guide.eventos.map((ev, i) => (
        <motion.a
          key={ev.nome}
          href={symplaLink(ev.link_busca)}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="group flex flex-col p-4 rounded-2xl no-underline transition-all duration-250"
          style={glassStyle()}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--color-yellow-glow)'
            e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--color-bg-card)'
            e.currentTarget.style.borderColor = 'var(--color-bg-border)'
            e.currentTarget.style.transform = 'none'
          }}
        >
          {/* Data em cima */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <span className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'var(--color-amber-glow)', border: '1px solid var(--color-amber-border)', color: 'var(--color-amber)' }}>
              📅 {ev.data}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>📍 {ev.local}</span>
          </div>

          <p className="font-bold text-sm mb-1.5" style={{ color: 'var(--color-fg-primary)' }}>{ev.nome}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>{ev.descricao}</p>

          <p className="text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-yellow)' }}>
            buscar no Sympla ↗
          </p>
        </motion.a>
      ))}
    </div>
  )
}

// ── Gastos ─────────────────────────────────────
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
      <div className="p-4 rounded-2xl text-sm" style={glassStyle()}>
        <span style={{ color: 'var(--color-fg-secondary)' }}>Estimativa para </span>
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''}</strong>
        <span style={{ color: 'var(--color-fg-secondary)' }}> durante </span>
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.periodo.total_dias} dias</strong>
        <span style={{ color: 'var(--color-fg-secondary)' }}> em </span>
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong>.
      </div>

      {/* Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BUDGET_ITEMS.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={glassStyle()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${item.color}20`, border: `1px solid ${item.color}35` }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-fg-primary)' }}>{item.label}</p>
                <p className="truncate" style={{ fontSize: '0.62rem', color: 'var(--color-fg-muted)' }}>{item.sub}</p>
              </div>
            </div>
            <p className="text-2xl font-bold wrap-break-word" style={{ color: item.color }}>{b[item.key]}</p>
          </motion.div>
        ))}
      </div>

      {/* Totais */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 px-5 py-3.5 rounded-xl" style={glassStyle()}>
          <span className="text-sm shrink-0" style={{ color: 'var(--color-fg-secondary)' }}>Total por pessoa</span>
          <span className="text-sm font-bold wrap-break-word" style={{ color: 'var(--color-fg-primary)' }}>{b.total_por_pessoa}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4 rounded-2xl"
          style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
        >
          <div className="min-w-0">
            <p className="font-bold text-sm" style={{ color: 'var(--color-yellow)' }}>Total estimado</p>
            <p className="truncate" style={{ fontSize: '0.7rem', color: 'var(--color-yellow-border)', marginTop: 2 }}>
              {guide.periodo.total_pessoas} pessoa{guide.periodo.total_pessoas > 1 ? 's' : ''} × {guide.periodo.total_dias} dias
            </p>
          </div>
          <p className="text-2xl font-bold wrap-break-word" style={{ color: 'var(--color-yellow)' }}>{b.total_geral}</p>
        </motion.div>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--color-fg-muted)' }}>
        * Preços médios — valores podem variar conforme época e disponibilidade.
      </p>
    </div>
  )
}

// ── Reservas ───────────────────────────────────
const BOOKING_QUERIES = {
  hotels: 'luxury hotel room interior',
  airbnb: 'cozy apartment living room',
  flights: 'airplane window sky clouds',
  decolar: 'travel airport departure',
}

interface BookingCardProps {
  label: string
  desc: string
  color: string
  href: string
  pexelsQuery: string
  index: number
}

function BookingCard({ label, desc, color, href, pexelsQuery, index }: BookingCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    getPexelsUrl(pexelsQuery).then(url => {
      if (!url.startsWith('linear')) setImgUrl(url)
    })
  }, [pexelsQuery])

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden no-underline shrink-0"
      style={{
        height: 340,
        border: hovered ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.1)',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}33` : 'none',
        transform: hovered ? 'translateY(-5px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Imagem de fundo */}
      {imgUrl
        ? <img src={imgUrl} alt={label} className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) saturate(0.75)', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
        : <div className="absolute inset-0" style={{ background: `${color}20` }} />
      }

      {/* Overlay gradiente */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)` }} />

      {/* Conteúdo */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Badge topo */}
        <div className="self-start px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
          style={{ background: `${color}30`, border: `1px solid ${color}55`, color }}>
          {label}
        </div>

        {/* Rodapé */}
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{desc}</p>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.22 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full"
              style={{ background: color, color: '#fff' }}>
              Reservar ↗
            </span>
          </motion.div>
        </div>
      </div>
    </motion.a>
  )
}

export function BookingExpanded({ guide }: { guide: Guide }) {
  const options = [
    {
      label: 'Google Hotels',
      desc: 'Compare hotéis, pousadas e hostels com filtros de preço',
      color: '#4285F4',
      pexelsQuery: BOOKING_QUERIES.hotels,
      href: googleHotelsLink({ destino: `${guide.destino.nome} ${guide.destino.estado}`, dataInicio: guide.periodo.data_inicio, dataFim: guide.periodo.data_fim, adultos: guide.periodo.total_pessoas }),
    },
    {
      label: 'Airbnb',
      desc: 'Casas, apartamentos e quartos com experiência local',
      color: '#FF5A5F',
      pexelsQuery: BOOKING_QUERIES.airbnb,
      href: airbnbLink({ destino: `${guide.destino.nome} ${guide.destino.estado}`, dataInicio: guide.periodo.data_inicio, dataFim: guide.periodo.data_fim, adultos: guide.periodo.total_pessoas }),
    },
    {
      label: 'Google Flights',
      desc: 'Compare passagens e encontre o melhor preço',
      color: '#34A853',
      pexelsQuery: BOOKING_QUERIES.flights,
      href: flightsLink({ destino: guide.destino.nome }),
    },
    {
      label: 'Decolar',
      desc: 'Voos, hotéis e pacotes completos para o destino',
      color: '#FF6600',
      pexelsQuery: BOOKING_QUERIES.decolar,
      href: decolarLink({ destino: guide.destino.nome }),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl text-sm" style={glassStyle()}>
        <span style={{ color: 'var(--color-fg-secondary)' }}>Abre em nova aba com </span>
        <strong style={{ color: 'var(--color-fg-primary)' }}>{guide.destino.nome}</strong>
        <span style={{ color: 'var(--color-fg-secondary)' }}> e suas datas já preenchidas.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt, i) => (
          <BookingCard key={opt.label} {...opt} index={i} />
        ))}
      </div>

      <div className="p-4 rounded-2xl text-sm"
        style={{ background: 'var(--color-amber-glow)', border: '1px solid var(--color-amber-border)', color: 'var(--color-amber)' }}>
        💡 Reserve hospedagem com antecedência — preços sobem bastante em feriados e alta temporada.
      </div>
    </div>
  )
}