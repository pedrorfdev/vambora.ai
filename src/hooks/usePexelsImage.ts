// ─────────────────────────────────────────────
// usePexelsImage.ts
// Busca uma imagem no Pexels pela query.
// Cache em memória pra não repetir chamadas.
// Fallback: Unsplash estático se Pexels falhar.
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react'

const cache = new Map<string, string>()

// Fallback Unsplash por query — usado quando Pexels não retorna nada
const UNSPLASH_FALLBACKS: Record<string, string> = {
  'travel map route': 'https://images.unsplash.com/photo-1506526620579-d5eb31b3ebec?w=400&q=75',
  'restaurant food table': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=75',
  'concert festival crowd': 'https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?w=400&q=75',
  'money wallet budget': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=75',
  'hotel lobby luxury': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=75',
  'luxury hotel room interior': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=75',
  'cozy apartment living room': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=75',
  'airplane window sky clouds': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=75',
  'travel airport departure': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=75',
}

// Gradiente fallback final — se tudo falhar
const GRADIENT_FALLBACK = 'linear-gradient(135deg, #1a1815 0%, #2a2320 50%, #1a1815 100%)'

async function fetchPexels(query: string): Promise<string> {
  if (cache.has(query)) return cache.get(query)!

  const key = import.meta.env.VITE_PEXELS_KEY
  if (!key) throw new Error('VITE_PEXELS_KEY não encontrada')

  // Evitar fotos com pessoas: keywords garantidas para paisagens limpas
  const finalQuery = `${query} landscape nature empty scenery no people`

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(finalQuery)}&per_page=3&orientation=landscape`,
    { headers: { Authorization: key } }
  )

  if (!res.ok) throw new Error(`Pexels error: ${res.status}`)

  const data = await res.json()
  const photo = data.photos?.[0]
  if (!photo) throw new Error('Nenhuma foto encontrada')

  // landscape grande — ideal pra hero
  const url = photo.src.large2x ?? photo.src.large ?? photo.src.original
  cache.set(query, url)
  return url
}

interface UsePexelsImageResult {
  url: string | null
  loading: boolean
  error: boolean
}

export function usePexelsImage(query: string): UsePexelsImageResult {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError(false)

    fetchPexels(query)
      .then(u => { setUrl(u); setLoading(false) })
      .catch(() => {
        // Tenta Unsplash como segundo fallback
        const unsplash = UNSPLASH_FALLBACKS[query]
        if (unsplash) { setUrl(unsplash); setLoading(false) }
        else { setError(true); setLoading(false) }
      })
  }, [query])

  return { url, loading, error }
}

// Utilitário pra imagens estáticas (leque, seções, sidebar)
// Retorna URL do Pexels, Unsplash como fallback ou gradiente final
export async function getPexelsUrl(query: string): Promise<string> {
  try {
    return await fetchPexels(query)
  } catch {
    // Fallback 1: Unsplash mapeado
    const unsplash = UNSPLASH_FALLBACKS[query]
    if (unsplash) return unsplash
    // Fallback 2: gradiente
    return GRADIENT_FALLBACK
  }
}

export { GRADIENT_FALLBACK as FALLBACK }
