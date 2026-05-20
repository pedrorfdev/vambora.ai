import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { getPexelsUrl } from '../../../hooks/usePexelsImage'

interface HeroSectionProps {
  onSubmit: (prompt: string) => void
  error?: string | null
  theme: string
}

const FALLBACK_BG = 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2400&q=90'

const FAN_DESTINATIONS = [
  { label: 'Florianópolis', estado: 'SC', prompt: 'Florianópolis, SC — 4 dias, praias e gastronomia local', rot: -54, tx: -120, pexels: 'Florianopolis beach aerial view Santa Catarina Brazil' },
  { label: 'Chapada', estado: 'BA', prompt: 'Chapada Diamantina, BA — 6 dias, trilhas e cachoeiras', rot: -36, tx: -80, pexels: 'Chapada Diamantina waterfall aerial view Bahia Brazil' },
  { label: 'Salvador', estado: 'BA', prompt: 'Salvador, BA — 4 dias, cultura e gastronomia baiana', rot: -18, tx: -40, pexels: 'Salvador Bahia Pelourinho Brazil' },
  { label: 'Rio', estado: 'RJ', prompt: 'Rio de Janeiro, RJ — 5 dias, pontos turísticos e cultura carioca', rot: 0, tx: 0, pexels: 'Rio de Janeiro Cristo Redentor Brazil' },
  { label: 'Lençóis', estado: 'MA', prompt: 'Lençóis Maranhenses, MA — 4 dias, dunas e lagoas', rot: 18, tx: 40, pexels: 'Lencois Maranhenses dunes lagoons Brazil side view' },
  { label: 'Gramado', estado: 'RS', prompt: 'Gramado, RS — 3 dias, gastronomia e clima de montanha', rot: 36, tx: 80, pexels: 'Gramado Rio Grande do Sul Brazil' },
  { label: 'Pantanal', estado: 'MS', prompt: 'Pantanal, MS — 4 dias, ecoturismo e vida selvagem', rot: 54, tx: 120, pexels: 'Pantanal wetlands wildlife Brazil' },
]

const UNSPLASH_FALLBACKS: Record<string, string> = {
  'Florianópolis': 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300&q=80',
  'Chapada': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=300&q=80',
  'Salvador': 'https://images.unsplash.com/photo-1548963670-c94ea3d0e9ea?w=300&q=80',
  'Rio': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80',
  'Lençóis': 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=300&q=80',
  'Gramado': 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=300&q=80',
  'Pantanal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&q=80',
}

const ROTATING_WORDS = ['praias', 'trilhas', 'festivais', 'sabores', 'aventuras', 'histórias']
const QUICK_PROMPTS = ['Beto Carrero, 3 dias com crianças', 'Nordeste roots, 7 dias na praia', 'Serra gaúcha com frio, casal']

const HIT_W = 185
const HIT_H = 255

function FanCard({ dest, index, isVisible, onSelect, hoveredIndex, setHoveredIndex, imageUrl }: {
  dest: typeof FAN_DESTINATIONS[0]
  index: number
  isVisible: boolean
  onSelect: (p: string) => void
  hoveredIndex: number | null
  setHoveredIndex: Dispatch<SetStateAction<number | null>>
  imageUrl: string
}) {
  const isHovered = hoveredIndex === index
  const isOther = hoveredIndex !== null && hoveredIndex !== index
  const [hasOpened, setHasOpened] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setHasOpened(true), 1400)
      return () => clearTimeout(t)
    }
  }, [isVisible])

  const entryDelay = hasOpened ? 0 : index * 0.08

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: HIT_W, height: HIT_H,
        left: '50%', bottom: 0,
        marginLeft: -HIT_W / 2,
        transformOrigin: '50% 100%',
        zIndex: isHovered ? 50 : FAN_DESTINATIONS.length - Math.abs(index - 3),
      }}
      initial={{ rotate: dest.rot, x: dest.tx, y: 100, opacity: 0 }}
      animate={isVisible ? {
        rotate: dest.rot, x: dest.tx, y: 0,
        opacity: isOther ? 0 : 1,
        transition: {
          rotate: { duration: 0.8, delay: entryDelay, ease: [0.22, 1, 0.36, 1] },
          x: { duration: 0.8, delay: entryDelay, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.8, delay: entryDelay, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.3, delay: isOther ? 0 : entryDelay },
        },
      } : {}}
      onHoverStart={() => setHoveredIndex(index)}
      onHoverEnd={() => setHoveredIndex(prev => prev === index ? null : prev)}
      onClick={() => onSelect(dest.prompt)}
    >
      <motion.div
        className={`absolute rounded-xl overflow-hidden w-[150px] h-[200px] left-[17.5px] bottom-0 transition-all duration-200 pointer-events-none border ${isHovered ? 'border-yellow-border shadow-(--shadow-yellow)' : 'border-white/10 shadow-lg'}`}
        animate={{ y: isHovered ? -18 : 0, scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <img src={imageUrl} alt={dest.label} className="w-full h-full object-cover" loading="lazy" />
        <div className={`absolute inset-0 transition-all duration-200 bg-linear-to-t ${isHovered ? 'from-black/70 via-black/10 to-transparent' : 'from-black/50 to-transparent'}`} />
        <motion.div
          className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-yellow to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
          <p className={`font-semibold leading-tight text-[0.65rem] transition-colors duration-200 ${isHovered ? 'text-yellow' : 'text-white/90'}`}>
            {dest.label}
          </p>
          <p className="text-[0.55rem] text-white/45">{dest.estado}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection({ onSubmit, error, theme }: HeroSectionProps) {
  const isDark = theme !== 'light'
  const [prompt, setPrompt] = useState('')
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [fanVisible, setFanVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [wordIndex, setWordIndex] = useState(0)
  const [bgUrl, setBgUrl] = useState(FALLBACK_BG)
  const [fanUrls, setFanUrls] = useState<string[]>(
    FAN_DESTINATIONS.map(d => UNSPLASH_FALLBACKS[d.label] ?? FALLBACK_BG)
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Busca imagem de fundo via Pexels
  useEffect(() => {
    getPexelsUrl('Rio de Janeiro pão de açucar and beach aerial view Brazil').then(url => {
      if (!url.startsWith('linear')) setBgUrl(url)
    })
  }, [])

  // Busca imagens do leque via Pexels
  useEffect(() => {
    FAN_DESTINATIONS.forEach((dest, i) => {
      getPexelsUrl(dest.pexels).then(url => {
        if (!url.startsWith('linear')) {
          setFanUrls(prev => {
            const next = [...prev]
            next[i] = url
            return next
          })
        }
      })
    })
  }, [])

  useEffect(() => { const t = setTimeout(() => setFanVisible(true), 600); return () => clearTimeout(t) }, [])
  useEffect(() => { const t = setInterval(() => setWordIndex(i => (i + 1) % ROTATING_WORDS.length), 2400); return () => clearInterval(t) }, [])

  function handleSubmit(p?: string) {
    const text = p ?? prompt
    if (!text.trim()) return
    setIsCollapsing(true)
    setTimeout(() => onSubmit(text), 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgUrl} alt="Brasil" className={`w-full h-full object-cover transition-all duration-300 ${isDark ? 'brightness-[0.45] saturate-[0.8]' : 'brightness-[0.85] saturate-[1.00]'}`} />
        <div className={`absolute inset-0 transition-all duration-300 ${isDark ? 'bg-linear-to-b from-black/50 via-black/10 to-bg-base' : 'bg-linear-to-b from-[#f7faf8]/25 via-[#f7faf8]/0 to-bg-base'}`} />
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-10 px-4 sm:px-6 pt-24 sm:pt-0 text-center w-full z-10 pb-[240px]"
        animate={isCollapsing ? { opacity: 0, scale: 0.96, transition: { duration: 0.3, delay: 0.2 } } : { opacity: 1, scale: 1 }}
      >
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center gap-4">
          <img src="/vambora-logo-white.png" alt="logo" className="w-48 sm:w-60 md:w-64 h-auto object-contain" />
          <p className={`text-[clamp(0.95rem,2vw,1.15rem)] max-w-[440px] leading-relaxed font-light ${isDark ? 'text-white/50' : 'text-zinc-800/60'}`}>
            O Brasil é grande demais pra ficar parado.{' '}
            <AnimatePresence mode="wait">
              <motion.span key={wordIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-yellow font-medium inline-block">
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
            {' '}te esperam.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-xl">
          <div className="rounded-2xl overflow-hidden bg-(--color-bg-card) border border-(--color-bg-border) backdrop-blur-xl shadow-(--shadow-card)">
            <textarea ref={textareaRef} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={'Descreva sua viagem...\nEx: Floripa em maio, 4 dias, casal, R$2.000'} rows={3}
              className="w-full bg-transparent resize-none outline-none leading-relaxed px-6 pt-5 pb-3 placeholder:text-text-muted text-(--color-fg-primary) text-[0.9375rem] caret-yellow font-sans"
            />
            <div className="px-4 sm:px-6 pb-3 flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {QUICK_PROMPTS.map(ex => (
                <button key={ex} onClick={() => { setPrompt(ex); textareaRef.current?.focus() }}
                  className="text-xs px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full whitespace-normal sm:whitespace-nowrap text-left sm:text-center transition-all duration-200 bg-(--color-bg-soft) border border-(--color-bg-border) text-(--color-fg-secondary) hover:border-yellow-border hover:text-yellow hover:bg-yellow-glow"
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-5 pb-4 pt-1">
              <div>
                {error
                  ? <p className="text-xs font-medium text-red-400">{error}</p>
                  : <p className="hidden sm:block text-[0.68rem] text-(--color-fg-muted)">Enter para gerar · Shift+Enter nova linha</p>
                }
              </div>
              <button onClick={() => handleSubmit()} disabled={!prompt.trim()} className="btn-primary disabled:opacity-25 disabled:cursor-not-allowed py-[0.55rem] px-[1.2rem] text-[0.875rem]">
                Vambora →
              </button>
            </div>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-3 text-center text-[0.68rem] tracking-wider dark:text-white/30 text-zinc-500/50">
            ou escolha um queridinho abaixo 👇
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className={`absolute bottom-0 left-0 right-0 flex justify-center origin-bottom scale-[0.6] sm:scale-100 h-[220px] z-20 ${isCollapsing ? 'pointer-events-none' : 'pointer-events-auto'}`}
        animate={isCollapsing ? { opacity: 0, y: 30, transition: { duration: 0.25 } } : { opacity: 1, y: 0 }}
      >
        {FAN_DESTINATIONS.map((dest, i) => (
          <FanCard key={dest.label} dest={dest} index={i} isVisible={fanVisible}
            onSelect={handleSubmit} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex}
            imageUrl={fanUrls[i]}
          />
        ))}
      </motion.div>

      <motion.div className="absolute right-6 bottom-6 flex flex-col items-center gap-2 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-white/20 dark:text-white/20 text-xs">↓</motion.div>
        <span className="text-[0.6rem] tracking-[0.14em] uppercase [writing-mode:vertical-rl] text-white/20 dark:text-white/20">explorar</span>
      </motion.div>
    </section>
  )
}