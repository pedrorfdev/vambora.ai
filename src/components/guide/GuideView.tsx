import { CalendarDays, Cloud, CloudRain, CloudSun, Hotel, Info, Map, Menu, Sparkles, Sun, Utensils, Wallet, Wand2, Wind, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { getPexelsUrl, usePexelsImage } from '../../hooks/usePexelsImage'
import type { Guide } from '../../types/guide'
import { BookingExpanded, BudgetExpanded, EventsExpanded, RestaurantsExpanded } from './GuideCards'
import { RouteExpanded } from './RouteCard'

interface GuideViewProps {
  guide: Guide
  onReset: () => void
  onAdapt: (instruction: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
}

type PanelId = 'roteiro' | 'comer' | 'eventos' | 'gastos' | 'reservar' | null

const PANEL_CONFIG = {
  roteiro: { LucideIcon: Map, title: 'Roteiro', pexels: 'travel map road trip route', fallback: 'https://images.unsplash.com/photo-1506526620579-d5eb31b3ebec?w=400&q=75', color: '#5DADE2' },
  comer: { LucideIcon: Utensils, title: 'Onde comer', pexels: 'restaurant food table candle dinner', fallback: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=75', color: '#00A878' },
  eventos: { LucideIcon: CalendarDays, title: 'Eventos', pexels: 'concert festival stage lights crowd', fallback: 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?w=400&q=75', color: '#E8A020' },
  gastos: { LucideIcon: Wallet, title: 'Gastos', pexels: 'money coins wallet budget travel', fallback: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=75', color: '#9B59B6' },
  reservar: { LucideIcon: Hotel, title: 'Reservar', pexels: 'hotel lobby luxury room interior', fallback: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=75', color: '#E74C3C' },
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
    <div className="flex flex-col gap-3 px-4 py-4 rounded-2xl w-full"
      style={{ background: 'rgba(46,134,193,0.12)', border: '1px solid rgba(46,134,193,0.25)' }}>
      {/* Linha 1: ícone + temp + condição */}
      <div className="flex items-center gap-3">
        <WeatherIcon condicao={clima.condicao} size={38} />
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-none" style={{ fontSize: '1.6rem', color: '#fff' }}>
            {clima.temperatura_media}
          </p>
          <p className="text-[0.72rem] mt-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{clima.condicao}</p>
        </div>
      </div>
      {/* Divisor */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
      {/* Melhor época — texto completo, sem clamp */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(232,160,32,0.8)' }}>Melhor época</p>
        <p className="text-[0.72rem] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{clima.melhor_epoca}</p>
      </div>
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
  const [imgUrl, setImgUrl] = useState<string>(cfg.fallback)

  useEffect(() => {
    getPexelsUrl(cfg.pexels).then(url => {
      if (!url.startsWith('linear')) setImgUrl(url)
    })
  }, [cfg.pexels])

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
      className="w-full flex items-center gap-3 rounded-2xl text-left transition-all duration-200"
      style={{
        padding: '10px 12px',
        background: isActive ? 'var(--color-yellow-glow)' : hovered ? 'var(--color-bg-soft)' : 'transparent',
        border: isActive ? '1px solid var(--color-yellow-border)' : '1px solid transparent',
        minHeight: 56,
      }}
    >
      {/* Imagem sempre visível — lucide no hover */}
      <div className="relative w-11 h-11 rounded-xl shrink-0 overflow-hidden"
        style={{ border: `1px solid ${isActive ? 'var(--color-yellow-border)' : 'var(--color-bg-border)'}` }}
      >
        <img
          src={imgUrl}
          alt={cfg.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
          style={{ filter: hovered || isActive ? 'brightness(0.3) saturate(0.5)' : 'brightness(0.75) saturate(0.8)' }}
          loading="lazy"
        />
        <motion.div
          animate={{ opacity: (hovered || isActive) ? 1 : 0, scale: (hovered || isActive) ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <cfg.LucideIcon size={18} strokeWidth={1.8} color={isActive ? 'var(--color-yellow)' : '#fff'} />
        </motion.div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate"
          style={{ color: isActive ? 'var(--color-yellow)' : 'var(--color-fg-primary)' }}>
          {cfg.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>
          {preview}
        </p>
      </div>
    </motion.button>
  )
}

function Sidebar({ guide, activePanel, onPanelChange, onReset, onAdapt, isAdapting, adaptMessage, onOpenDica }: {
  guide: Guide
  activePanel: PanelId
  onPanelChange: (id: PanelId) => void
  onReset: () => void
  onAdapt: (v: string) => Promise<void>
  isAdapting: boolean
  adaptMessage: string
  onOpenDica: () => void
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
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-bg-border)',
      }}
    >
      <div className="shrink-0 px-4 pt-4 pb-3"
        style={{ borderBottom: '1px solid var(--color-bg-border)' }}>

        <div className="flex gap-2 mb-3">
          <button onClick={onReset}
            disabled={isAdapting}
            className="hidden sm:block flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 disabled:opacity-30"
            style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)', color: 'var(--color-fg-secondary)' }}
            onMouseEnter={e => { if (!isAdapting) { e.currentTarget.style.color = 'var(--color-fg-primary)'; e.currentTarget.style.borderColor = 'var(--color-yellow-border)' } }}
            onMouseLeave={e => { if (!isAdapting) { e.currentTarget.style.color = 'var(--color-fg-secondary)'; e.currentTarget.style.borderColor = 'var(--color-bg-border)' } }}
          >
            ← Nova busca
          </button>

          {/* Botão de Adaptar (Apenas Desktop) */}
          <button onClick={() => setAdaptOpen(v => !v)}
            disabled={isAdapting}
            className="hidden sm:block flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{
              background: isAdapting ? 'var(--color-yellow-glow)' : adaptOpen ? 'var(--color-yellow-glow)' : 'var(--color-bg-soft)',
              border: isAdapting ? '1px solid var(--color-yellow-border)' : adaptOpen ? '1px solid var(--color-yellow-border)' : '1px solid var(--color-bg-border)',
              color: isAdapting ? 'var(--color-yellow)' : adaptOpen ? 'var(--color-yellow)' : 'var(--color-fg-secondary)',
            }}
          >
            {isAdapting ? '✦ Adaptando...' : '✦ Adaptar'}
          </button>

          {/* Botão de Dica Golden (Apenas Mobile) */}
          <button onClick={onOpenDica}
            className="sm:hidden flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--color-yellow-glow)',
              border: '1px solid var(--color-yellow-border)',
              color: 'var(--color-yellow)',
            }}
          >
            ✦ Vai uma dica.ai?
          </button>
        </div>

        <AnimatePresence>
          {isAdapting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 px-3 py-2 rounded-xl"
              style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-yellow)' }} />
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-yellow)' }}>
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
              className="overflow-hidden hidden sm:block"
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
                  style={{ color: 'var(--color-fg-primary)', border: '1px solid var(--color-bg-border)', background: 'var(--color-bg-soft)', caretColor: 'var(--color-yellow)' }}
                />
                <button onClick={handleAdapt} disabled={!adaptValue.trim() || isAdapting}
                  className="btn-primary text-xs px-3 py-2 self-end disabled:opacity-30">
                  {isAdapting ? '...' : '→'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs mb-4" style={{ color: 'var(--color-fg-muted)' }}>
          Guia para{' '}
          <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>{guide.destino.nome}</span>
        </p>

        {/* Período / duração / viajantes — empilhados */}
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Período', value: `de ${periodo.data_inicio} até ${periodo.data_fim}` },
            { label: 'Duração', value: `${periodo.total_dias} dias` },
            { label: 'Viajantes', value: `${periodo.total_pessoas} pessoa${periodo.total_pessoas > 1 ? 's' : ''}` },
          ].map(row => (
            <div key={row.label}
              className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-bg-border)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {row.label}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-fg-primary)' }}>
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

      <div className="shrink-0 px-3 pb-4 pt-2" style={{ borderTop: '1px solid var(--color-bg-border)' }}>
        <ClimateWidget clima={guide.clima} />
      </div>
    </div>
  )
}

// Título do destino — centrado quando sem painel, compacto no topo-direita com painel ativo
function DestinationTitle({ destino, compact }: { destino: Guide['destino']; compact: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {compact ? (
        <motion.div
          key="compact"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 pt-2 pl-4"
        >
          <h1 style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)',
            fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.05,
            textShadow: '0 2px 24px rgba(0,0,0,0.9)',
          }}>
            {destino.nome}
          </h1>
          <p style={{
            fontSize: '0.82rem', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
            marginTop: '-0.1rem',
          }}>
            {destino.estado} · {destino.pais}
          </p>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            maxWidth: '340px',
          }}>
            {destino.descricao_curta}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function CenterPanel({ guide, activePanel, dicaModalOpen, setDicaModalOpen, setAdaptModalOpen }: { guide: Guide; activePanel: PanelId; dicaModalOpen: boolean; setDicaModalOpen: (v: boolean) => void; setAdaptModalOpen: (v: boolean) => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Conteúdo do painel ativo — scrollável */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence mode="wait">
          {activePanel === null ? (
            // Estado vazio: título centralizado ocupa o espaço central
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col items-center justify-center gap-3 px-4"
            >
              <h1 style={{
                fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                fontWeight: 800, color: '#fff',
                letterSpacing: '-0.04em', lineHeight: 1,
                textShadow: '0 4px 32px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.6)',
                textAlign: 'center',
              }}>
                {guide.destino.nome}
              </h1>
              <p style={{
                fontSize: '0.95rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.35)',
                textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                textAlign: 'center',
              }}>
                {guide.destino.estado} · {guide.destino.pais}
              </p>
              <motion.div
                className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full"
                animate={{ opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  alignSelf: 'center',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>←</span>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  selecione uma seção para explorar
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="px-3 py-4"
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

      {/* Dica — sempre visível no rodapé do painel central no desktop, botão flutuante no mobile */}
      <div className="hidden sm:block shrink-0 px-3 pb-3 pt-2" style={{ borderTop: activePanel ? '1px solid var(--color-bg-border)' : 'none' }}>
        <motion.div
          layout
          className="w-full flex items-start gap-3 p-3 rounded-2xl"
          style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}>
            <Sparkles size={14} color="var(--color-yellow)" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[0.6rem] font-bold uppercase tracking-widest block mb-0.5" style={{ color: 'var(--color-yellow)' }}>
              ✦ Vai uma dica.ai?
            </span>
            <p className="text-xs font-medium leading-relaxed"
              style={{ color: 'var(--color-fg-primary)' }}>
              {guide.dica_golden}
            </p>
            {guide.clima.dica && (
              <p className="mt-1.5 text-[0.7rem] leading-relaxed" style={{ color: 'var(--color-fg-secondary)', fontStyle: 'italic' }}>
                🌤 {guide.clima.dica}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Botão flutuante mobile de Adaptar */}
      <div className="sm:hidden fixed bottom-4 right-4 z-20">
        <button onClick={() => setAdaptModalOpen(true)} className="w-12 h-12 rounded-full flex items-center justify-center shadow-(--shadow-yellow) transition-transform hover:scale-105"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-yellow-border)' }}>
          <Wand2 size={20} color="var(--color-yellow)" />
        </button>
      </div>

      <AnimatePresence>
        {dicaModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDicaModalOpen(false)} className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm rounded-3xl p-5" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-yellow-border)', boxShadow: 'var(--shadow-yellow)' }}>
              <button onClick={() => setDicaModalOpen(false)} className="absolute top-4 right-4 p-1"><X size={20} color="var(--color-fg-muted)" /></button>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}>
                <Sparkles size={18} color="var(--color-yellow)" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-yellow)' }}>✦ Vai uma dica.ai?</span>
              <p className="text-sm font-medium leading-relaxed mb-3" style={{ color: 'var(--color-fg-primary)' }}>{guide.dica_golden}</p>
              {guide.clima.dica && <p className="text-xs leading-relaxed" style={{ color: 'var(--color-fg-secondary)', fontStyle: 'italic' }}>🌤 {guide.clima.dica}</p>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function GuideView({ guide, onReset, onAdapt, isAdapting, adaptMessage }: GuideViewProps) {
  const [activePanel, setActivePanel] = useState<PanelId>(null)
  const { url: bgUrl } = usePexelsImage(guide.destino.unsplash_query)
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [adaptModalOpen, setAdaptModalOpen] = useState(false)
  const [adaptValueMobile, setAdaptValueMobile] = useState('')
  const [dicaModalOpen, setDicaModalOpen] = useState(false)

  function handleAdaptMobile() {
    if (!adaptValueMobile.trim() || isAdapting) return
    onAdapt(adaptValueMobile.trim())
    setAdaptValueMobile('')
    setAdaptModalOpen(false)
  }

  useEffect(() => { setActivePanel(null) }, [guide])

  function handlePanelChange(id: PanelId) {
    setActivePanel(id)
    setLeftDrawerOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex flex-col overflow-y-auto lg:overflow-hidden"
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

      {/* Mobile Header */}
      <div className="relative lg:hidden flex items-center justify-between px-5 py-4 z-30" style={{ background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-bg-border)' }}>
        <button onClick={() => setLeftDrawerOpen(true)} className="p-2 rounded-xl bg-(--color-bg-soft) text-(--color-fg-primary) shadow-sm">
          <Menu size={20} />
        </button>
        <span className="font-bold text-(--color-fg-primary) text-sm tracking-wide truncate max-w-[180px]">{guide.destino.nome}</span>
        <button onClick={() => setRightDrawerOpen(true)} className="p-2 rounded-xl bg-(--color-bg-soft) text-(--color-fg-primary) shadow-sm">
          <Info size={20} />
        </button>
      </div>

      {/* Drawers Overlay */}
      <AnimatePresence>
        {(leftDrawerOpen || rightDrawerOpen) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setLeftDrawerOpen(false); setRightDrawerOpen(false) }}
            className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          />
        )}
      </AnimatePresence>

      {/* Grid — sidebar 340px | centro flex | direita 420px quando ativo, 0 quando idle */}
      <div className="relative flex-1 gap-4 p-4 min-h-0 guide-grid"
        style={{ '--grid-cols': activePanel ? '340px 1fr 420px' : '340px 1fr 0px' } as React.CSSProperties}>

        {/* Sidebar / Left Drawer */}
        <div className={`fixed inset-y-0 left-0 w-[320px] max-w-[85vw] p-4 lg:p-0 bg-(--color-bg-base) lg:bg-transparent z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:w-auto ${leftDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            guide={guide}
            activePanel={activePanel}
            onPanelChange={handlePanelChange}
            onReset={onReset}
            onAdapt={onAdapt}
            isAdapting={isAdapting}
            adaptMessage={adaptMessage}
            onOpenDica={() => setDicaModalOpen(true)}
          />
        </div>

        <CenterPanel guide={guide} activePanel={activePanel} dicaModalOpen={dicaModalOpen} setDicaModalOpen={setDicaModalOpen} setAdaptModalOpen={setAdaptModalOpen} />

        {/* Right Column / Right Drawer */}
        <div className={`fixed inset-y-0 right-0 w-[320px] max-w-[85vw] bg-(--color-bg-base) lg:bg-transparent z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:w-auto overflow-y-auto lg:overflow-visible lg:pt-16 ${rightDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="lg:hidden p-4 flex justify-end">
            <button onClick={() => setRightDrawerOpen(false)} className="p-2 rounded-lg bg-(--color-bg-soft)"><X size={20} color="var(--color-fg-primary)" /></button>
          </div>
          <DestinationTitle destino={guide.destino} compact={activePanel !== null} />
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center py-4 sm:py-2 gap-3 sm:gap-4">
        <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
          Guia gerado por IA · Confirme datas e preços
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
          style={{
            color: 'var(--color-fg-secondary)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-bg-border)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--color-yellow)'
            e.currentTarget.style.borderColor = 'var(--color-yellow-border)'
            e.currentTarget.style.background = 'var(--color-yellow-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--color-fg-secondary)'
            e.currentTarget.style.borderColor = 'var(--color-bg-border)'
            e.currentTarget.style.background = 'var(--color-bg-card)'
          }}
        >
          ✈ Nova viagem
        </button>
      </div>

      <AnimatePresence>
        {adaptModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdaptModalOpen(false)} className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.6)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm rounded-3xl p-5" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-yellow-border)', boxShadow: 'var(--shadow-yellow)' }}>
              <button onClick={() => setAdaptModalOpen(false)} className="absolute top-4 right-4 p-1"><X size={20} color="var(--color-fg-muted)" /></button>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-yellow-glow)', border: '1px solid var(--color-yellow-border)' }}>
                <Wand2 size={18} color="var(--color-yellow)" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-yellow)' }}>✦ Adaptar Roteiro</span>

              <textarea
                value={adaptValueMobile}
                onChange={e => setAdaptValueMobile(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdaptMobile() } }}
                placeholder="Ex: Troque os restaurantes caros..."
                rows={3}
                autoFocus
                className="w-full text-sm bg-transparent resize-none outline-none leading-relaxed p-3 rounded-xl mb-4"
                style={{ color: 'var(--color-fg-primary)', border: '1px solid var(--color-bg-border)', background: 'var(--color-bg-soft)', caretColor: 'var(--color-yellow)' }}
              />
              <button onClick={handleAdaptMobile} disabled={!adaptValueMobile.trim() || isAdapting}
                className="btn-primary w-full py-2.5 disabled:opacity-30">
                {isAdapting ? 'Adaptando...' : 'Adaptar Guia'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}