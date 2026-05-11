// ─────────────────────────────────────────────
// gemini.ts — Integração com @google/genai
// Google Search + JSON via prompt (sem responseMimeType)
// ─────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai'
import type { Guide } from '../types/guide'

const MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
]

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

Use o Google Search para buscar eventos reais, preços atualizados e informações recentes do destino.
Se o usuário mencionar um evento específico (ex: "Codecon", "Rock in Rio", "festival"), 
busque as datas e local reais e monte o roteiro em torno do evento.

RETORNE APENAS O JSON PURO — sem texto antes, sem texto depois, sem blocos de código, sem markdown.
Apenas o objeto JSON válido, começando com { e terminando com }.

REGRAS IMPORTANTES:
- Todos os valores em português brasileiro
- Dicas devem ser práticas, não óbvias ("vá à praia" não é dica)
- maps_query deve ter cidade e estado para evitar ambiguidade
- unsplash_query em inglês para melhores resultados
- orcamento baseado em valores reais e atualizados do Brasil
- Se o usuário não informar orçamento, deduza baseado no destino:
  * Capitais e destinos premium (Floripa, Búzios, Trancoso, Gramado): R$ 350–500/pessoa/dia
  * Cidades médias (Paraty, Tiradentes, Bonito, Chapada): R$ 200–350/pessoa/dia
  * Destinos econômicos e interior: R$ 100–200/pessoa/dia
  * Indique no total_estimado qual perfil foi assumido
- orcamento.total_por_pessoa é o custo total por pessoa para todos os dias
- orcamento.total_geral é total_por_pessoa × total_pessoas
- dica_golden deve ser algo que só quem já foi sabe — aquela dica de ouro
- Se o usuário não informar datas, assuma a próxima semana
- Se não informar duração, assuma 4 dias
- Se não informar número de pessoas, assuma 1 pessoa

SCHEMA OBRIGATÓRIO — retorne exatamente nesse formato:
{
  "destino": {
    "nome": string,
    "estado": string,
    "pais": string,
    "descricao_curta": string,
    "destaques": string[],
    "unsplash_query": string
  },
  "periodo": {
    "data_inicio": string,
    "data_fim": string,
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
    "total_geral": string
  },
  "links": {
    "google_hotels": string,
    "airbnb": string,
    "google_flights": string,
    "decolar": string,
    "google_maps": string
  },
  "dica_golden": string
}
`
}

function parseGuideJSON(raw: string): Guide {
  // Remove qualquer markdown que o modelo insista em colocar
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  // Extrai o primeiro objeto JSON válido da resposta
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Nenhum JSON encontrado na resposta.')
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Guide
  } catch {
    throw new Error('O guia veio com formato inesperado. Tenta de novo!')
  }
}

function isRetryableError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  const retryableMessages = [
    '429', '503', 'unavailable', 'quota', 'vazia', 'empty', 'timeout', 'deadlines'
  ]
  return retryableMessages.some(m => msg.toLowerCase().includes(m))
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
  const systemPrompt = buildSystemPrompt()

  let lastError: unknown

  for (const model of MODELS) {
    try {
      console.log(`[Vambora] Usando modelo: ${model}`)

      const stream = await ai.models.generateContentStream({
        model,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction: { parts: [{ text: systemPrompt }] },
          temperature: 0.7,
          topP: 0.9,
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
      // Se for o último modelo, não precisa verificar se é retryable, vai sair do loop de qualquer jeito
      if (model === MODELS[MODELS.length - 1]) break
      // Se não for retryable (ex: erro de prompt ou config), para por aqui. 
      // Mas se o erro for no modelo em si, tentamos o próximo.
      if (!isRetryableError(error)) break
    }
  }

  const msg = lastError instanceof Error ? lastError.message : 'Erro desconhecido'
  throw new Error(`Todos os modelos estão indisponíveis no momento. Tenta em alguns segundos! (${msg})`)
}