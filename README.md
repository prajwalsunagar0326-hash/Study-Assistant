# StudyAI — Turn Your Notes into Interactive Learning

> An interactive, AI-powered study assistant turning free-form notes and topics into 3D flashcards and active-recall quizzes. Built for the **Frontend Internship Assignment**.

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02?style=flat-square)](https://gsap.com/)
[![Zod](https://img.shields.io/badge/Zod-Runtime_Validation-3068b7?style=flat-square)](https://zod.dev/)
[![Defensive Tests](https://img.shields.io/badge/Defensive_Parser_Tests-17%20Passing-emerald?style=flat-square)](https://github.com/)

---

## 1. Product Philosophy: "Not a Chatbot"

The prompt establishes one firm rule: **It cannot be a chatbot.**

```
Free-Form Notes/Topic ──> Serverless API / Express Proxy ──> Gemini 3.5 Flash-Lite ──> Strict JSON Schema ──> Runtime Zod Validation ──> Interactive React State (3D Cards / Step Quiz)
```

- **Zero conversational chatter**: Every piece of UI the student sees comes from typed, schema-validated fields (`question`, `answer`, `options`, `correctAnswer`, `explanation`, `difficulty`), never from raw dumped model completions or conversational chat bubbles.
- **No transcript or growing message thread**: It is an active learning workspace, not a conversation.
- **In-Memory Mistake Retry**: When a student finishes a quiz and wants to retry questions they missed, the application isolates the incorrect questions from local React state and launches a targeted retry session—**with zero additional AI calls or API latency**.

---

## 2. Key Features

1. **Free-Form Student Input**:
   - Accepts raw lecture notes, textbook excerpts, or concise study topics (supports up to 5,000 characters).
   - Real-time character counter and input validation with instant topic suggestions (Java OOP, Machine Learning, DBMS Normalization, Operating Systems, Computer Networks).

2. **Dual Learning Modes**:
   - **Interactive Flashcards**: 3D perspective flip cards with question prompts, key insights, difficulty badges, and keyboard shortcuts (`Space` to flip, `←` / `→` to navigate).
   - **Interactive Practice Quiz**: Step-by-step multiple-choice questions with 4 accessible options, instant answer checking, emerald/rose visual feedback, and comprehensive pedagogical explanations.

3. **In-Memory Wrong-Answer Retry**:
   - Isolates missed questions in local component state. Retrying mistakes operates instantly in-memory without penalty or redundant LLM round-trips.

4. **GSAP Micro-Interactions**:
   - Entrance hero stagger, mode selector transitions, and 3D card flipping built with `@gsap/react` and pure CSS 3D transforms, with full consideration for `prefers-reduced-motion`.

5. **Live Interviewer Diagnostic Mode**:
   - Built-in simulation buttons to trigger realistic failure modes live in 10 seconds:
     1. *Simulate Malformed JSON*
     2. *Simulate Wrong Schema Shape*
     3. *Simulate Server 500 Error*

6. **Export Study Set**:
   - One-click download of the complete validated study module as a formatted `.json` file.

---

## 3. Architecture & Project Structure

```
flam/
├── api/
│   └── generate-study.ts       # Vercel Serverless Function (Production endpoint)
├── server/
│   └── server.ts               # Local Express proxy with Gemini 3.5 Flash-Lite & mock fallback
├── src/
│   ├── types/
│   │   └── study.ts            # TypeScript interfaces (StudyPlan, Flashcard, QuizQuestion, ApiError)
│   ├── lib/
│   │   ├── schemas.ts          # Runtime Zod schemas with option uniqueness & answer matching
│   │   ├── validateStudyPlan.ts# Defensive parser: markdown stripping & schema validation
│   │   └── api.ts              # Frontend API client with AbortController & stale request checks
│   ├── hooks/
│   │   ├── useStudyGeneration.ts # Generation orchestrator with race-condition guards
│   │   └── useReducedMotion.ts   # Accessibility hook respecting OS reduced motion
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx      # App header, model badge, diagnostic trigger, theme toggle
│   │   ├── study/
│   │   │   ├── StudyInput.tsx  # Free-form textarea, character counter, diagnostic simulator
│   │   │   ├── ModeSelector.tsx# Accessible Flashcards vs Quiz selector
│   │   │   ├── ExamplePrompts.tsx # Quick-start topic chips
│   │   │   ├── StudyHeader.tsx # Active study plan header, mode tabs, and export
│   │   │   ├── FlashcardView.tsx # Flashcard session, keyboard listeners, completion panel
│   │   │   ├── Flashcard.tsx   # 3D perspective flip card (front question / back answer)
│   │   │   ├── QuizView.tsx    # Quiz orchestrator with in-memory retry mechanism
│   │   │   ├── QuizQuestion.tsx# 4 accessible options, check answer, and explanation reveal
│   │   │   └── QuizResults.tsx # Score percentage, mastery evaluation, and retry CTA
│   │   └── states/
│   │       ├── EmptyState.tsx  # Initial educational value proposition & call to action
│   │       ├── LoadingState.tsx# Progressive 4-stage UX messaging with request cancellation
│   │       └── ErrorState.tsx  # User-friendly remediation and expandable diagnostic trace
│   ├── App.tsx                 # Main layout, GSAP entrance animation, and theme sync
│   ├── index.css               # Glassmorphic tokens, 3D flip transforms, and CSS variables
│   └── main.tsx                # React 19 bootstrap
├── scripts/
│   └── test-validation.ts      # 17 automated failure-mode and schema validation tests
├── .env.example
├── package.json
└── README.md
```

---

## 4. AI Integration & Structured Output

### Model
- **Model**: `gemini-3.5-flash-lite`
- **SDK**: Official `@google/genai` (v2.24)
- **Security**: The Gemini API key is **strictly server-side** (in Express or Vercel serverless functions). No API keys are bundled or exposed to client JavaScript.

### Why Structured Output?
Raw LLM text completions are non-deterministic, frequently containing conversational prose or markdown formatting that cannot be safely mounted to interactive components. By configuring Gemini with a strict JSON schema contract, the AI generates structured data directly mapped to TypeScript contracts.

---

## 5. Defensive Response Pipeline & Runtime Validation

External AI output is inherently untrusted data. TypeScript only validates types at compile time; runtime validation is mandatory:

```
User Input
   ↓
Frontend Validation (char count, empty checks)
   ↓
POST /api/generate-study (with AbortSignal)
   ↓
Server Proxy (holds GEMINI_API_KEY)
   ↓
Gemini 3.5 Flash-Lite (JSON Schema)
   ↓
cleanRawJson() (strips ```json code fences and conversational wrappers)
   ↓
JSON.parse() (wrapped in defensive try/catch)
   ↓
Zod Runtime Validation (validates exact types, option count, unique options, answer matching)
   ↓
Data Sanitization
   ↓
Typed React State
   ↓
Interactive Flashcards & Quiz
```

### 17 Automated Validation & Failure Tests

StudyAI includes an automated test suite ([test-validation.ts](file:///c:/Users/sunga/OneDrive/Desktop/flam/scripts/test-validation.ts)) verifying 17 distinct scenarios:

| # | Test Case | Expected Behavior | Result |
| :-: | :--- | :--- | :-: |
| 1 | **Valid StudyPlan** | Parses and validates clean study module | ✅ PASS |
| 2 | **Empty Response** | Catches empty string as `EMPTY_RESPONSE` | ✅ PASS |
| 3 | **Malformed JSON** | Catches syntax errors (unclosed brackets) safely | ✅ PASS |
| 4 | **Markdown Wrapped JSON** | Strips ` ```json ` fences before parsing | ✅ PASS |
| 5 | **Wrong Root Shape** | Rejects array root as `SCHEMA_VALIDATION_ERROR` | ✅ PASS |
| 6 | **Missing Title** | Rejects plan missing a title | ✅ PASS |
| 7 | **Missing Flashcards** | Rejects plan without flashcards key | ✅ PASS |
| 8 | **Empty Flashcards** | Rejects 0-item flashcard array | ✅ PASS |
| 9 | **Invalid Flashcard** | Rejects flashcard with blank question | ✅ PASS |
| 10 | **Invalid Difficulty** | Rejects unknown difficulty level (e.g. "extreme") | ✅ PASS |
| 11 | **Quiz Missing** | Rejects plan without quiz object | ✅ PASS |
| 12 | **Quiz With No Questions** | Rejects quiz with 0 questions | ✅ PASS |
| 13 | **Wrong Option Count** | Rejects questions with 3 options (requires 4) | ✅ PASS |
| 14 | **Duplicate Options** | Rejects questions containing non-unique options | ✅ PASS |
| 15 | **correctAnswer Mismatch** | Rejects questions where answer isn't in options | ✅ PASS |
| 16 | **Valid Quiz** | Accepts multi-question quiz meeting all rules | ✅ PASS |
| 17 | **Stale Request Guard** | Ensures slower older request is discarded | ✅ PASS |

Run the test suite anytime:
```bash
npm test
```

---

## 6. Stale Request & Concurrency Protection

If a student submits request A on a slow network and quickly re-submits request B:
1. `useStudyGeneration` tracks an incremental `requestIdRef.current`.
2. Any active network request is immediately aborted via `AbortController`.
3. If response A somehow arrives after response B, its request ID no longer matches `requestIdRef.current` and it is discarded silently.
4. The user's active UI is never overwritten by an out-of-order stale response.

---

## 7. Quickstart & Local Setup

The repository is built to **work immediately out of the box** (`npm install && npm start`), even without configuring an API key, thanks to a high-fidelity offline educational engine.

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
```bash
npm install
```

### 2. Configure Environment (Optional)
If you wish to use live Gemini 3.5 Flash-Lite instead of the built-in mock fallback, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
And add your Google Gemini API key:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm start
# or npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend Proxy**: [http://localhost:3001](http://localhost:3001)

### 4. Run Test Suite
```bash
npm test
```

### 5. Production Build
```bash
npm run build
```

---

## 8. Vercel Deployment

StudyAI is architected for Vercel deployment:
- `api/generate-study.ts` provides a serverless function handler directly recognized by Vercel.
- The browser fetches `/api/generate-study`, keeping the `GEMINI_API_KEY` protected on the server.
- Add `GEMINI_API_KEY` in the **Vercel Project Settings → Environment Variables**.

---

## 9. AI Usage Disclosure

In accordance with assignment requirements:
- **AI Tools Used**: Google Gemini Flash & Claude for architecture scaffolding, prompt phrasing refinement, and initial skeleton generation.
- **Human Implementation & Ownership**:
  - Authored the defensive schema validator ([validateStudyPlan.ts](file:///c:/Users/sunga/OneDrive/Desktop/flam/src/lib/validateStudyPlan.ts)) and 17-test failure suite ([test-validation.ts](file:///c:/Users/sunga/OneDrive/Desktop/flam/scripts/test-validation.ts)).
  - Implemented the stale request concurrency guard (`requestIdRef` + `AbortController`).
  - Designed the in-memory wrong answer retry mechanism without duplicate LLM calls.
  - Implemented the 3D flip card transform, accessibility keyboard controls, and CSS variable design system.

---

## 10. Known Limitations & Future Improvements

- **AI Educational Nuance**: Like all LLMs, generated answers should be reviewed by instructors for high-stakes examinations.
- **Persistence**: Sessions currently live in React state; local storage or cloud database sync (e.g. Supabase) would allow cross-device study sessions.
- **Anki Export**: Future versions can export study sets as `.apkg` files for direct import into Anki.
- **Spaced Repetition System (SRS)**: Implementing an SM-2 scheduling algorithm to re-surface flashcards based on user confidence ratings.

---

## 11. Time Spent Breakdown

- **Domain Architecture & Schema Contracts**: ~1.0 hour (Zod schemas, types, error taxonomy)
- **Backend & Vercel Serverless Integration**: ~1.0 hour (Express proxy, Gemini 3.5 Flash-Lite, mock fallback)
- **Defensive Parser & 17-Test Failure Suite**: ~1.5 hours (cleaning fences, shape validation, assertions)
- **Interactive UI (Flashcards & Quiz)**: ~2.5 hours (3D card flip, step-by-step quiz, in-memory retry)
- **Motion, Design System & Accessibility**: ~1.5 hours (GSAP entrance, keyboard navigation, dark/light theme)
- **Total Time**: ~7.5 hours (within the 8-hour target)
