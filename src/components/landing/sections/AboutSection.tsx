// ─────────────────────────────────────────────
// AboutSection.tsx — Cards de destinos do fundo
// ─────────────────────────────────────────────

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const CARDS = [
  {
    url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80',
    label: 'Rio de Janeiro', sub: 'A cidade maravilhosa',
  },
  {
    url: 'https://images.unsplash.com/photo-1548963670-c94ea3d0e9ea?w=400&q=80',
    label: 'Salvador', sub: 'Berço da cultura brasileira',
  },
  {
    url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400&q=80',
    label: 'Florianópolis', sub: 'A ilha da magia',
  },
  {
    url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400&q=80',
    label: 'Amazônia', sub: 'O pulmão do mundo',
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80',
    label: 'Pantanal', sub: 'Natureza sem filtro',
  },
  {
    url: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=400&q=80',
    label: 'Gramado', sub: 'Europa no sul do Brasil',
  },
]

function DestCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 60, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer shrink-0"
      style={{
        width: 220, height: 290,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <img
        src={card.url}
        alt={card.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-medium" style={{ color: '#F0EDE6' }}>{card.label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(240,237,230,0.55)' }}>{card.sub}</p>
      </div>
    </motion.div>
  )
}

export function AboutSection() {
  const titleRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, margin: '-60px' })

  return (
    <section className="py-28 overflow-hidden" style={{ background: '#0D0D0D' }}>
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 32 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-4 block"
            style={{ color: 'var(--color-yellow)' }}
          >
            sobre o vambora
          </span>
          <h2
            className="text-serif font-normal max-w-lg"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F0EDE6', lineHeight: 1.2 }}
          >
            Um guia que conhece o Brasil de verdade.
          </h2>
          <p
            className="mt-4 max-w-md text-base leading-relaxed"
            style={{ color: 'rgba(240,237,230,0.5)' }}
          >
            Não é uma lista genérica. É um roteiro feito pra você — com eventos reais,
            preços honestos e dicas que só quem foi sabe.
          </p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
          {CARDS.map((card, i) => (
            <DestCard key={card.label} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}