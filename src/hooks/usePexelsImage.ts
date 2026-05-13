// ─────────────────────────────────────────────
// usePexelsImage.ts
// Busca uma imagem no Pexels pela query.
// Cache em memória pra não repetir chamadas.
// Fallback: gradiente escuro se falhar.
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'

const cache = new Map<string, string>()

// Gradiente fallback por destino — pra nunca ficar vazio
const FALLBACK = 'linear-gradient(135deg, #1a1815 0%, #2a2320 50%, #1a1815 100%)'

async function fetchPexels(query: string): Promise<string> {
  if (cache.has(query)) return cache.get(query)!

  const key = import.meta.env.VITE_PEXELS_KEY
  if (!key) throw new Error('VITE_PEXELS_KEY não encontrada')

  // Evitar fotos com pessoas: adicionamos keywords garantidas para paisagens limpas
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
      .catch(() => { setError(true); setLoading(false) })
  }, [query])

  return { url, loading, error }
}

// Utilitário pra imagens estáticas (leque, seções)
// Retorna URL direto ou string de fallback
export async function getPexelsUrl(query: string): Promise<string> {
  try {
    return await fetchPexels(query)
  } catch {
    return FALLBACK
  }
}

export { FALLBACK }