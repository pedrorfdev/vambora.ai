# Vambora.ai — Frontend (en-US)

Welcome to the Vambora.ai frontend — the UI that turns prompts into travel plans, local tips and a gentle nudge toward your next trip. Built with React + TypeScript + Vite, styled with Tailwind and animated with motion. Fast, snappy, and a bit cheeky.

What’s inside
- UI to generate and preview AI-made travel guides (destination, day-by-day itinerary, restaurants, events, budget).
- Ready components: `GuideView`, `RouteCard`, `RestaurantCard`, `BudgetCard`, etc.
- A test mode that renders a mocked `GuideView` so you can tweak visuals without calling the AI.
- Integration with the AI backend in `src/lib/gemini.ts` (requires an API key).

Requirements
- Node.js 18+
- npm or yarn
- (Optional) `VITE_GEMINI_KEY` to use the real AI generation

Quick start

```bash
npm install
npm run dev
```

Build & preview

```bash
npm run build
npm run preview
```

Test mode (show guide components without AI)
-----------------------------------------
For convenient development, there is a test flag in [src/app.tsx](src/app.tsx#L1) called `TEST_SHOW_GUIDE`. When set to `true` the app forces the `GuideView` to render with a mock — handy for styling and behavior checks without the API.

Example (in `src/app.tsx`):

```ts
// src/app.tsx
const TEST_SHOW_GUIDE = true
```

Set it to `false` to restore the normal flow (prompt → AI generation → display).

Using the real AI
-----------------
Create a `.env` file in the project root with:

```
VITE_GEMINI_KEY=your_api_key_here
```

Never commit your API key.

Where to tweak the assistant tone and schema
-------------------------------------------
The system prompt that defines tone, rules and the required JSON schema lives in [src/lib/gemini.ts](src/lib/gemini.ts#L1). If you need the assistant to speak differently or return a slightly different schema, start there.

Contributing
- Open an issue describing the change or bug.
- Small PRs with screenshots or short video captures are highly appreciated.

Need help?
Open an issue with a screenshot — we’ll take a look (and try not to laugh).

Happy hacking and safe travels! ✈️🌍
