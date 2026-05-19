// ─────────────────────────────────────────────
// DestinationsSection.tsx — Carrossel de destinos
// ─────────────────────────────────────────────

import { motion, useInView } from 'motion/react'
import { useRef, useState, useEffect } from 'react'
import { getPexelsUrl } from '../../../hooks/usePexelsImage'

interface DestinationsSectionProps {
  onSelect: (prompt: string) => void
}

const DESTINATIONS = [
  {
    nome: 'Florianópolis', estado: 'SC',
    descricao: 'Praias, lagoa e gastronomia açoriana',
    url: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=400&q=80',
    prompt: 'Florianópolis, SC — 4 dias, aproveitar praias e gastronomia local',
  },
  {
    nome: 'Rio de Janeiro', estado: 'RJ',
    descricao: 'Cristo, Copacabana e samba',
    url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80',
    prompt: 'Rio de Janeiro, RJ — 5 dias, pontos turísticos clássicos e cultura carioca',
  },
  {
    nome: 'Chapada Diamantina', estado: 'BA',
    descricao: 'Trilhas, cachoeiras e cavernas',
    url: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400&q=80',
    prompt: 'Chapada Diamantina, BA — 6 dias, trilhas e ecoturismo, orçamento moderado',
  },
  {
    nome: 'Salvador', estado: 'BA',
    descricao: 'Pelourinho, axé e acarajé',
    url: 'https://images.unsplash.com/photo-1548963670-c94ea3d0e9ea?w=400&q=80',
    prompt: 'Salvador, BA — 4 dias, cultura, história e gastronomia baiana',
  },
  {
    nome: 'Bonito', estado: 'MS',
    descricao: 'Rios cristalinos e mergulho',
    url: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400&q=80',
    prompt: 'Bonito, MS — 4 dias, ecoturismo e mergulho em rios',
  },
  {
    nome: 'Lençóis Maranhenses', estado: 'MA',
    descricao: 'Dunas brancas e lagoas azuis',
    url: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=400&q=80',
    prompt: 'Lençóis Maranhenses, MA — 4 dias, dunas e lagoas, melhor época',
  },
  {
    nome: 'Gramado', estado: 'RS',
    descricao: 'Clima europeu e chocolates',
    url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400&q=80',
    prompt: 'Gramado, RS — 3 dias, gastronomia e clima de montanha',
  },
  {
    nome: 'Paraty', estado: 'RJ',
    descricao: 'Centro histórico e cachaça artesanal',
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80',
    prompt: 'Paraty, RJ — 3 dias, história, natureza e cachaça artesanal',
  },
]

function DestCard({
  dest, index, onSelect,
}: {
  dest: typeof DESTINATIONS[0]
  index: number
  onSelect: (p: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [imgUrl, setImgUrl] = useState(dest.url)

  useEffect(() => {
    getPexelsUrl(`${dest.nome} ${dest.estado} landmark`).then(url => {
      if (!url.startsWith('linear')) setImgUrl(url)
    })
  }, [dest.nome, dest.estado])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(dest.prompt)}
      className="relative rounded-2xl overflow-hidden cursor-pointer shrink-0"
      style={{
        width: 260, height: 340,
        border: hovered ? '1px solid var(--color-yellow-border)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? 'var(--shadow-yellow)' : undefined,
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <img
        src={imgUrl}
        alt={dest.nome}
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.6s ease',
        }}
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
          transition: 'background 0.3s ease',
        }}
      />
      <div className="absolute top-4 right-4">
        <span className="badge-yellow text-xs">{dest.estado}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-base font-medium" style={{ color: '#F0EDE6' }}>{dest.nome}</h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(240,237,230,0.55)' }}>{dest.descricao}</p>
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          <span className="text-xs font-semibold" style={{ color: 'var(--color-yellow)' }}>
            Gerar guia completo →
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function DestinationsSection({ onSelect }: DestinationsSectionProps) {
  const titleRef = useRef(null)
  const isTitleInView = useInView(titleRef, { once: true, margin: '-60px' })
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <section className="py-28 overflow-hidden" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-widest mb-3 block"
              style={{ color: 'var(--color-yellow)' }}
            >
              destinos populares
            </span>
            <h2
              className="text-serif font-normal"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#F0EDE6', lineHeight: 1.2 }}
            >
              Explore sua próxima aventura.
            </h2>
            <p className="mt-3 text-base" style={{ color: 'rgba(240,237,230,0.45)' }}>
              Clique em qualquer destino para gerar o guia completo.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            {(['left', 'right'] as const).map(dir => (
              <button
                key={dir}
                onClick={() => scrollBy(dir)}
                className="btn-ghost w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {dir === 'left' ? '←' : '→'}
              </button>
            ))}
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {DESTINATIONS.map((dest, i) => (
            <DestCard key={dest.nome} dest={dest} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}