# VoyageAI — Interactive Structured Trip Planner
> A structured AI tool turning free-form travel requests into an interactive, reactive itinerary board. Built for the **Flam Frontend Engineering Assignment**.

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Defensive_Parser_Tests-8%20Passing-emerald?style=flat-square)](https://github.com/)

---

## 1. The Core Philosophy: "Not a Chatbot"

The prompt establishes one firm rule: **It cannot be a chatbot.**

```
Free-Form Text Prompt ──> Backend Proxy ──> Strict JSON Schema ──> Defensive Parser ──> Interactive React State (Tabs / Cards / Modals)
```

- **Zero conversational text**: Every piece of UI the user sees comes from typed, schema-validated fields (`title`, `time`, `category`, `duration`, `estimatedCost`, `tips`), never from dumped model completions or conversational bubbles.
- **No transcript or growing message thread**: It is an interactive application board, not a conversation.
- **Non-Chatbot Refinement Loop**: Instead of an open chat panel, day adjustments are scoped as **one-shot structured patch actions** on a specific day (`Adjust This Day`). The model returns a typed `{ dayNumber, theme, updatedStops: [...] }` patch that merges cleanly into existing React state. No bubbles, no conversational history—only dynamic cards updating in place with full **Undo** capability.

---

## 2. Project Architecture & Structure

Conforming to the project layout specified in the assignment brief:

```
flam/
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx        # Free-form input, inspiration chips & Interviewer Diagnostic Mode
│   │   ├── ResultView.tsx         # Routes parsed data to TripView, LoadingState, or ErrorState
│   │   ├── TripView.tsx           # Full itinerary board, day selector tabs, undo toast & export
│   │   ├── DayCard.tsx            # Daily timeline, stop cards list & day action affordances
│   │   ├── StopCard.tsx           # Typed badges, expandable insider tips, reordering & deletion
│   │   ├── AdjustDayModal.tsx     # One-shot "Adjust this day" structured patch modal
│   │   ├── AddStopModal.tsx       # Manual custom stop addition modal
│   │   ├── ErrorState.tsx         # Comprehensive error view with diagnostics & retry actions
│   │   └── LoadingState.tsx       # Progressive status stages & animated skeleton indicators
│   ├── lib/
│   │   ├── api.ts                 # Backend proxy caller with AbortController & stale request checks
│   │   └── validateResult.ts      # Strict runtime schema validation & markdown fence cleaner
│   ├── types/
│   │   └── result.ts              # TripPlan, DayPlan, Stop, DayAdjustmentPatch, and ApiError types
│   ├── App.tsx                    # Orchestrates top-level state, stale guards, and health checks
│   ├── index.css                  # Custom glassmorphic design system and responsive layout
│   └── main.tsx                   # React 19 entry point
├── server/
│   └── server.ts                  # Express proxy: holds API key, enforces JSON, & mock fallback
├── scripts/
│   └── test-validation.ts         # Automated test suite for all failure modes
├── .env.example
├── package.json
└── README.md
```

---

## 3. Quickstart & Running Locally

The app is built to **just work out of the box** (`npm install && npm start`), even if no external API key is configured, thanks to a high-fidelity mock fallback.

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
```bash
npm install
```

### 2. Configure Environment (Optional)
If you wish to use live LLMs instead of the built-in mock fallback, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
And add your key (supports Google Gemini, Groq, or OpenAI):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
# or GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start Frontend & Backend Concurrently
```bash
npm start
# or npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend Proxy**: `http://localhost:3001`

### 4. Run Defensive Parser Test Suite
```bash
npm test
```

---

## 4. Handling Realistic Failure Modes (Assignment Section 7)

Handling bad AI output is weighted at **20%** of the evaluation. VoyageAI handles every realistic failure mode with dedicated UI states:

| Failure Mode | How It Is Triggered / Detected | Defensive Handling & UI Representation |
| :--- | :--- | :--- |
| **Malformed JSON** | Model emits broken JSON syntax, trailing commas, or markdown wrappers (` ```json `). | `cleanRawJson()` strips code blocks; `JSON.parse` is wrapped in defensive try/catch. Catches syntax errors, displays `MALFORMED_JSON` error state with expandable raw output inspection and **Retry** button. |
| **Wrong Schema Shape** | Model returns valid JSON but omits critical fields (`destination`, empty `days[]`, or stops without titles). | `validateTripPlan()` verifies every property and type. Rejects malformed structures as `SCHEMA_VALIDATION_ERROR` before passing data to React state (zero blank screens or undefined crashes). |
| **Empty Response** | Model returns empty tokens or empty string. | Detected immediately as `EMPTY_RESPONSE`. Guides user to rephrase prompt. |
| **Slow Response / Hang** | LLM latency or network slow-down. | `LoadingState` displays animated progressive stages (analyzing constraints → synthesizing schema → validating data) with an explicit **Cancel Request** option. |
| **Failed Server / Network Request** | Backend proxy down (500) or network disconnect. | Returns typed `NETWORK_ERROR` or `SERVER_ERROR` with remediation hints and one-click **Retry**. |
| **Stale Responses** | User submits query B while slower query A is still resolving. | Guarded via `requestId.current` counter in `App.tsx` and `AbortController`. Older responses resolving late are discarded. |

### 💡 Live Interviewer Mode
Inside the app, clicking **"Interviewer Mode"** in the input bar reveals three instant simulation buttons:
1. `Simulate 1. Malformed JSON`
2. `Simulate 2. Wrong Schema Shape`
3. `Simulate 3. Server 500 Error`

This allows interviewers to inspect the exact defensive parsing and error recovery states in 10 seconds live.

---

## 5. Interactive Features

1. **Day Selector Tabs**: Seamlessly switch between days with active tabs showing daily themes and stop counts.
2. **Reorder Stops**: Move stops up (`↑`) or down (`↓`) to adjust itinerary flow dynamically.
3. **Delete Stop with Undo**: Removing a stop triggers an undo toast with a persistent action stack.
4. **Add Custom Stop**: Add custom meetings or side-trips directly into any day.
5. **Adjust Day Refinement**: Non-chatbot modal to refine a day (e.g. *"Afternoon rain: switch outdoor stops to museums and tea house"*), applying a targeted JSON patch into that day's cards.
6. **Export Itinerary**: One-click download of the complete validated trip plan as a `.json` file.

---

## 6. AI Usage Disclosure (Assignment Section 8)

In accordance with Section 8:
- **AI Tools Used**: Google Gemini Flash & Claude for architecture scaffolding, prompt phrasing refinement, and initial skeleton generation.
- **Human Implementation & Ownership**:
  - Authored the defensive schema validator (`validateResult.ts`) and custom test suite (`test-validation.ts`).
  - Implemented the stale request concurrency guard (`requestId.current` + `AbortController`).
  - Designed the non-chatbot day refinement patch architecture (`AdjustDayModal.tsx` & `/api/adjust-day`).
  - Authored the glassmorphic responsive design system in `src/index.css` without external Tailwind bloat.

---

## 7. Known Limitations & Future Improvements

- **Local Persistence**: Sessions currently live in React state; adding `localStorage` or IndexedDB persistence would allow users to reload past itineraries across browser sessions.
- **Interactive Map Integration**: Integrating Leaflet or Mapbox using stop coordinates would provide visual route lines between stops.
- **Offline PWA**: Registering a service worker would cache itineraries for offline travel usage.

---

## 8. Time Spent Breakdown

- **Architecture & Schema Design**: ~1.0 hour (data shapes, error taxonomy, endpoint contracts)
- **Backend Proxy & Key Security**: ~1.0 hour (Express server, prompt constraints, mock fallback)
- **Defensive Parser & Test Suite**: ~1.5 hours (shape assertion, markdown stripping, 8 passing tests)
- **Interactive React UI & State**: ~2.5 hours (Day tabs, reordering, undo stack, refinement patch)
- **UI/UX Polish, Accessibility & Documentation**: ~1.5 hours (glassmorphism tokens, micro-interactions, README)
- **Total Time**: ~7.5 hours (within the 8-hour target)
