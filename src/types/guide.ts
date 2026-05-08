// ─────────────────────────────────────────────
// guide.ts — Tipos do Vambora.ai
// ─────────────────────────────────────────────

export type PriceLevel = 'economico' | 'moderado' | 'sofisticado'

export interface WeatherInfo {
  temperatura_media: string
  condicao: string
  melhor_epoca: string
  dica: string
}

export interface RouteStop {
  periodo: 'manhã' | 'tarde' | 'noite'
  local: string
  descricao: string
  dica_local: string
  maps_query: string
}

export interface RouteDay {
  dia: number
  titulo: string
  paradas: RouteStop[]
}

export interface Restaurant {
  nome: string
  tipo: string
  preco: PriceLevel
  descricao: string
  dica: string
  maps_query: string
}

export interface GuideEvent {
  nome: string
  data: string
  local: string
  descricao: string
  link_busca: string
}

// Orçamento por pessoa + total do grupo
export interface BudgetEstimate {
  hospedagem_por_noite_por_pessoa: string
  alimentacao_por_dia_por_pessoa: string
  transporte_local_por_pessoa: string
  passeios_por_pessoa: string
  total_por_pessoa: string
  total_geral: string
}

// Links estáveis — Booking substituído por Google Hotels
export interface ExternalLinks {
  google_hotels: string
  airbnb: string
  booking: string
  google_flights: string
  decolar: string
  google_maps: string
}

export interface Destination {
  nome: string
  estado: string
  pais: string
  descricao_curta: string
  destaques: string[]
  unsplash_query: string
}

export interface Guide {
  destino: Destination
  periodo: {
    data_inicio: string
    data_fim: string
    total_dias: number
    total_pessoas: number
  }
  clima: WeatherInfo
  roteiro: RouteDay[]
  restaurantes: Restaurant[]
  eventos: GuideEvent[]
  orcamento: BudgetEstimate
  links: ExternalLinks
  dica_golden: string
}

export type GuideStatus = 'idle' | 'loading' | 'success' | 'error'

export interface GuideState {
  status: GuideStatus
  guide: Guide | null
  error: string | null
  prompt: string
}