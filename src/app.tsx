import { AnimatePresence } from 'motion/react'
import { useGuide } from './hooks/useGuide'
import { PromptInput } from './components/prompt/PromptInput'
import { LoadingScreen } from './components/prompt/LoadingScreen'
import { GuideView } from './components/guide/GuideView'
import type { Guide } from './types/guide'

export function App() {
  const guide = useGuide()

  const TEST_SHOW_GUIDE = false
  const MOCK_GUIDE: Guide = {
    destino: {
      nome: 'Florianópolis',
      estado: 'SC',
      pais: 'Brasil',
      descricao_curta: 'Praias, trilhas e boa comida',
      destaques: ['42 praias', 'Lagoa da Conceição'],
      unsplash_query: 'Florianópolis Brazil',
    },
    periodo: {
      data_inicio: '10/05/2026',
      data_fim: '14/05/2026',
      total_dias: 5,
    },
    clima: {
      temperatura_media: '22°C',
      condicao: 'Parcialmente nublado',
      melhor_epoca: 'Dezembro a Março',
      dica: 'Leve protetor solar e uma jaqueta leve',
    },
    roteiro: [
      {
        dia: 1,
        titulo: 'Centro histórico e praias próximas',
        paradas: [
          {
            periodo: 'manhã',
            local: 'Centro Histórico',
            descricao: 'Passeio pelo centro e visita a pontos culturais.',
            dica_local: 'Visite cedo para evitar multidões.',
            maps_query: 'Centro Histórico Florianópolis',
          },
          {
            periodo: 'tarde',
            local: 'Praia Mole',
            descricao: 'Relaxar e curtir o sol.',
            dica_local: 'Leve roupa de banho e protetor solar.',
            maps_query: 'Praia Mole Florianópolis',
          },
        ],
      },
    ],
    restaurantes: [
      {
        nome: 'Restaurante Exemplo',
        tipo: 'Frutos do mar',
        preco: 'moderado',
        descricao: 'Peixes frescos e pratos locais.',
        dica: 'Peça o prato do dia.',
        maps_query: 'Restaurante Exemplo Florianópolis',
      },
    ],
    eventos: [
      {
        nome: 'Feira de Artesanato',
        data: '11/05/2026',
        local: 'Praça Central',
        descricao: 'Feira com artistas locais e comidas típicas.',
        link_busca: 'Feira de Artesanato Florianópolis 2026',
      },
    ],
    orcamento: {
      hospedagem_por_noite: 'R$ 120 – R$ 350',
      alimentacao_por_dia: 'R$ 60 – R$ 180',
      transporte_local: 'R$ 30 – R$ 80',
      passeios: 'R$ 0 – R$ 150',
      total_estimado: 'R$ 800 – R$ 2.400',
    },
    links: {
      booking: 'https://www.booking.com/',
      airbnb: 'https://www.airbnb.com/',
      google_flights: 'https://www.google.com/flights',
      decolar: 'https://www.decolar.com/',
      google_maps: 'https://maps.google.com/',
    },
    dica_golden: 'Aproveite o pôr do sol na Lagoa da Conceição - imperdível.',
  }

  if (TEST_SHOW_GUIDE) {
    return (
      <main className="min-h-dvh bg-(--color-black) text-text-primary">
        <GuideView key="guide" guide={guide.guide ?? MOCK_GUIDE} onReset={guide.reset} />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-(--color-black) text-text-primary">
      <AnimatePresence mode="wait">

        {/* Tela de prompt — estado inicial e erro */}
        {(guide.status === 'idle' || guide.status === 'error') && (
          <PromptInput
            key="prompt"
            prompt={guide.prompt}
            error={guide.error}
            onPromptChange={guide.setPrompt}
            onSubmit={guide.generate}
          />
        )}

        {/* Loading — AI processando */}
        {guide.status === 'loading' && (
          <LoadingScreen
            key="loading"
            message={guide.loadingMessage}
          />
        )}

        {/* Guia gerado — sucesso */}
        {guide.status === 'success' && guide.guide && (
          <GuideView
            key="guide"
            guide={guide.guide}
            onReset={guide.reset}
          />
        )}

        

      </AnimatePresence>
    </main>
  )
}