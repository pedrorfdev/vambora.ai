// ─────────────────────────────────────────────
// gemini.ts — Integração com @google/genai
// ─────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai'
import type { Guide } from '../types/guide'

const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
]

// Data atual injetada dinamicamente — resolve datas de 2024
function buildSystemPrompt(): string {
  const hoje = new Date()
  const dataAtual = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
Você é o Vambora.ai, um guia de viagens brasileiro inteligente,
descolado e que fala como alguém que realmente conhece o destino.
Seu tom é amigável, direto, com pitadas de humor leve — nunca formal demais.

HOJE É: ${dataAtual}
Use essa data como referência para calcular todas as datas do roteiro.
Nunca use datas de anos anteriores. Se o usuário disser "semana que vem", calcule a partir de hoje.

Você SEMPRE retorna um JSON válido, sem texto antes ou depois, sem blocos de código.
Apenas o JSON puro, seguindo exatamente o schema abaixo.

REGRAS IMPORTANTES:
- Todos os valores em português brasileiro
- Dicas devem ser práticas, não óbvias ("vá à praia" não é dica)
- maps_query deve ter cidade e estado para evitar ambiguidade
- unsplash_query em inglês para melhores resultados
- orcamento baseado em valores reais e atualizados do Brasil
- orcamento.por_pessoa é o custo por pessoa por dia
- orcamento.total_estimado é a soma de todos os dias para o grupo
- dica_golden deve ser algo que só quem já foi sabe — aquela dica de ouro
- Se o usuário não informar datas, assuma a próxima semana
- Se não informar duração, assuma 4 dias
- Se não informar número de pessoas, assuma 1 pessoa
- Se o usuário não informar orçamento, deduza baseado no destino:
  - Capitais e destinos premium (Floripa, Búzios, Trancoso): R$ 350-500/pessoa/dia
  - Cidades médias (Paraty, Tiradentes, Bonito): R$ 200-350/pessoa/dia  
  - Destinos econômicos e interior: R$ 100-200/pessoa/dia
  - Sempre explique no total_estimado qual perfil foi assumido
- eventos: busque eventos reais se souber, ou indique o tipo de evento típico da época

SCHEMA OBRIGATÓRIO:
{
  "destino": {
    "nome": string,
    "estado": string (sigla, ex: "SC"),
    "pais": string,
    "descricao_curta": string (max 80 chars, tagline do destino),
    "destaques": string[] (3 a 5 itens),
    "unsplash_query": string (em inglês, ex: "Florianopolis Brazil beach")
  },
  "periodo": {
    "data_inicio": string (dd/mm/aaaa — use o ano correto: ${hoje.getFullYear()} ou ${hoje.getFullYear() + 1}),
    "data_fim": string (dd/mm/aaaa),
    "total_dias": number,
    "total_pessoas": number
  },
  "clima": {
    "temperatura_media": string,
    "condicao": string,
    "melhor_epoca": string,
    "dica": string
  },
  "roteiro": [
    {
      "dia": number,
      "titulo": string,
      "paradas": [
        {
          "periodo": "manhã" | "tarde" | "noite",
          "local": string,
          "descricao": string,
          "dica_local": string,
          "maps_query": string
        }
      ]
    }
  ],
  "restaurantes": [
    {
      "nome": string,
      "tipo": string,
      "preco": "economico" | "moderado" | "sofisticado",
      "descricao": string,
      "dica": string,
      "maps_query": string
    }
  ],
  "eventos": [
    {
      "nome": string,
      "data": string,
      "local": string,
      "descricao": string,
      "link_busca": string
    }
  ],
  "orcamento": {
    "hospedagem_por_noite_por_pessoa": string,
    "alimentacao_por_dia_por_pessoa": string,
    "transporte_local_por_pessoa": string,
    "passeios_por_pessoa": string,
    "total_por_pessoa": string,
    "total_geral": string (total_por_pessoa × total_pessoas × total_dias)
  },
  "links": {
    "google_hotels": string,
    "airbnb": string,
    "google_flights": string,
    "decolar": string,
    "google_maps": string
  },
  "dica_golden": string (max 120 chars)
}
`
}

function parseGuideJSON(raw: string): Guide {
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned) as Guide
  } catch {
    throw new Error('O guia veio com formato inesperado. Tenta de novo!')
  }
}

function isRetryableError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return msg.includes('429') || msg.includes('503') || msg.includes('unavailable') || msg.includes('quota')
}

export async function generateGuideStream(
  userPrompt: string,
  onChunk?: (chunk: string) => void,
): Promise<Guide> {
  const key = import.meta.env.VITE_GEMINI_KEY

  if (!key) {
    throw new Error('VITE_GEMINI_KEY não encontrada. Cria o .env na raiz com VITE_GEMINI_KEY=sua_chave')
  }

  const ai = new GoogleGenAI({ apiKey: key })
  const systemPrompt = buildSystemPrompt() // data injetada aqui

  let lastError: unknown

  for (const model of MODELS) {
    try {
      console.log(`[Vambora] Usando modelo: ${model}`)

      const stream = await ai.models.generateContentStream({
        model,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          topP: 0.9,
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }],
        },
      })

      let fullText = ''

      for await (const chunk of stream) {
        const chunkText = chunk.text ?? ''
        if (chunkText) {
          fullText += chunkText
          onChunk?.(chunkText)
        }
      }

      if (!fullText) throw new Error('Resposta vazia.')

      return parseGuideJSON(fullText)

    } catch (error) {
      lastError = error
      console.warn(`[Vambora] Modelo ${model} falhou:`, error)
      if (!isRetryableError(error)) break
    }
  }

  const msg = lastError instanceof Error ? lastError.message : 'Erro desconhecido'
  throw new Error(`Todos os modelos estão indisponíveis no momento. Tenta em alguns segundos! (${msg})`)
}