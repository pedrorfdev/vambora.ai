# Vambora.ai — Frontend (pt-BR)

Bem-vindo ao frontend do Vambora.ai — a casinha onde os prompts viram roteiros, dicas locais e aquele empurrãozinho para a próxima viagem. É React + TypeScript + Vite, com Tailwind para o estilo e motion para as animações. Rápido, leve e bem-humorado.

O que tem aqui
- Interface para gerar e visualizar guias de viagem produzidos por IA (destino, roteiro, restaurantes, eventos, orçamento).
- Componentes prontos: `GuideView`, `RouteCard`, `RestaurantCard`, `BudgetCard`, entre outros.
- Modo de teste que renderiza um `GuideView` mock para você ajustar visualmente sem depender da API.
- Integração com a API de IA (Gemini) em `src/lib/gemini.ts` — precisa de chave para funcionar de verdade.

Requisitos
- Node.js 18+
- npm ou yarn
- (Opcional) `VITE_GEMINI_KEY` para usar a geração real via IA

Instalação rápida

```bash
npm install
```

Desenvolvimento

```bash
npm run dev
```

Build para produção

```bash
npm run build
npm run preview
```

Mostrar os componentes de `guide` para testes (modo dev)
-----------------------------------------------------
Para facilitar o desenvolvimento, existe uma flag de teste em [src/app.tsx](src/app.tsx#L1) chamada `TEST_SHOW_GUIDE`. Quando `true`, o app força a renderização do `GuideView` usando um mock — ótimo para ajustar estilos e checar comportamentos sem esperar a IA.

Exemplo (em `src/app.tsx`):

```ts
// src/app.tsx
const TEST_SHOW_GUIDE = true
```

Altere para `false` para voltar ao fluxo normal (prompt → geração IA → exibição).

Usando a IA de verdade
----------------------
Crie um arquivo `.env` na raiz com a sua chave:

```
VITE_GEMINI_KEY=your_api_key_here
```

Nunca comite chaves de API no repositório.

Onde ajustar o tom e o schema
-----------------------------
O prompt de sistema (que define o tom, regras e o schema JSON obrigatório) está em [src/lib/gemini.ts](src/lib/gemini.ts#L1). Se for preciso ajustar como a IA responde, comece por aí.

Contribuição rápida
- Abra uma issue explicando o problema ou a sugestão.
- Preferência por PRs pequenos e com testes visuais (prints ou gravações são bem-vindas).

Precisa de ajuda?
Abra uma issue com o print do que você está vendo — prometo não rir (muito).

Bom hacking e bora viajar! ✈️🌎
