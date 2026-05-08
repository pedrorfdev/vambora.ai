// ─────────────────────────────────────────────
// deeplinks.ts — URLs externas estáveis
//
// Booking e Airbnb não têm deep link público
// documentado confiável. Usamos Google Hotels
// (redireciona pro Booking/Airbnb/etc) e
// Google Flights — ambos estáveis e funcionam
// com parâmetros de busca.
// ─────────────────────────────────────────────

interface DeepLinkParams {
  destino: string       // ex: "Florianópolis SC"
  dataInicio?: string   // ex: "10/05/2025" (formato BR)
  dataFim?: string
  adultos?: number
}

// dd/mm/aaaa → aaaa-mm-dd
function toISO(brDate: string): string {
  const [d, m, y] = brDate.split('/')
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

// ── Google Hotels ─────────────────────────────
// Abre o Google com hotéis no destino e datas.
// Funciona sem afiliação, redireciona pro Booking/Airbnb/etc.
export function googleHotelsLink(p: DeepLinkParams): string {
  const q = encodeURIComponent(`hotéis em ${p.destino}`)
  const params = new URLSearchParams({ q })

  if (p.dataInicio) params.set('checkin', toISO(p.dataInicio))
  if (p.dataFim)    params.set('checkout', toISO(p.dataFim))
  if (p.adultos)    params.set('adults', String(p.adultos))

  return `https://www.google.com/travel/hotels?${params.toString()}`
}

// ── Airbnb ─────────────────────────────────────
// URL de busca funciona com destino e datas.
export function airbnbLink(p: DeepLinkParams): string {
  const dest = encodeURIComponent(p.destino)
  const params = new URLSearchParams()

  if (p.dataInicio) params.set('checkin',  toISO(p.dataInicio))
  if (p.dataFim)    params.set('checkout', toISO(p.dataFim))
  if (p.adultos)    params.set('adults',   String(p.adultos))

  return `https://www.airbnb.com.br/s/${dest}/homes?${params.toString()}`
}

// ── Google Flights ─────────────────────────────
// Busca voos para o destino. Sem origem definida
// pois não sabemos de onde o usuário parte.
export function flightsLink(p: DeepLinkParams): string {
  const q = encodeURIComponent(`voos para ${p.destino}`)
  return `https://www.google.com/travel/flights?q=${q}`
}

// ── Decolar ────────────────────────────────────
export function decolarLink(p: DeepLinkParams): string {
  const q = encodeURIComponent(p.destino)
  return `https://www.decolar.com/shop/flights/results?from=&to=${q}&fromName=&toName=${q}`
}

// ── Google Maps ────────────────────────────────
export function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`
}

// ── Sympla (eventos) ───────────────────────────
export function symplaLink(query: string): string {
  return `https://www.sympla.com.br/eventos?q=${encodeURIComponent(query)}`
}

// ── Builder completo ───────────────────────────
export function buildExternalLinks(params: DeepLinkParams) {
  return {
    google_hotels:  googleHotelsLink(params),
    airbnb:         airbnbLink(params),
    google_flights: flightsLink(params),
    decolar:        decolarLink(params),
    google_maps:    mapsLink(params.destino),
  }
}