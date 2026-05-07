// ─────────────────────────────────────────────
// RestaurantCard.tsx
// ─────────────────────────────────────────────

import { motion } from 'motion/react'
import { mapsLink } from '../../lib/deeplinks'
import type { Restaurant } from '../../types/guide'

const PRECO_CONFIG = {
  economico:    { label: 'Econômico',   badge: 'badge-emerald', icon: '💚' },
  moderado:     { label: 'Moderado',    badge: 'badge-blue',    icon: '💙' },
  sofisticado:  { label: 'Sofisticado', badge: 'badge-yellow',  icon: '✨' },
}

interface RestaurantCardProps {
  restaurant: Restaurant
  index: number
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  const preco = PRECO_CONFIG[restaurant.preco]

  return (
    <motion.a
      href={mapsLink(restaurant.maps_query)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="card p-4 block group no-underline cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-medium text-text-primary group-hover:text-yellow transition-colors">
            {restaurant.nome}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {restaurant.tipo}
          </p>
        </div>
        <span className={`${preco.badge} shrink-0`}>
          {preco.icon} {preco.label}
        </span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed mb-2">
        {restaurant.descricao}
      </p>
      <p className="text-xs text-yellow opacity-70">
        💡 {restaurant.dica}
      </p>
      <p className="text-xs text-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        ver no Google Maps ↗
      </p>
    </motion.a>
  )
}


// ─────────────────────────────────────────────
// EventCard.tsx
// ─────────────────────────────────────────────

import type { GuideEvent } from '../../types/guide'
import { symplaLink } from '../../lib/deeplinks'

interface EventCardProps {
  event: GuideEvent
  index: number
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.a
      href={symplaLink(event.link_busca)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="card p-4 block group no-underline cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Data destaque */}
        <div className="
          shrink-0 w-12 text-center px-2 py-2 rounded-lg
          bg-yellow-glow border border-yellow-border
        ">
          <p className="text-xs text-yellow font-semibold leading-tight">
            {event.data}
          </p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary group-hover:text-yellow transition-colors">
            {event.nome}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            📍 {event.local}
          </p>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            {event.descricao}
          </p>
        </div>
      </div>
    </motion.a>
  )
}


// ─────────────────────────────────────────────
// BudgetCard.tsx
// ─────────────────────────────────────────────

import type { BudgetEstimate } from '../../types/guide'

interface BudgetCardProps {
  budget: BudgetEstimate
}

const BUDGET_ROWS = [
  { key: 'hospedagem_por_noite', label: 'Hospedagem / noite', icon: '🏠' },
  { key: 'alimentacao_por_dia',  label: 'Alimentação / dia',  icon: '🍽' },
  { key: 'transporte_local',     label: 'Transporte local',   icon: '🚌' },
  { key: 'passeios',             label: 'Passeios',           icon: '🎒' },
] as const

export function BudgetCard({ budget }: BudgetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-5"
    >
      <div className="flex flex-col gap-3 mb-5">
        {BUDGET_ROWS.map(row => (
          <div
            key={row.key}
            className="flex items-center justify-between py-2 border-b border-black-border last:border-0"
          >
            <span className="text-sm text-text-secondary">
              {row.icon} {row.label}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {budget[row.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Total estimado — destaque */}
      <div className="
        flex items-center justify-between p-3 rounded-xl
        bg-yellow-glow border border-yellow-border
      ">
        <span className="text-sm font-semibold text-yellow">
          Total estimado
        </span>
        <span className="text-base font-bold text-yellow">
          {budget.total_estimado}
        </span>
      </div>
    </motion.div>
  )
}


// ─────────────────────────────────────────────
// ExternalLinks.tsx
// ─────────────────────────────────────────────

import type { ExternalLinks as ExternalLinksType } from '../../types/guide'

interface ExternalLinksProps {
  links: ExternalLinksType
}

const LINKS_CONFIG = [
  { key: 'booking',        label: 'Booking',         icon: '🏨', desc: 'Hotéis e pousadas' },
  { key: 'airbnb',         label: 'Airbnb',          icon: '🏡', desc: 'Casas e quartos' },
  { key: 'google_flights', label: 'Google Flights',  icon: '✈️', desc: 'Melhores passagens' },
  { key: 'decolar',        label: 'Decolar',         icon: '🛫', desc: 'Voos e pacotes' },
] as const

export function ExternalLinks({ links }: ExternalLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-5"
    >
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        Pronto pra reservar? 🧳
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Abre com os dados da sua viagem já preenchidos.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {LINKS_CONFIG.map(item => (
          <a
            key={item.key}
            href={links[item.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group flex items-center gap-3 p-3 rounded-xl no-underline
              bg-black-soft border border-black-border
              hover:border-yellow-border hover:bg-yellow-glow
              transition-all duration-200
            "
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-xs font-medium text-text-primary group-hover:text-yellow transition-colors">
                {item.label} ↗
              </p>
              <p className="text-xs text-text-muted">
                {item.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  )
}