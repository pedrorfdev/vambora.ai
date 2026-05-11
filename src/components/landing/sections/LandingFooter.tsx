// ─────────────────────────────────────────────
// LandingFooter.tsx — Rodapé da landing
// ─────────────────────────────────────────────

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

export function LandingFooter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <footer
      ref={ref}
      className="py-16 px-8"
      style={{
        background: '#060606',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
        >
          {/* Logo */}
          <div>
            <h3
              className="text-serif text-2xl font-normal"
              style={{ color: '#F0EDE6' }}
            >
              vambora<span style={{ color: 'var(--color-yellow)' }}>.ai</span>
            </h3>
            <p
              className="text-sm mt-2"
              style={{ color: 'rgba(240,237,230,0.35)' }}
            >
              O guia inteligente para viajar pelo Brasil.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(240,237,230,0.3)' }}
              >
                Produto
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-left"
                style={{ color: 'rgba(240,237,230,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Gerar guia
              </button>
              <span
                className="text-sm"
                style={{ color: 'rgba(240,237,230,0.5)' }}
              >
                Destinos
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(240,237,230,0.3)' }}
              >
                Tecnologia
              </p>
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
                style={{ color: 'rgba(240,237,230,0.5)', textDecoration: 'none' }}
              >
                Gemini AI
              </a>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
                style={{ color: 'rgba(240,237,230,0.5)', textDecoration: 'none' }}
              >
                Unsplash
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(240,237,230,0.25)' }}
          >
            © 2025 vambora.ai · Feito com ☕ e 🇧🇷
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(240,237,230,0.25)' }}
          >
            powered by Gemini · imagens via Unsplash
          </p>
        </motion.div>
      </div>
    </footer>
  )
}