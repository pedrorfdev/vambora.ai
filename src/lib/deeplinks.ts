// ─────────────────────────────────────────────
// deeplinks.ts — Gerador de URLs externas
//
// Converte dados do guia em deep links reais
// para Booking, Airbnb, Google Flights, etc.
// O usuário chega no site com a busca já feita.
// ─────────────────────────────────────────────

interface DeepLinkParams {
  destino: string       // ex: "Florianópolis SC"
  dataInicio?: string   // ex: "2025-05-10"
  dataFim?: string      // ex: "2025-05-14"
  adultos?: number
}

// ── Converte dd/mm/aaaa → aaaa-mm-dd ─────────
function formatDate(brDate: string): string {
  const [d, m, y] = brDate.split('/')
  return `${y}-${m}-${d}`
}

// ── Booking.com ───────────────────────────────
export function bookingLink(p: DeepLinkParams): string {
  const base = 'https://www.booking.com/search.html'
  const params = new URLSearchParams({
    ss: p.destino,
    ...(p.dataInicio && { checkin: formatDate(p.dataInicio) }),
    ...(p.dataFim && { checkout: formatDate(p.dataFim) }),
    ...(p.adultos && { group_adults: String(p.adultos) }),
    lang: 'pt-br',
  })
  return `${base}?${params.toString()}`
}

// ── Airbnb ────────────────────────────────────
export function airbnbLink(p: DeepLinkParams): string {
  const base = 'https://www.airbnb.com.br/s'
  const location = encodeURIComponent(p.destino)
  const params = new URLSearchParams({
    ...(p.dataInicio && { checkin: formatDate(p.dataInicio) }),
    ...(p.dataFim && { checkout: formatDate(p.dataFim) }),
    ...(p.adultos && { adults: String(p.adultos) }),
  })
  return `${base}/${location}/homes?${params.toString()}`
}

// ── Google Flights ────────────────────────────
export function flightsLink(p: DeepLinkParams): string {
  const query = encodeURIComponent(`voos para ${p.destino}`)
  return `https://www.google.com/travel/flights?q=${query}`
}

// ── Decolar ───────────────────────────────────
export function decolarLink(p: DeepLinkParams): string {
  const query = encodeURIComponent(p.destino)
  return `https://www.decolar.com/shop/flights/results?from=&to=${query}`
}

// ── Google Maps ───────────────────────────────
export function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`
}

// ── Sympla (eventos) ──────────────────────────
export function symplaLink(query: string): string {
  return `https://www.sympla.com.br/eventos?q=${encodeURIComponent(query)}`
}

// ── Gerador completo baseado no guia ──────────
// Recebe os dados do Guide e devolve todos os links prontos
export function buildExternalLinks(params: DeepLinkParams) {
  return {
    booking: bookingLink(params),
    airbnb: airbnbLink(params),
    google_flights: flightsLink(params),
    decolar: decolarLink(params),
    google_maps: mapsLink(params.destino),
  }
}