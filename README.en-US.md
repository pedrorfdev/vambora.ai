# vambora.ai

> **Your intelligent travel guide for Brazil.**  
> From a simple prompt to a full itinerary in under 30 seconds.

---

## Why this exists

Everyone's been there: a friend brings up a trip, and suddenly it's a cycle of unanswered questions — *"what's worth doing there? how much will it cost? any events happening? is it even a good time to go?"* What should be exciting planning turns into three hours of research across ten open tabs.

**vambora.ai** was built to fix exactly that. You type the destination, dates, and budget — and within seconds you get a complete guide: day-by-day itinerary, restaurants with real insider tips, events actually happening during your trip, honest cost estimates, and direct booking links. Everything in one place, no fluff.

Currently free for beta users. Coming soon: PDF export and shareable itinerary links.

---

## What's inside

```
vambora.ai/
├── src/
│   ├── app.tsx                          # Screen controller (idle → loading → guide)
│   ├── index.css                        # Full design system (palette, tokens, utilities)
│   ├── main.tsx
│   │
│   ├── components/
│   │   ├── guide/
│   │   │   ├── GuideView.tsx            # 3-column layout: sidebar | center | destination
│   │   │   ├── GuideCards.tsx           # Restaurants, Events, Budget, Booking
│   │   │   └── RouteCard.tsx            # Day-by-day itinerary with tab navigation
│   │   │
│   │   ├── landing/
│   │   │   ├── LandingPage.tsx
│   │   │   └── sections/
│   │   │       ├── HeroSection.tsx      # Hero with animated destination fan
│   │   │       ├── AboutSection.tsx     # Interactive flat SVG map with pins
│   │   │       ├── HighlightSection.tsx # Featured destination card with particles
│   │   │       ├── ManifestoSection.tsx # Copy + stats + CTA
│   │   │       ├── DestinationsSection.tsx # Destinations carousel via Pexels
│   │   │       └── LandingFooter.tsx
│   │   │
│   │   ├── prompt/
│   │   │   └── LoadingScreen.tsx        # Route animation: pin A → pin B
│   │   │
│   │   └── ui/
│   │       └── ThemeToggle.tsx          # Dark/light + 5 color themes
│   │
│   ├── hooks/
│   │   ├── useGuide.ts                  # Core state: generation + adaptation
│   │   ├── usePexelsImage.ts            # Pexels API with cache + Unsplash fallback
│   │   └── useTheme.ts                  # Theme persisted in localStorage
│   │
│   ├── lib/
│   │   ├── gemini.ts                    # Gemini integration with model fallback chain
│   │   └── deeplinks.ts                 # URLs for Google Hotels, Airbnb, Flights, Decolar
│   │
│   └── types/
│       └── guide.ts                     # Full guide schema / TypeScript types
```

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styles | Tailwind v4 (config-free, `@import` only) |
| Animations | Framer Motion (`motion/react`) |
| AI | Google Gemini 2.5 Flash Lite (with fallback) |
| Images | Pexels API + Unsplash fallback |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Requirements

- **Node.js 18+**
- **npm** or **yarn**
- **Gemini API key** — [aistudio.google.com](https://aistudio.google.com)
- **Pexels API key** — [pexels.com/api](https://www.pexels.com/api) *(free, instant approval)*

---

## Setup

```bash
# Clone the repo
git clone https://github.com/your-username/vambora.ai.git
cd vambora.ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env`:

```env
VITE_GEMINI_KEY=your_key_here
VITE_PEXELS_KEY=your_key_here
```

> ⚠️ Never commit API keys to the repository.

---

## Running locally

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Production build

```bash
npm run build
npm run preview   # Local preview of the build
```

---

## Deploy (Vercel)

```bash
# Via CLI
npx vercel --prod

# Or connect the repo at vercel.com
# and add the env vars in the project dashboard
```

Both `VITE_GEMINI_KEY` and `VITE_PEXELS_KEY` must be set in the Vercel project settings.

---

## Test mode (no AI calls)

To iterate on UI components without hitting the API, there's a flag in `src/app.tsx`:

```ts
// src/app.tsx — around line 10
const TEST_SHOW_GUIDE = true  // set to false in production
```

When `true`, the app skips the prompt and loading screen and renders `GuideView` with mocked data directly. Great for rapid UI iteration.

---

## How it works

```
User types a prompt
        ↓
useGuide.generate() → gemini.ts
        ↓
Gemini 2.5 Flash Lite receives system prompt + user prompt
(Google Search enabled for real events and up-to-date prices)
        ↓
JSON parsed → Guide object
        ↓
GuideView renders with Pexels background image
Sidebar ← Itinerary / Restaurants / Events / Budget / Booking
```

**Model fallback chain:** if Gemini 2.5 Flash Lite fails (quota, timeout), it automatically retries with `gemini-2.5-flash`, then `gemini-2.0-flash-lite`.

---

## Themes

The design system supports **dark/light** and **5 color themes** switchable at runtime via the `ThemeToggle`:

| Theme | Primary color |
|---|---|
| Blue (default) | `#818CF8` Indigo |
| Yellow | `#FBBF24` Amber |
| Green | `#00A878` Emerald |
| Red | `#EF4444` Red |
| Purple | `#A855F7` Purple |

All components use `var(--color-yellow)` as the primary color token — switching themes updates everything automatically.

---

## Prompt engineering

The system prompt that controls tone and the JSON schema lives in `src/lib/gemini.ts`, inside `buildSystemPrompt()`. It defines:

- Current date injected dynamically (for accurate date calculations)
- Casual, direct Brazilian Portuguese tone
- Google Search enabled for real events and prices
- Mandatory JSON schema with all required fields
- Budget rules per destination profile

If you want to change how the AI responds, start there.

---

## Roadmap

- [x] Full guide generation via Gemini
- [x] Guide adaptation via user instruction
- [x] Images via Pexels API
- [x] Dark/light themes + 5 color options
- [x] Responsive layout (mobile drawers)
- [x] Interactive SVG map on landing page
- [ ] Export guide as PDF
- [ ] Share itinerary via unique link
- [ ] Save previous guides (Supabase)
- [ ] Search by specific event (concerts, festivals, etc.)

---

## 🧪 Feedback and Validation

This project is in a closed testing phase to validate the planning experience with AI. Your feedback is the main piece for the next features.

If you tested the **vambora.ai**, please share your experience through the form below:

👉 **[Feedback Form](https://forms.gle/CdPa2S5saB5caDV86)**

Your answers will be used to prioritize the development roadmap and understand how to make Vambora.ai the best travel tool in Brazil.

---

## Credits

- Photos: [Pexels](https://www.pexels.com) + [Unsplash](https://unsplash.com) as fallback
- AI: [Google Gemini](https://ai.google.dev)
- Icons: [Lucide](https://lucide.dev)

---

*Made with lots of ☕ in 🇧🇷 · v1.0.0*