// ─────────────────────────────────────────────
// guide.ts — Tipos do Vambora.ai
// Esse arquivo é o contrato entre a AI e a UI.
// Tudo que o Gemini retorna precisa bater com
// essas interfaces. Se mudar aqui, muda em tudo.
// ─────────────────────────────────────────────

// ── Nível de preço ──────────────────────────
export type PriceLevel = 'economico' | 'moderado' | 'sofisticado'

// ── Clima ───────────────────────────────────
export interface WeatherInfo {
  temperatura_media: string   // ex: "22°C"
  condicao: string            // ex: "Parcialmente nublado"
  melhor_epoca: string        // ex: "Dezembro a Março"
  dica: string                // ex: "Leve protetor solar"
}

// ── Parada do roteiro (dia a dia) ───────────
export interface RouteStop {
  periodo: 'manhã' | 'tarde' | 'noite'
  local: string               // ex: "Lagoa da Conceição"
  descricao: string
  dica_local: string          // micro-dica de quem conhece
  maps_query: string          // ex: "Lagoa da Conceição Florianópolis"
}

// ── Dia do roteiro ───────────────────────────
export interface RouteDay {
  dia: number
  titulo: string              // ex: "Centro histórico e Lagoa"
  paradas: RouteStop[]
}

// ── Restaurante ──────────────────────────────
export interface Restaurant {
  nome: string
  tipo: string                // ex: "Frutos do mar"
  preco: PriceLevel
  descricao: string
  dica: string
  maps_query: string
}

// ── Evento ───────────────────────────────────
export interface GuideEvent {
  nome: string
  data: string                // ex: "10 de maio"
  local: string
  descricao: string
  link_busca: string          // ex: "Festival Gastronômico Florianópolis 2025"
}

// ── Orçamento estimado ───────────────────────
export interface BudgetEstimate {
  hospedagem_por_noite: string    // ex: "R$ 120 – R$ 350"
  alimentacao_por_dia: string     // ex: "R$ 60 – R$ 180"
  transporte_local: string        // ex: "R$ 30 – R$ 80"
  passeios: string                // ex: "R$ 0 – R$ 150"
  total_estimado: string          // ex: "R$ 800 – R$ 2.400"
}

// ── Links externos (deep links) ──────────────
export interface ExternalLinks {
  booking: string
  airbnb: string
  google_flights: string
  decolar: string
  google_maps: string
}

// ── Destino principal ────────────────────────
export interface Destination {
  nome: string                // ex: "Florianópolis"
  estado: string              // ex: "SC"
  pais: string                // ex: "Brasil"
  descricao_curta: string     // tagline do destino
  destaques: string[]         // ex: ["42 praias", "Lagoa da Conceição"]
  unsplash_query: string      // query pra buscar foto no Unsplash
}

// ── Guia completo — shape principal ─────────
export interface Guide {
  destino: Destination
  periodo: {
    data_inicio: string       // ex: "10/05/2025"
    data_fim: string          // ex: "14/05/2025"
    total_dias: number
  }
  clima: WeatherInfo
  roteiro: RouteDay[]
  restaurantes: Restaurant[]
  eventos: GuideEvent[]
  orcamento: BudgetEstimate
  links: ExternalLinks
  dica_golden: string         // a dica de ouro que só local sabe
}

// ── Estado da geração do guia ────────────────
export type GuideStatus =
  | 'idle'        // ainda não pesquisou
  | 'loading'     // AI processando
  | 'success'     // guia pronto
  | 'error'       // algo deu errado

export interface GuideState {
  status: GuideStatus
  guide: Guide | null
  error: string | null
  prompt: string
}