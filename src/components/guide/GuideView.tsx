// ─────────────────────────────────────────────
// GuideView.tsx — Guia gerado com animações
// stagger + campo de adaptação inline
// ─────────────────────────────────────────────

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Guide } from '../../types/guide'
import type { Variants } from "motion"
import { GuideHeader } from './GuideHeader'
import { RouteCard } from './RouteCard'
import { RestaurantCard, EventCard, BudgetCard, ExternalLinks } from './GuideCards'

interface GuideViewProps {
  guide: Guide
  onReset: () => void
  onAdapt: (instruction: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}

// ── Variantes de animação ─────────────────────
// Cada filho usa delay = index * stagger
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // ease out expo — sensação premium
    },
  }),
}

// ── Seção com título e stagger nos filhos ─────
function Section({
  title,
  children,
  index = 0,
}: {
  title: string
  children: React.ReactNode
  index?: number
}) {
  return (
    <motion.section
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mb-10"
    >
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-5"
        style={{ color: 'var(--color-fg-muted)' }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

// ── Campo de adaptação ────────────────────────
function AdaptInput({
  onAdapt,
  isAdapting,
  adaptMessage,
}: {
  onAdapt: (v: string) => void
  isAdapting: boolean
  adaptMessage: string
}) {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    if (!value.trim() || isAdapting) return
    onAdapt(value.trim())
    setValue('')
    setIsOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="mb-10"
    >
      <div
        className="rounded-2xl border p-5 transition-all duration-200"
        style={{
          background: 'var(--color-bg-card)',
          borderColor: isOpen ? 'var(--color-yellow-border)' : 'var(--color-bg-border)',
          boxShadow: isOpen ? '0 0 0 3px var(--color-yellow-glow)' : undefined,
        }}
      >
        {/* Header do campo */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--color-fg-primary)' }}
            >
              ✦ Quer adaptar o roteiro?
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--color-fg-muted)' }}
            >
              Diga o que mudar — mais praias, menos restaurantes, orçamento menor...
            </p>
          </div>
          {!isOpen && (
            <button
              onClick={() => {
                setIsOpen(true)
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
              className="btn-outline text-xs px-4 py-2"
            >
              Adaptar
            </button>
          )}
        </div>

        {/* Input expansível */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <textarea
                  ref={inputRef}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: quero mais tempo em praias e menos restaurantes sofisticados..."
                  rows={2}
                  disabled={isAdapting}
                  className="
                    w-full bg-transparent resize-none outline-none
                    text-sm leading-relaxed rounded-xl p-3
                    disabled:opacity-50
                  "
                  style={{
                    color: 'var(--color-fg-primary)',
                    border: '1px solid var(--color-bg-border)',
                    background: 'var(--color-bg-soft)',
                  }}
                />
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-ghost text-xs px-3 py-1.5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!value.trim() || isAdapting}
                    className="btn-primary text-xs px-5 py-2"
                  >
                    {isAdapting ? adaptMessage : 'Adaptar roteiro →'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading inline quando está adaptando e o input já fechou */}
        <AnimatePresence>
          {isAdapting && !isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-3"
            >
              {/* Dots animados */}
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--color-yellow)' }}
                  />
                ))}
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--color-fg-secondary)' }}
              >
                {adaptMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── View principal ────────────────────────────
export function GuideView({ guide, onReset, onAdapt, isAdapting, adaptMessage }: GuideViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-dvh"
    >
      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Header — entra primeiro, sem stagger */}
        <GuideHeader guide={guide} onReset={onReset} />

        <hr className="divider mb-10" />

        {/* Campo de adaptação — logo abaixo do header */}
        <AdaptInput
          onAdapt={onAdapt}
          isAdapting={isAdapting}
          adaptMessage={adaptMessage}
        />

        {/* Layout duas colunas com stagger */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">

          {/* Esquerda — roteiro */}
          <div>
            <Section title="Roteiro dia a dia" index={0}>
              <div className="flex flex-col gap-5">
                {guide.roteiro.map((day, i) => (
                  <motion.div
                    key={day.dia}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <RouteCard day={day} index={i} />
                  </motion.div>
                ))}
              </div>
            </Section>
          </div>

          {/* Direita — sidebar */}
          <div className="flex flex-col gap-8">

            <Section title="Reservar viagem" index={1}>
              <ExternalLinks links={guide.links} />
            </Section>

            <Section title="Orçamento estimado" index={2}>
              <BudgetCard budget={guide.orcamento} />
            </Section>

            {guide.restaurantes.length > 0 && (
              <Section title="Onde comer" index={3}>
                <div className="flex flex-col gap-3">
                  {guide.restaurantes.map((r, i) => (
                    <motion.div
                      key={r.nome}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <RestaurantCard restaurant={r} index={i} />
                    </motion.div>
                  ))}
                </div>
              </Section>
            )}

            {guide.eventos.length > 0 && (
              <Section title="Eventos no período" index={4}>
                <div className="flex flex-col gap-3">
                  {guide.eventos.map((e, i) => (
                    <motion.div
                      key={e.nome}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <EventCard event={e} index={i} />
                    </motion.div>
                  ))}
                </div>
              </Section>
            )}

          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-14 pt-8 border-t flex flex-col items-center gap-4"
          style={{ borderColor: 'var(--color-bg-border)' }}
        >
          <p
            className="text-xs text-center"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            Guia gerado por IA · As informações podem variar · Confirme datas e preços antes de reservar
          </p>
          <button onClick={onReset} className="btn-outline text-sm">
            ✈ Planejar nova viagem
          </button>
        </motion.div>

      </div>
    </motion.div>
  )
}