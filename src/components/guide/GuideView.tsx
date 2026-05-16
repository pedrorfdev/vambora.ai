import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sun, Cloud, CloudRain, CloudSun, Wind } from 'lucide-react'
import type { Guide } from '../../types/guide'
import { RouteExpanded } from './RouteCard'
import { RestaurantsExpanded, EventsExpanded, BudgetExpanded, BookingExpanded } from './GuideCards'
import { usePexelsImage } from '../../hooks/usePexelsImage'

interface GuideViewProps {
  guide: Guide
  onReset: () => void
  onAdapt: (instruction: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}

type PanelId = 'roteiro' | 'comer' | 'eventos' | 'gastos' | 'reservar' | null

const PANEL_CONFIG = {
  roteiro: { icon: '🗺', title: 'Roteiro', image: 'https://images.unsplash.com/photo-1506526620579-d5eb31b3ebec?w=120&q=75', color: '#5DADE2' },
  comer: { icon: '🍽', title: 'Onde comer', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&q=75', color: '#00A878' },
  eventos: { icon: '🎭', title: 'Eventos', image: 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?w=120&q=75', color: '#E8A020' },
  gastos: { icon: '💸', title: 'Gastos', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&q=75', color: '#9B59B6' },
  reservar: { icon: '🏨', title: 'Reservar', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=120&q=75', color: '#E74C3C' },
} as const

function WeatherIcon({ condicao, size = 40 }: { condicao: string; size?: number }) {
  const c = condicao.toLowerCase()
  const p = { size, strokeWidth: 1.2 }
  if (c.includes('chuv')) return <CloudRain  {...p} style={{ color: '#5DADE2' }} />
  if (c.includes('nublado')) return <Cloud      {...p} style={{ color: '#96A09A' }} />
  if (c.includes('parcial')) return <CloudSun   {...p} style={{ color: '#E8A020' }} />
  if (c.includes('vento')) return <Wind       {...p} style={{ color: '#96A09A' }} />
  return <Sun        {...p} style={{ color: '#E8A020' }} />
}

function ClimateWidget({ clima }: { clima: Guide['clima'] }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 rounded-2xl w-full"
      style={{ background: 'rgba(46,134,193,0.1)', border: '1px solid rgba(46,134,193,0.2)' }}>
      <div className="flex items-center gap-4">
        <WeatherIcon condicao={clima.condicao} size={44} />
        <div>
          <p className="font-bold leading-none" style={{ fontSize: '2rem', color: '#fff' }}>
            {clima.temperatura_media}
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{clima.condicao}</p>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(232,160,32,0.8)' }}>
          Melhor época
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{clima.melhor_epoca}</p>
      </div>
      {clima.dica && (
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
          {clima.dica}
        </p>
      )}
    </div>
  )
}

function SidebarBlock({ id, guide, isActive, onClick }: {
  id: keyof typeof PANEL_CONFIG
  guide: Guide
  isActive: boolean
  onClick: () => void
}) {
  const cfg = PANEL_CONFIG[id]
  const [hovered, setHovered] = useState(false)

  const preview = {
    roteiro: `${guide.roteiro.length} dias`,
    comer: `${guide.restaurantes.length} restaurantes`,
    eventos: guide.eventos.length > 0 ? `${guide.eventos.length} eventos` : 'Consultar',
    gastos: guide.orcamento.total_geral,
    reservar: 'Booking · Airbnb · Voos',
  }[id]

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-3 rounded-2xl text-left overflow-hidden transition-all duration-200"
      style={{
        padding: '10px 12px',
        background: isActive ? 'rgba(0,168,120,0.12)' : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: isActive ? '1px solid rgba(0,168,120,0.3)' : '1px solid transparent',
        minHeight: 56,
      }}
    >
      <span className="text-lg flex-shrink-0 w-6 text-center">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate"
          style={{ color: isActive ? 'var(--color-yellow)' : '#fff' }}>
          {cfg.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {preview}
        </p>
      </div>
      <motion.div
        animate={{ opacity: (isActive || hovered) ? 1 : 0, scale: (isActive || hovered) ? 1 : 0.85 }}
        transition={{ duration: 0.2 }}
        className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden"
        style={{ border: `1px solid ${isActive ? 'rgba(0,168,120,0.4)' : 'rgba(255,255,255,0.1)'}` }}
      >
        <img src={cfg.image} alt={cfg.title} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    </motion.button>
  )
}

function Sidebar({ guide, activePanel, onPanelChange, onReset, onAdapt, isAdapting, adaptMessage }: {
  guide: Guide
  activePanel: PanelId
  onPanelChange: (id: PanelId) => void
  onReset: () => void
  onAdapt: (v: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}) {
  const [adaptOpen, setAdaptOpen] = useState(false)
  const [adaptValue, setAdaptValue] = useState('')
  const { periodo } = guide

  function handleAdapt() {
    if (!adaptValue.trim() || isAdapting) return
    onAdapt(adaptValue.trim())
    setAdaptValue('')
    setAdaptOpen(false)
  }

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,15,14,0.96)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex-shrink-0 px-4 pt-4 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        <div className="flex gap-2 mb-3">
          <button onClick={onReset}
            disabled={isAdapting}
            className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { if (!isAdapting) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-yellow-border)' } }}
            onMouseLeave={e => { if (!isAdapting) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}
          >
            ← Nova busca
          </button>
          <button onClick={() => setAdaptOpen(v => !v)}
            disabled={isAdapting}
            className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{
              background: isAdapting ? 'rgba(0,168,120,0.1)' : adaptOpen ? 'var(--color-yellow-glow)' : 'rgba(255,255,255,0.06)',
              border: isAdapting ? '1px solid rgba(0,168,120,0.3)' : adaptOpen ? '1px solid var(--color-yellow-border)' : '1px solid rgba(255,255,255,0.08)',
              color: isAdapting ? 'var(--color-yellow)' : adaptOpen ? 'var(--color-yellow)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {isAdapting ? '✦ Adaptando...' : '✦ Adaptar'}
          </button>
        </div>

        <AnimatePresence>
          {isAdapting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(0,168,120,0.05)', border: '1px solid rgba(0,168,120,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                  {adaptMessage}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {adaptOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mb-3">
                <textarea
                  value={adaptValue}
                  onChange={e => setAdaptValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdapt() } }}
                  placeholder="O que mudar no guia..."
                  rows={2}
                  autoFocus
                  className="flex-1 text-xs bg-transparent resize-none outline-none leading-relaxed p-2.5 rounded-xl"
                  style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', caretColor: 'var(--color-yellow)' }}
                />
                <button onClick={handleAdapt} disabled={!adaptValue.trim() || isAdapting}
                  className="btn-primary text-xs px-3 py-2 self-end disabled:opacity-30">
                  {isAdapting ? '...' : '→'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Guia para{' '}
          <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>{guide.destino.nome}</span>
        </p>

        {/* Período / duração / viajantes — empilhados */}
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Período', value: `${periodo.data_inicio} → ${periodo.data_fim}` },
            { label: 'Duração', value: `${periodo.total_dias} dias` },
            { label: 'Viajantes', value: `${periodo.total_pessoas} pessoa${periodo.total_pessoas > 1 ? 's' : ''}` },
          ].map(row => (
            <div key={row.label}
              className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {row.label}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1" style={{ scrollbarWidth: 'none' }}>
        {(Object.keys(PANEL_CONFIG) as Array<keyof typeof PANEL_CONFIG>).map(id => (
          <SidebarBlock key={id} id={id} guide={guide} isActive={activePanel === id}
            onClick={() => onPanelChange(activePanel === id ? null : id)} />
        ))}
      </div>

      <div className="flex-shrink-0 px-3 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <ClimateWidget clima={guide.clima} />
      </div>
    </div>
  )
}

// Card direito — flutuante, sem fundo, mais largo
function DestinationCard({ destino }: { destino: Guide['destino'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 pt-2 pl-4"
    >
      <div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
          fontWeight: 800, color: '#fff',
          letterSpacing: '-0.03em', lineHeight: 1.05,
          textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)',
        }}>
          {destino.nome}
        </h1>
        <p style={{
          fontSize: '1rem', fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
          marginTop: '0.3rem',
          textShadow: '0 1px 8px rgba(0,0,0,0.7)',
        }}>
          {destino.estado} · {destino.pais}
        </p>
      </div>

      <p style={{
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.7,
        maxWidth: '260px',
        textShadow: '0 1px 8px rgba(0,0,0,0.7)',
      }}>
        {destino.descricao_curta}
      </p>
    </motion.div>
  )
}

function CenterPanel({ guide, activePanel }: { guide: Guide; activePanel: PanelId }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <AnimatePresence mode="wait">
        {activePanel === null ? (
          <motion.div
            key="dica"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="h-full flex flex-col items-center justify-center px-8 py-12 text-center min-h-[400px]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl"
              style={{ background: 'rgba(0,168,120,0.15)', border: '1px solid rgba(0,168,120,0.3)', boxShadow: '0 0 32px rgba(0,168,120,0.15)' }}
            >
              🌟
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-yellow)' }}>
              ✦ Dica Local
            </span>
            <p className="text-lg font-medium leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
              {guide.dica_golden}
            </p>
            <motion.p
              className="mt-10 text-xs"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              ← selecione uma seção para explorar
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-5"
          >
            {activePanel === 'roteiro' && <RouteExpanded guide={guide} />}
            {activePanel === 'comer' && <RestaurantsExpanded guide={guide} />}
            {activePanel === 'eventos' && <EventsExpanded guide={guide} />}
            {activePanel === 'gastos' && <BudgetExpanded guide={guide} />}
            {activePanel === 'reservar' && <BookingExpanded guide={guide} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function GuideView({ guide, onReset, onAdapt, isAdapting, adaptMessage }: GuideViewProps) {
  const [activePanel, setActivePanel] = useState<PanelId>(null)
  const { url: bgUrl } = usePexelsImage(guide.destino.unsplash_query)

  useEffect(() => { setActivePanel(null) }, [guide])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex flex-col overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {bgUrl && (
          <img src={bgUrl} alt={guide.destino.nome}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(0.7)' }} />
        )}
        {!bgUrl && (
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0d0f0e 0%, #1a1d1b 100%)' }} />
        )}
      </div>

      {/* Grid — sidebar 360px | centro flex | direita 300px */}
      <div className="relative flex-1 grid gap-3 p-4 min-h-0"
        style={{ gridTemplateColumns: '360px 1fr 300px' }}>

        <Sidebar
          guide={guide}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          onReset={onReset}
          onAdapt={onAdapt}
          isAdapting={isAdapting}
          adaptMessage={adaptMessage}
        />

        <CenterPanel guide={guide} activePanel={activePanel} />

        <DestinationCard destino={guide.destino} />
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-center py-2 gap-4">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Guia gerado por IA · Confirme datas e preços
        </p>
        <button onClick={onReset}
          className="text-xs font-semibold transition-all"
          style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-yellow)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
        >
          ✈ Nova viagem
        </button>
      </div>
    </motion.div>
  )
}