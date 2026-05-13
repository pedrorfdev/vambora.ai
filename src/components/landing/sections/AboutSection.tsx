// ─────────────────────────────────────────────
// AboutSection.tsx — Sobre o Vambora e Mapa Interativo
// ─────────────────────────────────────────────

import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const CARDS = [
  {
    url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80',
    label: 'Rio de Janeiro', sub: 'A cidade maravilhosa',
    pos: { top: '68%', left: '72%' }
  },
  {
    url: 'https://images.unsplash.com/photo-1548963670-c94ea3d0e9ea?w=400&q=80',
    label: 'Salvador', sub: 'Berço da cultura brasileira',
    pos: { top: '40%', left: '76%' }
  },
  {
    url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400&q=80',
    label: 'Florianópolis', sub: 'A ilha da magia',
    pos: { top: '80%', left: '60%' }
  },
  {
    url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400&q=80',
    label: 'Amazônia', sub: 'O pulmão do mundo',
    pos: { top: '25%', left: '30%' }
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80',
    label: 'Pantanal', sub: 'Natureza sem filtro',
    pos: { top: '55%', left: '42%' }
  },
  {
    url: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=400&q=80',
    label: 'Gramado', sub: 'Europa no sul do Brasil',
    pos: { top: '88%', left: '55%' }
  },
]

function MapPin({
  card, index,
}: {
  card: typeof CARDS[0]
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      className="absolute flex items-center justify-center z-10 group"
      style={{ top: card.pos.top, left: card.pos.left, x: '-50%', y: '-50%' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Pin principal */}
      <div
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 cursor-pointer z-10 overflow-hidden"
        style={{
          background: 'var(--color-bg-card)',
          borderColor: hovered ? 'var(--color-yellow)' : 'var(--color-bg-border)',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <img
          src={card.url}
          alt={card.label}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Pulse background para destinos em destaque */}
      {(index === 0 || index === 2 || index === 3) && !hovered && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--color-yellow)' }}
        />
      )}

      {/* Tooltip Card */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12, scale: hovered ? 1 : 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 rounded-2xl p-4 z-50 origin-top pointer-events-none"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-bg-border)',
          boxShadow: 'var(--shadow-card-hover)'
        }}
      >
        <h4 className="text-sm font-semibold leading-tight mb-1" style={{ color: 'var(--color-fg-primary)' }}>
          {card.label}
        </h4>
        <p className="text-xs leading-snug" style={{ color: 'var(--color-fg-secondary)' }}>
          {card.sub}
        </p>
      </motion.div>
    </motion.div>
  )
}

export function AboutSection() {
  const titleRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section className="py-24 md:py-32 overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Coluna Esquerda: Textos */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 32 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest mb-4 block"
              style={{ color: 'var(--color-yellow)' }}
            >
              sobre o vambora
            </span>
            <h2
              className="text-serif font-normal max-w-lg"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-fg-primary)', lineHeight: 1.2 }}
            >
              Um guia que conhece o Brasil de verdade.
            </h2>
            <p
              className="mt-6 max-w-md text-base md:text-lg leading-relaxed"
              style={{ color: 'var(--color-fg-secondary)' }}
            >
              Não é uma lista genérica. É um roteiro feito pra você — com eventos reais,
              preços honestos e dicas que só quem foi sabe. Explore a diversidade do nosso país
              no mapa ao lado e sinta o gostinho da sua próxima aventura.
            </p>
          </motion.div>

          {/* Coluna Direita: Mapa Interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isTitleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2.5rem] overflow-hidden flex items-center justify-center group"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-bg-border)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Fundo Pontilhado (Grid/Radar) */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, var(--color-fg-muted) 2px, transparent 2px)',
              backgroundSize: '28px 28px',
              backgroundPosition: 'center center'
            }} />

            {/* Círculos Decorativos do Radar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full border opacity-40 transition-transform duration-1000 group-hover:scale-[1.02]" style={{ borderColor: 'var(--color-bg-border)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full border opacity-30 transition-transform duration-1000 group-hover:scale-[0.98]" style={{ borderColor: 'var(--color-bg-border)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] rounded-full border opacity-20" style={{ borderColor: 'var(--color-bg-border)' }} />

            {/* Pinos do Mapa */}
            {CARDS.map((card, i) => (
              <MapPin key={card.label} card={card} index={i} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}