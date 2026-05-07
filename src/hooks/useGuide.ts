// ─────────────────────────────────────────────
// useGuide.ts — Hook principal do Vambora.ai
// ─────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react'
import { generateGuideStream } from '../lib/gemini'
import type { Guide, GuideStatus } from '../types/guide'

const LOADING_MESSAGES = [
  'Arrumando as malas...',
  'Consultando os locais...',
  'Abastecendo o tanque...',
  'Perguntando pro taxista...',
  'Checando o roteiro...',
  'Negociando com o hoteleiro...',
  'Provando a comida local...',
  'Verificando o clima...',
  'Achando as melhores praias...',
  'Escapando do trânsito...',
  'Carregando o mapa...',
  'Falando com os nativos...',
  'Testando a caipirinha local...',
  'Guardando o protetor solar...',
  'Descobrindo trilhas secretas...',
]

function getRandomMessage(exclude?: string): string {
  const filtered = LOADING_MESSAGES.filter(m => m !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

interface UseGuideReturn {
  status: GuideStatus
  guide: Guide | null
  error: string | null
  loadingMessage: string
  prompt: string
  setPrompt: (p: string) => void
  generate: () => Promise<void>
  reset: () => void
}

export function useGuide(): UseGuideReturn {
  const [status, setStatus] = useState<GuideStatus>('idle')
  const [guide, setGuide] = useState<Guide | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])

  const messageInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startMessageRotation = useCallback(() => {
    let current = getRandomMessage()
    setLoadingMessage(current)
    messageInterval.current = setInterval(() => {
      current = getRandomMessage(current)
      setLoadingMessage(current)
    }, 2200)
  }, [])

  const stopMessageRotation = useCallback(() => {
    if (messageInterval.current) {
      clearInterval(messageInterval.current)
      messageInterval.current = null
    }
  }, [])

  // Fix: lê prompt do estado, não de parâmetro
  const generate = useCallback(async () => {
    const text = prompt.trim()
    if (!text) return

    setStatus('loading')
    setError(null)
    setGuide(null)
    startMessageRotation()

    try {
      const result = await generateGuideStream(text)
      setGuide(result)
      setStatus('success')
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : 'Algo deu errado. Tenta de novo!'
      setError(message)
      setStatus('error')
    } finally {
      stopMessageRotation()
    }
  }, [prompt, startMessageRotation, stopMessageRotation])

  const reset = useCallback(() => {
    stopMessageRotation()
    setStatus('idle')
    setGuide(null)
    setError(null)
    setPrompt('')
    setLoadingMessage(LOADING_MESSAGES[0])
  }, [stopMessageRotation])

  return {
    status,
    guide,
    error,
    loadingMessage,
    prompt,
    setPrompt,
    generate,
    reset,
  }
}