import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface Destination {
  label: string
  sub: string
  prompt: string
  // Posição no SVG do mapa (0-100)
  x: number
  y: number
  pulse?: boolean
}

const DESTINATIONS: Destination[] = [
  { label: 'Amazônia', sub: 'O pulmão do mundo', prompt: 'Amazônia, AM — 5 dias, ecoturismo e floresta', x: 28, y: 22, pulse: true },
  { label: 'Fortaleza', sub: 'Praias e dunas do Ceará', prompt: 'Fortaleza, CE — 4 dias, praias e jangadas', x: 72, y: 18 },
  { label: 'Salvador', sub: 'Berço da cultura baiana', prompt: 'Salvador, BA — 4 dias, cultura e gastronomia baiana', x: 76, y: 40 },
  { label: 'Brasília', sub: 'A capital do Brasil', prompt: 'Brasília, DF — 3 dias, arquitetura e política', x: 55, y: 43 },
  { label: 'Pantanal', sub: 'Natureza sem filtro', prompt: 'Pantanal, MS — 4 dias, ecoturismo e vida selvagem', x: 42, y: 52, pulse: true },
  { label: 'Rio', sub: 'A cidade maravilhosa', prompt: 'Rio de Janeiro, RJ — 5 dias, pontos turísticos e samba', x: 68, y: 60 },
  { label: 'Floripa', sub: 'A ilha da magia', prompt: 'Florianópolis, SC — 4 dias, praias e gastronomia', x: 60, y: 74 },
  { label: 'Gramado', sub: 'Europa no sul do Brasil', prompt: 'Gramado, RS — 3 dias, gastronomia e montanha', x: 52, y: 84 },
]

// Mapa SVG simplificado do contorno do Brasil
const BRAZIL_PATH = `
  M 50,2
  C 55,2 62,4 68,6
  C 74,8 80,10 84,14
  C 88,18 90,22 92,28
  C 94,32 95,36 94,40
  C 93,44 90,46 88,50
  C 86,54 85,58 86,62
  C 87,66 88,70 86,74
  C 84,78 80,80 76,82
  C 72,84 68,84 64,86
  C 60,88 56,90 52,90
  C 48,90 44,88 40,86
  C 36,84 32,80 28,76
  C 24,72 20,68 18,62
  C 16,56 16,50 18,44
  C 20,38 24,34 22,28
  C 20,22 16,18 18,12
  C 20,8 26,6 32,4
  C 38,2 44,2 50,2 Z
`

interface PinProps {
  dest: Destination
  index: number
  isInView: boolean
  onSelect: (prompt: string) => void
}

function Pin({ dest, index, isInView, onSelect }: PinProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        delay: 0.4 + index * 0.12,
        type: 'spring', stiffness: 260, damping: 18,
      }}
      style={{ originX: `${dest.x}%`, originY: `${dest.y}%`, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(dest.prompt)}
    >
      {/* Pulse ring */}
      {dest.pulse && (
        <circle
          cx={`${dest.x}%`} cy={`${dest.y}%`} r="12"
          fill="none" stroke="var(--color-yellow)" strokeWidth="1.5" opacity="0.4"
        >
          <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Sombra do pin */}
      <ellipse
        cx={`${dest.x}%`} cy={`${dest.y + 4}%`}
        rx="5" ry="2"
        fill="rgba(0,0,0,0.3)"
      />

      {/* Corpo do pin */}
      <circle
        cx={`${dest.x}%`} cy={`${dest.y}%`} r={hovered ? '9' : '7'}
        fill={hovered ? 'var(--color-yellow)' : 'var(--color-bg-card)'}
        stroke={hovered ? 'var(--color-yellow-soft)' : 'var(--color-yellow)'}
        strokeWidth={hovered ? '2' : '1.5'}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Ponto interno */}
      <circle
        cx={`${dest.x}%`} cy={`${dest.y}%`} r="2.5"
        fill={hovered ? '#fff' : 'var(--color-yellow)'}
        style={{ transition: 'fill 0.2s' }}
      />

      {/* Tooltip */}
      {hovered && (
        <g>
          {/* Fundo do tooltip */}
          <rect
            x={`${dest.x - 12}%`} y={`${dest.y - 14}%`}
            width="24%" height="10%"
            rx="4" ry="4"
            fill="var(--color-bg-card)"
            stroke="var(--color-yellow-border)"
            strokeWidth="1"
            filter="drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
          />
          <text
            x={`${dest.x}%`} y={`${dest.y - 10.5}%`}
            textAnchor="middle"
            fontSize="3.2"
            fontWeight="700"
            fill="var(--color-fg-primary)"
            fontFamily="var(--font-sans)"
          >
            {dest.label}
          </text>
          <text
            x={`${dest.x}%`} y={`${dest.y - 7.5}%`}
            textAnchor="middle"
            fontSize="2.6"
            fill="var(--color-fg-muted)"
            fontFamily="var(--font-sans)"
          >
            {dest.sub}
          </text>
        </g>
      )}
    </motion.g>
  )
}

interface AboutSectionProps {
  onDestinationSelect?: (prompt: string) => void
}

export function AboutSection({ onDestinationSelect }: AboutSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  function handleSelect(prompt: string) {
    onDestinationSelect?.(prompt)
  }

  return (
    <section className="py-24 md:py-32 overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" ref={ref}>

          {/* Coluna esquerda — texto */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-bold uppercase tracking-widest mb-4 block"
              style={{ color: 'var(--color-yellow)' }}>
              sobre o vambora
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-fg-primary)', lineHeight: 1.2, fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
              Um guia que conhece o Brasil de verdade.
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed"
              style={{ color: 'var(--color-fg-secondary)', maxWidth: '440px' }}>
              Não é uma lista genérica. É um roteiro feito pra você — com eventos reais,
              preços honestos e dicas que só quem foi sabe.
            </p>
            <p className="mt-4 text-sm leading-relaxed"
              style={{ color: 'var(--color-fg-muted)', maxWidth: '400px' }}>
              Clique em qualquer destino no mapa para gerar um guia completo na hora.
            </p>

            {/* Mini legenda */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-yellow)', boxShadow: '0 0 8px var(--color-yellow)' }} />
                <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>Destino popular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-yellow)' }} />
                <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>Clique para gerar guia</span>
              </div>
            </div>
          </motion.div>

          {/* Coluna direita — mapa SVG interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-bg-border)',
              boxShadow: 'var(--shadow-card)',
              aspectRatio: '1 / 1.05',
            }}
          >
            {/* Grid pontilhado de fundo */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, var(--color-bg-border) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              opacity: 0.6,
            }} />

            {/* Gradiente de borda interna */}
            <div className="absolute inset-0 rounded-3xl" style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, var(--color-bg-base) 100%)',
              pointerEvents: 'none',
            }} />

            {/* SVG do mapa */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-4"
              style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Contorno do Brasil */}
              <path
                d={BRAZIL_PATH}
                fill="var(--color-yellow-glow)"
                stroke="var(--color-yellow-border)"
                strokeWidth="0.8"
              />

              {/* Pins */}
              {DESTINATIONS.map((dest, i) => (
                <Pin
                  key={dest.label}
                  dest={dest}
                  index={i}
                  isInView={isInView}
                  onSelect={handleSelect}
                />
              ))}
            </svg>

            {/* Label Brasil */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-fg-muted)' }}>
                Brasil
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}