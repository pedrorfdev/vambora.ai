// ─────────────────────────────────────────────
// GuideView.tsx — Cards expansivos
// Grid de cards fechados → click expande tela cheia
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Guide } from '../../types/guide'
import { RouteExpanded } from './RouteCard'
import { RestaurantsExpanded, EventsExpanded, BudgetExpanded, BookingExpanded } from './GuideCards'
import { GuideHeader } from './GuideHeader'

interface GuideViewProps {
  guide: Guide
  onReset: () => void
  onAdapt: (instruction: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}

type CardId = 'roteiro' | 'comer' | 'eventos' | 'gastos' | 'reservar'

interface CardDef {
  id: CardId
  icon: string
  title: string
  image: string
  preview: (guide: Guide) => string
  available: (guide: Guide) => boolean
}

const CARDS: CardDef[] = [
  {
    id: 'roteiro',
    icon: '🗺',
    title: 'Roteiro',
    image: 'https://images.unsplash.com/photo-1506526620579-d5eb31b3ebec?auto=format&fit=crop&w=600&q=80',
    preview: g => `${g.roteiro.length} dias · ${g.roteiro[0]?.titulo ?? ''}`,
    available: g => g.roteiro.length > 0,
  },
  {
    id: 'comer',
    icon: '🍽',
    title: 'Onde comer',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    preview: g => `${g.restaurantes.length} restaurantes selecionados`,
    available: g => g.restaurantes.length > 0,
  },
  {
    id: 'eventos',
    icon: '🎭',
    title: 'Eventos',
    image: 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?auto=format&fit=crop&w=600&q=80',
    preview: g => g.eventos.length > 0 ? `${g.eventos.length} eventos no período` : 'Sem eventos',
    available: g => g.eventos.length > 0,
  },
  {
    id: 'gastos',
    icon: '💸',
    title: 'Gastos',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    preview: g => `Total estimado: ${g.orcamento.total_geral}`,
    available: () => true,
  },
  {
    id: 'reservar',
    icon: '🏨',
    title: 'Reservar',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=600&q=80',
    preview: () => 'Booking, Airbnb, voos e mais',
    available: () => true,
  },
]

// Card fechado
function SummaryCard({ card, guide, onClick }: { card: CardDef; guide: Guide; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const available = card.available(guide)

  return (
    <motion.button
      onClick={available ? onClick : undefined}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={available ? { scale: 0.98 } : {}}
      className="relative text-left rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer w-full group"
      style={{
        aspectRatio: '3/4',
        opacity: available ? 1 : 0.4,
        cursor: available ? 'pointer' : 'default',
        boxShadow: hovered && available ? '0 16px 40px rgba(0,0,0,0.5), 0 0 0 2px rgba(232,184,75,0.4)' : '0 8px 24px rgba(0,0,0,0.3)',
        transform: hovered && available ? 'translateY(-4px)' : 'none',
      }}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: hovered && available ? 'scale(1.08)' : 'scale(1)' }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)',
          opacity: hovered ? 0.95 : 0.8
        }}
      />

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          {card.icon}
        </div>

        <div>
          <h3 className="font-bold text-2xl mb-1.5" style={{ color: '#F2EEE8', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {card.title}
          </h3>
          <p className="text-sm line-clamp-2" style={{ color: 'rgba(242,238,232,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {card.preview(guide)}
          </p>
          {available && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0, marginTop: hovered ? 16 : 0 }}
              className="overflow-hidden"
            >
              <span className="text-xs font-semibold px-4 py-2 rounded-full inline-block" style={{ background: 'var(--color-yellow)', color: '#0F0E0D' }}>
                Ver detalhes →
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

// Overlay expandido — tela cheia com conteúdo do card
function ExpandedCard({ cardId, guide, onClose, onAdapt, isAdapting, adaptMessage }: {
  cardId: CardId
  guide: Guide
  onClose: () => void
  onAdapt: (v: string) => void
  isAdapting: boolean
  adaptMessage: string
}) {
  const card = CARDS.find(c => c.id === cardId)!
  const [adaptValue, setAdaptValue] = useState('')
  const [adaptOpen, setAdaptOpen] = useState(false)

  function handleAdapt() {
    if (!adaptValue.trim() || isAdapting) return
    onAdapt(adaptValue.trim())
    setAdaptValue('')
    setAdaptOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Header fixo */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-bg-border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{card.icon}</span>
          <h2 className="font-semibold text-base" style={{ color: 'var(--color-fg-primary)' }}>
            {card.title}
          </h2>
          <span className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>
            · {guide.destino.nome}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Adaptar esta seção */}
          <button
            onClick={() => setAdaptOpen(v => !v)}
            className="btn-ghost text-xs"
            style={{ border: '1px solid var(--color-bg-border)' }}
          >
            ✦ Adaptar
          </button>
          <button onClick={onClose} className="btn-ghost text-sm" style={{ border: '1px solid var(--color-bg-border)' }}>
            ✕ Fechar
          </button>
        </div>
      </div>

      {/* Input de adaptação desta seção */}
      <AnimatePresence>
        {adaptOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden flex-shrink-0"
            style={{ borderBottom: '1px solid var(--color-bg-border)', background: 'var(--color-bg-soft)' }}
          >
            <div className="px-6 py-4 flex gap-3 items-center">
              <textarea
                value={adaptValue}
                onChange={e => setAdaptValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdapt() } }}
                placeholder={`Adaptar ${card.title.toLowerCase()}... Ex: quero mais opções econômicas`}
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
                style={{ color: 'var(--color-fg-primary)', caretColor: 'var(--color-yellow)' }}
              />
              <button
                onClick={handleAdapt}
                disabled={!adaptValue.trim() || isAdapting}
                className="btn-primary text-xs px-4 py-2 flex-shrink-0 disabled:opacity-30"
              >
                {isAdapting ? adaptMessage : 'Adaptar →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {cardId === 'roteiro' && <RouteExpanded guide={guide} />}
          {cardId === 'comer' && <RestaurantsExpanded guide={guide} />}
          {cardId === 'eventos' && <EventsExpanded guide={guide} />}
          {cardId === 'gastos' && <BudgetExpanded guide={guide} />}
          {cardId === 'reservar' && <BookingExpanded guide={guide} />}
        </div>
      </div>
    </motion.div>
  )
}

export function GuideView({ guide, onReset, onAdapt, isAdapting, adaptMessage }: GuideViewProps) {
  const [activeCard, setActiveCard] = useState<CardId | null>(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-dvh flex flex-col"
        style={{ background: 'var(--color-bg-base)' }}
      >
        <GuideHeader guide={guide} onReset={onReset} onAdapt={onAdapt} isAdapting={isAdapting} adaptMessage={adaptMessage} />

        <div className="w-full flex-1 flex flex-col mx-auto px-4 sm:px-6 md:px-10 pb-10 md:pb-14" style={{ maxWidth: '1800px' }}>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 mt-16 md:mt-24 flex-1">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <SummaryCard card={card} guide={guide} onClick={() => setActiveCard(card.id)} />
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 pt-12 flex flex-col items-center gap-4"
            style={{ borderTop: '1px solid var(--color-bg-border)' }}
          >
            <p className="text-xs text-center" style={{ color: 'var(--color-fg-muted)' }}>
              Guia gerado por IA · As informações podem variar · Confirme datas e preços antes de reservar
            </p>
            <button onClick={onReset} className="btn-outline text-sm">
              ✈ Planejar nova viagem
            </button>
          </motion.div>

        </div>
      </motion.div>

      {/* Card expandido — overlay por cima de tudo */}
      <AnimatePresence>
        {activeCard && (
          <ExpandedCard
            key={activeCard}
            cardId={activeCard}
            guide={guide}
            onClose={() => setActiveCard(null)}
            onAdapt={onAdapt}
            isAdapting={isAdapting}
            adaptMessage={adaptMessage}
          />
        )}
      </AnimatePresence>
    </>
  )
}