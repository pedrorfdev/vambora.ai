// ─────────────────────────────────────────────
// GuideView.tsx — Tela principal do guia gerado
//
// Orquestra todos os componentes do guia.
// Layout em duas colunas no desktop:
//   esquerda → roteiro dia a dia
//   direita  → restaurantes, eventos, orçamento, links
// ─────────────────────────────────────────────

import { motion } from 'motion/react'
import type { Guide } from '../../types/guide'
import { GuideHeader } from './GuideHeader'
import { RouteCard } from './RouteCard'
import {
  RestaurantCard,
  EventCard,
  BudgetCard,
  ExternalLinks,
} from './GuideCards'

interface GuideViewProps {
  guide: Guide
  onReset: () => void
}

// ── Componente de seção com título ────────────
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">
        {title}
      </h2>
      {children}
    </section>
  )
}

// ── View principal ────────────────────────────
export function GuideView({ guide, onReset }: GuideViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-dvh"
    >
      {/* Container principal */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header — destino, período, dica golden */}
        <GuideHeader guide={guide} onReset={onReset} />

        <hr className="divider mb-8" />

        {/* Layout duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── Coluna esquerda — roteiro ── */}
          <div>
            <Section title="Roteiro dia a dia">
              <div className="flex flex-col gap-4">
                {guide.roteiro.map((day, i) => (
                  <RouteCard key={day.dia} day={day} index={i} />
                ))}
              </div>
            </Section>
          </div>

          {/* ── Coluna direita — sidebar ── */}
          <div className="flex flex-col gap-6">

            {/* Reservas — CTA principal */}
            <Section title="Reservar viagem">
              <ExternalLinks links={guide.links} />
            </Section>

            {/* Orçamento */}
            <Section title="Orçamento estimado">
              <BudgetCard budget={guide.orcamento} />
            </Section>

            {/* Restaurantes */}
            {guide.restaurantes.length > 0 && (
              <Section title="Onde comer">
                <div className="flex flex-col gap-3">
                  {guide.restaurantes.map((r, i) => (
                    <RestaurantCard key={r.nome} restaurant={r} index={i} />
                  ))}
                </div>
              </Section>
            )}

            {/* Eventos */}
            {guide.eventos.length > 0 && (
              <Section title="Eventos no período">
                <div className="flex flex-col gap-3">
                  {guide.eventos.map((e, i) => (
                    <EventCard key={e.nome} event={e} index={i} />
                  ))}
                </div>
              </Section>
            )}

          </div>
        </div>

        {/* Footer do guia */}
        <div className="mt-12 pt-8 border-t border-black-border flex flex-col items-center gap-3">
          <p className="text-xs text-text-muted text-center">
            Guia gerado por IA · As informações podem variar · Confirme datas e preços antes de reservar
          </p>
          <button onClick={onReset} className="btn-outline text-sm">
            ✈ Planejar nova viagem
          </button>
        </div>

      </div>
    </motion.div>
  )
}