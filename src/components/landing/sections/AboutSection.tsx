import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface Destination {
  label: string
  sub: string
  prompt: string
  x: number  // 0-100 dentro do viewBox do mapa
  y: number
  pulse?: boolean
}

// Posições calibradas pro mapa flat abaixo
const DESTINATIONS: Destination[] = [
  { label: 'Amazônia', sub: 'O pulmão do mundo', prompt: 'Amazônia, AM — 5 dias, ecoturismo e floresta', x: 22, y: 24, pulse: true },
  { label: 'Fortaleza', sub: 'Praias e dunas do Ceará', prompt: 'Fortaleza, CE — 4 dias, praias e jangadas', x: 71, y: 16 },
  { label: 'Salvador', sub: 'Berço da cultura baiana', prompt: 'Salvador, BA — 4 dias, cultura e gastronomia baiana', x: 75, y: 42 },
  { label: 'Brasília', sub: 'A capital moderna', prompt: 'Brasília, DF — 3 dias, arquitetura e política', x: 54, y: 46 },
  { label: 'Pantanal', sub: 'Natureza sem filtro', prompt: 'Pantanal, MS — 4 dias, ecoturismo e vida selvagem', x: 40, y: 56, pulse: true },
  { label: 'Rio', sub: 'A cidade maravilhosa', prompt: 'Rio de Janeiro, RJ — 5 dias, pontos turísticos e samba', x: 67, y: 64 },
  { label: 'Floripa', sub: 'A ilha da magia', prompt: 'Florianópolis, SC — 4 dias, praias e gastronomia', x: 60, y: 76 },
  { label: 'Gramado', sub: 'Europa no sul do Brasil', prompt: 'Gramado, RS — 3 dias, gastronomia e montanha', x: 51, y: 86 },
]

// ── SVG do mapa flat ──────────────────────────
// Estilo inspirado em Google Maps / flat design
// viewBox: 0 0 400 440
function MapSVG({ destinations, isInView, onSelect }: {
  destinations: Destination[]
  isInView: boolean
  onSelect: (prompt: string) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <svg
      viewBox="0 0 400 440"
      className="w-full h-full"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* ── Fundo base do mapa ── */}
      <rect width="400" height="440" fill="var(--color-bg-soft)" rx="0" />

      {/* ── Áreas verdes (parques, vegetação) ── */}
      <ellipse cx="60" cy="80" rx="40" ry="28" fill="rgba(0,168,120,0.12)" />
      <ellipse cx="320" cy="60" rx="30" ry="22" fill="rgba(0,168,120,0.1)" />
      <ellipse cx="280" cy="200" rx="25" ry="18" fill="rgba(0,168,120,0.1)" />
      <ellipse cx="80" cy="300" rx="35" ry="24" fill="rgba(0,168,120,0.1)" />
      <ellipse cx="350" cy="360" rx="28" ry="20" fill="rgba(0,168,120,0.1)" />
      <ellipse cx="160" cy="380" rx="22" ry="16" fill="rgba(0,168,120,0.1)" />

      {/* ── Rios / corpos d'água ── */}
      {/* Rio principal — diagonal */}
      <path
        d="M 20,180 Q 80,160 120,200 Q 160,240 200,220 Q 240,200 280,240 Q 320,280 380,300"
        fill="none" stroke="rgba(46,134,193,0.35)" strokeWidth="6" strokeLinecap="round"
      />
      {/* Rio secundário */}
      <path
        d="M 0,320 Q 60,310 100,340 Q 140,370 180,360 Q 220,350 260,380 Q 300,410 380,420"
        fill="none" stroke="rgba(46,134,193,0.25)" strokeWidth="4" strokeLinecap="round"
      />
      {/* Rio pequeno */}
      <path
        d="M 200,0 Q 210,60 195,120 Q 180,180 200,220"
        fill="none" stroke="rgba(46,134,193,0.2)" strokeWidth="3" strokeLinecap="round"
      />

      {/* ── Malha de ruas — horizontais ── */}
      {[60, 100, 140, 180, 220, 260, 300, 340, 380].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y}
          stroke="var(--color-bg-border)" strokeWidth="0.8" opacity="0.6" />
      ))}
      {/* ── Malha de ruas — verticais ── */}
      {[50, 100, 150, 200, 250, 300, 350].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="440"
          stroke="var(--color-bg-border)" strokeWidth="0.8" opacity="0.6" />
      ))}

      {/* ── Avenidas principais — mais largas e mais visiveis ── */}
      <line x1="0" y1="220" x2="400" y2="220" stroke="var(--color-bg-border)" strokeWidth="2" opacity="0.9" />
      <line x1="200" y1="0" x2="200" y2="440" stroke="var(--color-bg-border)" strokeWidth="2" opacity="0.9" />
      {/* Diagonal */}
      <line x1="0" y1="0" x2="400" y2="440" stroke="var(--color-bg-border)" strokeWidth="1.5" opacity="0.5" />
      <line x1="400" y1="0" x2="0" y2="440" stroke="var(--color-bg-border)" strokeWidth="1.5" opacity="0.4" />

      {/* ── Quarteirões (blocos de construção) ── */}
      {[
        [10, 10, 80, 40], [110, 10, 80, 40], [210, 10, 80, 40], [310, 10, 70, 40],
        [10, 60, 60, 30], [130, 60, 60, 30], [250, 60, 60, 30], [330, 60, 60, 30],
        [10, 110, 70, 50], [100, 110, 50, 50], [170, 110, 50, 20], [240, 110, 70, 50], [330, 110, 60, 50],
        [10, 170, 50, 30], [260, 170, 60, 30], [340, 170, 50, 30],
        [10, 230, 80, 50], [110, 230, 50, 50], [260, 230, 60, 50], [340, 230, 50, 50],
        [10, 300, 70, 30], [100, 300, 60, 30], [180, 300, 40, 30], [260, 300, 70, 30], [350, 300, 40, 30],
        [10, 350, 80, 50], [110, 350, 60, 50], [220, 350, 50, 50], [310, 350, 80, 50],
        [10, 410, 80, 25], [110, 410, 60, 25], [200, 410, 80, 25], [310, 410, 80, 25],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h}
          fill="var(--color-bg-card)"
          stroke="var(--color-bg-border)" strokeWidth="0.5"
          rx="2" opacity="0.7"
        />
      ))}

      {/* ── Pins dos destinos ── */}
      {destinations.map((dest, i) => {
        const cx = (dest.x / 100) * 400
        const cy = (dest.y / 100) * 440
        const isHov = hovered === dest.label

        return (
          <motion.g
            key={dest.label}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'pointer' }}
            onMouseEnter={() => setHovered(dest.label)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(dest.prompt)}
          >
            {/* Pulse ring nos destinos especiais */}
            {dest.pulse && (
              <circle cx={cx} cy={cy} r="14" fill="none" stroke="var(--color-yellow)" strokeWidth="1.5">
                <animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Sombra */}
            <ellipse cx={cx} cy={cy + 14} rx="6" ry="2.5" fill="rgba(0,0,0,0.25)" />

            {/* Corpo do pin — formato teardrop */}
            <path
              d={`M ${cx},${cy - 14} 
                  C ${cx - 8},${cy - 14} ${cx - 8},${cy - 6} ${cx},${cy + 2}
                  C ${cx + 8},${cy - 6} ${cx + 8},${cy - 14} ${cx},${cy - 14} Z`}
              fill={isHov ? 'var(--color-yellow-soft)' : 'var(--color-yellow)'}
              style={{ transition: 'fill 0.2s, filter 0.2s', filter: isHov ? 'drop-shadow(0 0 6px var(--color-yellow))' : 'none' }}
            />
            {/* Círculo interno do pin */}
            <circle cx={cx} cy={cy - 9} r="3.5"
              fill={isHov ? '#fff' : 'rgba(13,15,14,0.7)'}
              style={{ transition: 'fill 0.2s' }}
            />

            {/* Tooltip HTML-like via foreignObject — mais flexível */}
            {isHov && (
              <g>
                <rect
                  x={cx > 300 ? cx - 130 : cx - 10}
                  y={cy - 52}
                  width="120" height="36"
                  rx="8" fill="var(--color-bg-card)"
                  stroke="var(--color-yellow-border)" strokeWidth="1"
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
                />
                {/* Seta do tooltip */}
                <polygon
                  points={`${cx > 300 ? cx - 30 : cx + 10},${cy - 16} ${cx > 300 ? cx - 24 : cx + 16},${cy - 16} ${cx > 300 ? cx - 27 : cx + 13},${cy - 20}`}
                  fill="var(--color-bg-card)"
                />
                <text
                  x={cx > 300 ? cx - 70 : cx + 50}
                  y={cy - 38}
                  textAnchor="middle" fontSize="9" fontWeight="700"
                  fill="var(--color-fg-primary)"
                >
                  {dest.label}
                </text>
                <text
                  x={cx > 300 ? cx - 70 : cx + 50}
                  y={cy - 26}
                  textAnchor="middle" fontSize="7.5"
                  fill="var(--color-fg-muted)"
                >
                  {dest.sub}
                </text>
              </g>
            )}
          </motion.g>
        )
      })}

      {/* Bússola decorativa */}
      <g transform="translate(368, 20)" opacity="0.4">
        <circle cx="0" cy="0" r="12" fill="none" stroke="var(--color-bg-border)" strokeWidth="1" />
        <text x="0" y="-5" textAnchor="middle" fontSize="5" fill="var(--color-fg-muted)" fontWeight="700">N</text>
        <line x1="0" y1="-10" x2="0" y2="10" stroke="var(--color-bg-border)" strokeWidth="0.8" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="var(--color-bg-border)" strokeWidth="0.8" />
        <polygon points="0,-8 2,-2 0,0 -2,-2" fill="var(--color-yellow)" opacity="0.8" />
      </g>
    </svg>
  )
}

interface AboutSectionProps {
  onDestinationSelect?: (prompt: string) => void
}

export function AboutSection({ onDestinationSelect }: AboutSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

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
              color: 'var(--color-fg-primary)', lineHeight: 1.2,
              fontWeight: 800, letterSpacing: '-0.02em',
            }}>
              Um guia que conhece o Brasil de verdade.
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed"
              style={{ color: 'var(--color-fg-secondary)', maxWidth: '440px' }}>
              Não é uma lista genérica. É um roteiro feito pra você — com eventos reais,
              preços honestos e dicas que só quem foi sabe.
            </p>
            <p className="mt-4 text-sm leading-relaxed"
              style={{ color: 'var(--color-fg-muted)', maxWidth: '380px' }}>
              Clique em qualquer destino no mapa para gerar um guia completo na hora.
            </p>

            {/* Legenda */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: 'var(--color-yellow)', boxShadow: '0 0 8px var(--color-yellow)' }} />
                <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                  Destino popular — clique para gerar o guia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(0,168,120,0.3)', border: '1px solid var(--color-yellow)' }} />
                <span className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                  Destino animado — mais visitado
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: '27', label: 'estados', suffix: '' },
                { value: '30', label: 'segundos', suffix: 's' },
                { value: '100', label: 'gratuito', suffix: '%' },
              ].map(s => (
                <div key={s.label} className="flex flex-col gap-1 p-4 rounded-2xl"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)' }}>
                  <p className="text-2xl font-bold"
                    style={{ color: 'var(--color-yellow)', lineHeight: 1 }}>
                    {s.value}<span style={{ fontSize: '0.7em', opacity: 0.6 }}>{s.suffix}</span>
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Coluna direita — mapa flat interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-bg-border)',
              boxShadow: 'var(--shadow-card)',
              aspectRatio: '400 / 440',
            }}
          >
            <MapSVG
              destinations={DESTINATIONS}
              isInView={isInView}
              onSelect={p => onDestinationSelect?.(p)}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}