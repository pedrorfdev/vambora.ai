import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Guide } from '../../types/guide'
import { usePexelsImage } from '../../hooks/usePexelsImage'

interface GuideHeaderProps {
  guide: Guide
  onReset: () => void
  onAdapt: (instruction: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}

// ── Fontes dinâmicas ──
const DISPLAY_FONTS = [
  '"Anton", sans-serif',
  '"Cinzel", serif',
  '"Playfair Display", serif',
  '"Bebas Neue", sans-serif',
  'var(--font-sans)'
]

function getFontForCity(cityName: string) {
  // Hash simples para sempre retornar a mesma fonte para a mesma cidade
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return DISPLAY_FONTS[hash % DISPLAY_FONTS.length]
}

function WeatherWidget({ clima }: { clima: Guide['clima'] }) {
  const icon = clima.condicao.toLowerCase().includes('chuv') ? '🌧️'
    : clima.condicao.toLowerCase().includes('nublado') ? '☁️'
      : clima.condicao.toLowerCase().includes('parcial') ? '⛅'
        : '☀️'

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.35) 0%, rgba(30,58,138,0.65) 100%)',
        border: '1px solid rgba(96,165,250,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minWidth: 200,
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1, filter: 'grayscale(1) brightness(200%)' }}>
        {icon}
      </span>

      <div className="flex flex-col">
        <p style={{
          fontSize: '1.5rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(to bottom right, #FFFFFF, #93C5FD)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {clima.temperatura_media}
        </p>
        <p className="text-[0.7rem] font-medium mt-0.5" style={{ color: '#BFDBFE' }}>
          {clima.condicao}
        </p>
      </div>

      <div style={{ width: 1, height: 36, background: 'rgba(147,197,253,0.25)', margin: '0 4px' }} />

      <div>
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.15em]" style={{ color: '#93C5FD' }}>
          Época
        </p>
        <p className="text-[0.7rem] font-medium leading-tight" style={{ color: '#F8FAFC' }}>
          {clima.melhor_epoca}
        </p>
      </div>
    </div>
  )
}

function GlassBadge({ children, color = 'gold' }: { children: React.ReactNode; color?: 'gold' | 'blue' }) {
  const s = color === 'gold'
    ? { bg: 'rgba(232,184,75,0.15)', border: 'rgba(232,184,75,0.4)', text: '#FDE68A' }
    : { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.35)', text: '#BFDBFE' }

  return (
    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-base font-semibold shadow-lg"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text, backdropFilter: 'blur(12px)' }}>
      {children}
    </div>
  )
}

function DestaquesWidget({ destaques }: { destaques: string[] }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const expanded = isHovered || isFixed

  return (
    <div
      className="relative z-50 flex flex-col items-end group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsFixed(!isFixed)}
    >
      <div
        className="flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-xl"
        style={{
          background: expanded ? 'rgba(232,184,75,0.25)' : 'rgba(15,14,13,0.5)',
          border: expanded ? '1px solid rgba(232,184,75,0.5)' : '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          color: expanded ? '#FDE68A' : '#F2EEE8'
        }}
      >
        <span className="text-sm font-bold tracking-widest uppercase">
          Destaques
        </span>
        <span className="text-[0.6rem] transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 12, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute top-full right-0 flex flex-col gap-2.5 min-w-[240px]"
          >
            {destaques.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3 rounded-2xl text-right shadow-2xl"
                style={{
                  background: 'rgba(15,14,13,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <span className="text-sm font-medium leading-relaxed block" style={{ color: '#F1F5F9' }}>
                  <span style={{ color: 'var(--color-yellow)', marginRight: '6px' }}>✦</span>
                  {d}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function GuideHeader({ guide, onReset, onAdapt, isAdapting, adaptMessage }: GuideHeaderProps) {
  const { destino, periodo, clima, dica_golden } = guide
  const { url: bgUrl } = usePexelsImage(destino.unsplash_query)

  const [adaptOpen, setAdaptOpen] = useState(false)
  const [adaptValue, setAdaptValue] = useState('')

  function handleAdapt() {
    if (!adaptValue.trim() || isAdapting) return
    onAdapt(adaptValue.trim())
    setAdaptValue('')
    setAdaptOpen(false)
  }

  const titleFont = getFontForCity(destino.nome)

  return (
    <>
      {/* ── Seção Hero Full Screen ── */}
      <div className="relative min-h-dvh w-full flex flex-col overflow-hidden">

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {bgUrl && (
            <img
              src={bgUrl}
              alt={destino.nome}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.65) saturate(0.95)' }}
            />
          )}
          {!bgUrl && (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1c1a18 0%, #2a2320 100%)' }} />
          )}
          {/* Soft transition to background: goes to transparent instead of hard white base */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.1) 40%, rgba(0,0,0,0) 85%, var(--color-bg-base) 100%)',
          }} />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col flex-1 p-6 sm:p-8 md:p-12 w-full mx-auto" style={{ maxWidth: '1800px' }}>

          {/* Top Line: Nav & Destaques */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-4">
              {/* Nav & Adaptar Geral */}
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={onReset} className="btn-ghost flex items-center gap-2 text-sm text-white hover:bg-white/10 px-4 py-2" style={{ background: 'rgba(10,9,8,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px' }}>
                    ← Nova busca
                  </button>
                  <button
                    onClick={() => setAdaptOpen(!adaptOpen)}
                    className="btn-ghost flex items-center gap-2 text-sm hover:bg-white/10 px-4 py-2"
                    style={{ background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.3)', color: '#FDE68A', borderRadius: '999px' }}
                  >
                    ✦ Adaptar Guia
                  </button>
                  <span className="badge-gold hidden md:inline-flex">guia gerado</span>
                </div>

                {/* Input de Adaptação Geral */}
                <AnimatePresence>
                  {adaptOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="overflow-hidden w-full max-w-md"
                    >
                      <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-xl rounded-full border border-white/15 w-full">
                        <textarea
                          value={adaptValue}
                          onChange={e => setAdaptValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdapt() } }}
                          placeholder="Ex: Quero um roteiro mais luxuoso..."
                          rows={1}
                          className="flex-1 bg-transparent resize-none outline-none text-sm text-white px-5 py-2.5 placeholder:text-white/50"
                        />
                        <button
                          onClick={handleAdapt}
                          disabled={!adaptValue.trim() || isAdapting}
                          className="btn-primary text-xs px-5 py-2 disabled:opacity-30 shrink-0"
                        >
                          {isAdapting ? adaptMessage : 'Ir →'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Badges Stacked Vertically */}
              <div className="flex flex-col items-start gap-3 mt-4">
                <GlassBadge color="gold">📅 {periodo.data_inicio} → {periodo.data_fim}</GlassBadge>
                <GlassBadge color="blue">👥 {periodo.total_pessoas} pessoa{periodo.total_pessoas > 1 ? 's' : ''}</GlassBadge>
                <GlassBadge color="blue">🗓 {periodo.total_dias} dias</GlassBadge>
              </div>
            </div>

            {/* Destaques (Top Right) */}
            <DestaquesWidget destaques={destino.destaques} />
          </div>

          {/* Center Text */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 w-full mt-4">
            <span
              className="px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(96,165,250,0.4)',
                color: '#BFDBFE', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.85rem',
                backdropFilter: 'blur(8px)'
              }}>
              {destino.estado}
            </span>
            <h1 style={{
              fontFamily: titleFont,
              fontSize: 'clamp(4rem, 10vw, 7.5rem)',
              color: '#FFFFFF', fontWeight: titleFont.includes('sans') ? 900 : 700, lineHeight: 1,
              letterSpacing: titleFont.includes('sans') ? '-0.03em' : 'normal',
              textShadow: '0 16px 40px rgba(0,0,0,0.6)'
            }}>
              {destino.nome}
            </h1>
            <p style={{
              color: '#F8FAFC', fontSize: '1.25rem', lineHeight: 1.8,
              fontWeight: 400, maxWidth: '800px', margin: '0 auto',
              textShadow: '0 4px 16px rgba(0,0,0,0.8)'
            }}>
              {destino.descricao_curta}
            </p>
          </div>

          {/* Bottom Line: Weather and Scroll */}
          <div className="flex justify-between items-end w-full mt-auto relative h-40">
            {/* Spacer */}
            <div className="w-[180px] hidden md:block" />

            {/* Scroll Hint */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-2 pb-4">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>↓</motion.div>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Comece a explorar</span>
            </div>

            {/* Weather */}
            <div className="w-auto flex justify-end">
              <WeatherWidget clima={clima} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Seção Abaixo do Hero ── */}
      <div className="w-full max-w-[1800px] mx-auto mt-12 md:mt-16 px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative p-6 md:p-8 rounded-4xl overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left group"
          style={{
            background: 'linear-gradient(145deg, var(--color-bg-card) 0%, var(--color-bg-soft) 100%)',
            border: '1px solid var(--color-yellow-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Decorative Glows */}
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] transition-transform duration-700 group-hover:scale-125" style={{ background: 'var(--color-yellow)', opacity: 0.12 }} />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] transition-transform duration-700 group-hover:scale-125" style={{ background: 'var(--color-yellow)', opacity: 0.08 }} />

          <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shrink-0 relative z-10"
            style={{
              background: 'linear-gradient(135deg, var(--color-yellow) 0%, var(--color-yellow-dim) 100%)',
              color: '#161513',
              boxShadow: '0 8px 32px rgba(232,184,75,0.4), inset 0 2px 0 rgba(255,255,255,0.4)'
            }}>
            <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>💡</span>
          </div>

          <div className="relative z-10 flex-1">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] mb-3 block"
              style={{
                background: 'linear-gradient(135deg, var(--color-yellow) 0%, var(--color-yellow-dim) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
              Dica Golden
            </span>
            <p className="text-lg md:text-xl font-medium leading-relaxed"
              style={{ color: 'var(--color-fg-primary)' }}>
              {dica_golden}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}