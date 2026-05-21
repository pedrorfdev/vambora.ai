# vambora.ai

> **Seu guia de viagens inteligente pelo Brasil.**  
> De um prompt simples a um roteiro completo em menos de 30 segundos.

---

## Por que isso existe

Todo mundo já passou por aquele momento: um amigo fala em viajar, e começa o ciclo de perguntas sem fim — *"o que tem de bom lá? quanto vai custar? tem evento no período? vale a pena ir nessa época?"*. O planejamento que deveria ser animado vira uma pesquisa de três horas espalhada em dez abas abertas.

O **vambora.ai** nasceu pra resolver exatamente essa dor. Você digita o destino, o período e o orçamento — e em segundos recebe um guia completo: roteiro dia a dia, restaurantes com dicas reais, eventos que estão acontecendo de verdade, estimativa de gastos honesta e links diretos pra reservar. Tudo num lugar só, sem enrolação.

Por enquanto gratuito para usuários de teste. No futuro: exportação do guia em PDF e compartilhamento de roteiros.

---

## O que tem dentro

```
vambora.ai/
├── src/
│   ├── app.tsx                          # Controlador de telas (idle → loading → guide)
│   ├── index.css                        # Design system completo (paleta, tokens, utilitários)
│   ├── main.tsx
│   │
│   ├── components/
│   │   ├── guide/
│   │   │   ├── GuideView.tsx            # Layout 3 colunas: sidebar | centro | destino
│   │   │   ├── GuideCards.tsx           # Restaurantes, Eventos, Gastos, Reservas
│   │   │   └── RouteCard.tsx            # Roteiro com abas por dia
│   │   │
│   │   ├── landing/
│   │   │   ├── LandingPage.tsx
│   │   │   └── sections/
│   │   │       ├── HeroSection.tsx      # Hero com leque de destinos animado
│   │   │       ├── AboutSection.tsx     # Mapa SVG flat interativo com pins
│   │   │       ├── HighlightSection.tsx # Card destaque com partículas
│   │   │       ├── ManifestoSection.tsx # Copy + stats + CTA
│   │   │       ├── DestinationsSection.tsx # Carrossel de destinos via Pexels
│   │   │       └── LandingFooter.tsx
│   │   │
│   │   ├── prompt/
│   │   │   └── LoadingScreen.tsx        # Animação de rota pin A → pin B
│   │   │
│   │   └── ui/
│   │       └── ThemeToggle.tsx          # Dark/light + 5 temas de cor
│   │
│   ├── hooks/
│   │   ├── useGuide.ts                  # Estado central: geração + adaptação
│   │   ├── usePexelsImage.ts            # Pexels API com cache + fallback Unsplash
│   │   └── useTheme.ts                  # Tema persistido no localStorage
│   │
│   ├── lib/
│   │   ├── gemini.ts                    # Integração Gemini com fallback de modelos
│   │   └── deeplinks.ts                 # URLs para Google Hotels, Airbnb, Flights, Decolar
│   │
│   └── types/
│       └── guide.ts                     # Schema completo do guia
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind v4 (sem config, só `@import`) |
| Animações | Framer Motion (`motion/react`) |
| IA | Google Gemini 2.5 Flash Lite (com fallback) |
| Imagens | Pexels API + fallback Unsplash |
| Ícones | Lucide React |
| Deploy | Vercel |

---

## Pré-requisitos

- **Node.js 18+**
- **npm** ou **yarn**
- Chave da **Gemini API** — [aistudio.google.com](https://aistudio.google.com)
- Chave da **Pexels API** — [pexels.com/api](https://www.pexels.com/api) *(gratuita, aprovação instantânea)*

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vambora.ai.git
cd vambora.ai

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o `.env`:

```env
VITE_GEMINI_KEY=sua_chave_aqui
VITE_PEXELS_KEY=sua_chave_aqui
```

> ⚠️ Nunca commite chaves de API no repositório.

---

## Rodando localmente

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## Build para produção

```bash
npm run build
npm run preview   # Preview local do build
```

---

## Deploy (Vercel)

```bash
# Via CLI
npx vercel --prod

# Ou conecte o repositório em vercel.com
# e configure as env vars no dashboard
```

As variáveis `VITE_GEMINI_KEY` e `VITE_PEXELS_KEY` precisam estar configuradas no projeto da Vercel.

---

## Modo de teste (sem chamar a IA)

Para ajustar componentes visuais sem depender da API, existe uma flag em `src/app.tsx`:

```ts
// src/app.tsx — linha ~10
const TEST_SHOW_GUIDE = true  // false em produção
```

Com `true`, o app renderiza um `GuideView` com dados mockados direto, pulando o prompt e o loading. Útil pra iterar rápido em estilos.

---

## Como funciona

```
Usuário digita o prompt
        ↓
useGuide.generate() → gemini.ts
        ↓
Gemini 2.5 Flash Lite recebe system prompt + prompt do usuário
(Google Search ativado pra eventos e preços reais)
        ↓
JSON parseado → Guide object
        ↓
GuideView renderiza com imagem Pexels de fundo
Sidebar ← Roteiro / Onde comer / Eventos / Gastos / Reservar
```

**Fallback de modelos:** se o Gemini 2.5 Flash Lite falhar (quota, timeout), tenta automaticamente `gemini-2.5-flash` e depois `gemini-2.0-flash-lite`.

---

## Temas

O design system suporta **dark/light** e **5 temas de cor** selecionáveis em runtime pelo `ThemeToggle`:

| Tema | Cor primária |
|---|---|
| Blue (padrão) | `#818CF8` Indigo |
| Yellow | `#FBBF24` Âmbar |
| Green | `#00A878` Esmeralda |
| Red | `#EF4444` Vermelho |
| Purple | `#A855F7` Roxo |

Todos os componentes usam `var(--color-yellow)` como cor primária — trocar o tema muda tudo automaticamente.

---

## Prompt engineering

O system prompt que controla o tom e o schema JSON fica em `src/lib/gemini.ts`, função `buildSystemPrompt()`. Ele define:

- Data atual injetada dinamicamente (pra calcular datas corretas)
- Tom descolado, direto, sem formalidade
- Google Search habilitado pra eventos e preços reais
- Schema JSON obrigatório com todos os campos
- Regras de orçamento por perfil de destino

Se quiser mudar como a IA responde, comece por ali.

---

## Roadmap

- [x] Geração de guia completo via Gemini
- [x] Adaptação do guia por instrução do usuário
- [x] Imagens via Pexels API
- [x] Temas dark/light + 5 cores
- [x] Layout responsivo (mobile drawers)
- [x] Mapa SVG interativo na landing
- [x] PWA Ready: suporte a instalação e ícones responsivos.
- [ ] Exportar guia em PDF
- [ ] Compartilhar roteiro via link único
- [ ] Salvar guias anteriores (Supabase)
- [ ] Busca por evento específico (Codecon, Rock in Rio, etc.)

---

## 🧪 Feedback e Validação

Este projeto está em fase de testes fechados para validar a experiência de planejamento com IA. Seu feedback é a peça principal para as próximas funcionalidades.

Se você testou o **vambora.ai**, por favor, compartilhe sua experiência através do formulário abaixo:

👉 **[Formulário de Feedback](https://forms.gle/CdPa2S5saB5caDV86)**

Suas respostas serão utilizadas para priorizar o roadmap de desenvolvimento e entender como tornar o Vambora.ai a melhor ferramenta de viagens do Brasil.

---

## Créditos

- Fotos: [Pexels](https://www.pexels.com) + [Unsplash](https://unsplash.com) como fallback
- IA: [Google Gemini](https://ai.google.dev)
- Ícones: [Lucide](https://lucide.dev)

---

*Feito com muito ☕ no 🇧🇷 · v1.0.0*