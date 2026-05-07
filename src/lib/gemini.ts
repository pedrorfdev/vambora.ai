import { GoogleGenAI } from '@google/genai';
import type { Guide } from '../types/guide';

const SYSTEM_PROMPT = `
Você é o Vambora.ai, um guia de viagens brasileiro inteligente,
descolado e que fala como alguém que realmente conhece o destino.
Seu tom é amigável, direto, com pitadas de humor leve — nunca formal demais.

Você SEMPRE retorna um JSON válido, sem texto antes ou depois, sem blocos de código.
Apenas o JSON puro, seguindo exatamente o schema abaixo.

REGRAS IMPORTANTES:
- Todos os valores em português brasileiro
- Dicas devem ser práticas, não óbvias ("vá à praia" não é dica)
- maps_query deve ter cidade e estado para evitar ambiguidade
- unsplash_query em inglês para melhores resultados
- orcamento baseado em valores reais e atualizados do Brasil
- dica_golden deve ser algo que só quem já foi sabe — aquela dica de ouro
- Se o usuário não informar datas, assuma a próxima semana
- Se não informar duração, assuma 4 dias
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
    "data_inicio": string (dd/mm/aaaa),
    "data_fim": string (dd/mm/aaaa),
    "total_dias": number
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
    "hospedagem_por_noite": string,
    "alimentacao_por_dia": string,
    "transporte_local": string,
    "passeios": string,
    "total_estimado": string
  },
  "links": {
    "booking": string,
    "airbnb": string,
    "google_flights": string,
    "decolar": string,
    "google_maps": string
  },
  "dica_golden": string (max 120 chars)
}
`

function parseGuideJSON(raw: string): Guide {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned) as Guide;
  } catch {
    throw new Error('O guia veio com formato inesperado. Tenta de novo!');
  }
}

export async function generateGuideStream(
  userPrompt: string,
  onChunk?: (chunk: string) => void,
): Promise<Guide> {
  const key = import.meta.env.VITE_GEMINI_KEY;

  if (!key) throw new Error('VITE_GEMINI_KEY não encontrada.');
  const ai = new GoogleGenAI({ apiKey: key });

  const result = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }] // <-- Aqui entra o que o Pedro digitou no input!
      }
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.9,
      responseMimeType: 'application/json',
    }
  });

  let fullText = '';

  // 3. Processa o stream para o seu loading ficar bonitão
  for await (const chunk of result) {
    // Na lib @google/genai, o acesso ao texto pode variar levemente, 
    // mas geralmente é chunk.text() ou chunk.candidates[0].content.parts[0].text
    const chunkText = chunk.text ?? ''; 
    fullText += chunkText;
    onChunk?.(chunkText);
  }

  return parseGuideJSON(fullText);
}