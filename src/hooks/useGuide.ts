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

const ADAPT_MESSAGES = [
  'Ajustando o roteiro...',
  'Ouvindo seu feedback...',
  'Reorganizando as paradas...',
  'Consultando os mapas de novo...',
  'Refinando as dicas...',
  'Quase lá, adaptando tudo...',
  'Deixando do seu jeito...',
]

function getRandomMessage(list: string[], exclude?: string): string {
  const filtered = list.filter(m => m !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

const STREAM_TIMEOUT_MS = 60000

function withTimeout<T>(p: Promise<T>, ms = STREAM_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Tempo esgotado ao gerar a resposta da AI. Tenta novamente mais tarde.'))
    }, ms)

    p.then(res => {
      clearTimeout(timer)
      resolve(res)
    }).catch(err => {
      clearTimeout(timer)
      reject(err)
    })
  })
}

interface UseGuideReturn {
  status: GuideStatus
  guide: Guide | null
  error: string | null
  loadingMessage: string
  isAdapting: boolean
  prompt: string
  setPrompt: (p: string) => void
  generate: (p?: string) => Promise<void>
  adapt: (instruction: string) => Promise<void>
  reset: () => void
}

export function useGuide(): UseGuideReturn {
  const [status, setStatus] = useState<GuideStatus>('idle')
  const [guide, setGuide] = useState<Guide | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [isAdapting, setIsAdapting] = useState(false)

  const messageInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startMessageRotation = useCallback((list = LOADING_MESSAGES) => {
    let current = getRandomMessage(list)
    setLoadingMessage(current)
    messageInterval.current = setInterval(() => {
      current = getRandomMessage(list, current)
      setLoadingMessage(current)
    }, 2200)
  }, [])

  const stopMessageRotation = useCallback(() => {
    if (messageInterval.current) {
      clearInterval(messageInterval.current)
      messageInterval.current = null
    }
  }, [])

  // ── Geração inicial ───────────────────────────
  const generate = useCallback(async (overridePrompt?: string) => {
    const text = (overridePrompt ?? prompt).trim()
    if (!text) return

    setStatus('loading')
    setError(null)
    setGuide(null)
    startMessageRotation(LOADING_MESSAGES)

    try {
      const result = await withTimeout(generateGuideStream(text))
      setGuide(result)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo deu errado. Tenta de novo!')
      setStatus('error')
    } finally {
      stopMessageRotation()
    }
  }, [prompt, startMessageRotation, stopMessageRotation])

  // ── Adaptação do guia existente ───────────────
  // Manda o guia atual + instrução do usuário pro modelo
  // e substitui o guia pelo resultado. Não vai pra loading
  // screen — mostra um estado "adaptando" inline no GuideView.
  const adapt = useCallback(async (instruction: string) => {
    if (!guide || !instruction.trim()) return

    setIsAdapting(true)
    setError(null)
    startMessageRotation(ADAPT_MESSAGES)

    const adaptPrompt = `
Aqui está o guia atual que foi gerado:
${JSON.stringify(guide, null, 2)}

O usuário quer adaptar o roteiro com a seguinte instrução:
"${instruction}"

Gere um novo guia completo aplicando essa adaptação, mantendo o destino e período,
mas ajustando o que foi pedido. Retorne o JSON completo no mesmo formato.
`

    try {
      const result = await withTimeout(generateGuideStream(adaptPrompt))
      setGuide(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não consegui adaptar. Tenta de novo!')
    } finally {
      setIsAdapting(false)
      stopMessageRotation()
    }
  }, [guide, startMessageRotation, stopMessageRotation])

  const reset = useCallback(() => {
    stopMessageRotation()
    setStatus('idle')
    setGuide(null)
    setError(null)
    setPrompt('')
    setIsAdapting(false)
    setLoadingMessage(LOADING_MESSAGES[0])
  }, [stopMessageRotation])

  return {
    status,
    guide,
    error,
    loadingMessage,
    isAdapting,
    prompt,
    setPrompt,
    generate,
    adapt,
    reset,
  }
}