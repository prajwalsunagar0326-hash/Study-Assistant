# StudyAI — Productivity & Student Dashboard Platform

> **StudyAI — Turn your notes into interactive learning.**
> An AI-powered study assistant and student productivity dashboard that converts free-form notes and topics into 3D flashcards and quizzes, integrated with a comprehensive client-side student productivity platform. Built for the **Frontend Internship Assignment**.

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02?style=flat-square)](https://gsap.com/)
[![Zod](https://img.shields.io/badge/Zod-Runtime_Validation-3068b7?style=flat-square)](https://zod.dev/)
[![Unit Tests](https://img.shields.io/badge/Unit_Tests-31%20Passing-emerald?style=flat-square)](https://github.com/prajwalsunagar0326-hash/Study-Assistant)

---

## 1. Product Philosophy: "Not a Chatbot"

The project adheres to one strict architectural principle:

> **AI generates structured study content → application validates it → React owns the interactive experience.**

```text
Free-Form Notes/Topic ──> Vercel API / Express Proxy ──> Gemini 3.5 Flash-Lite ──> Strict JSON Schema ──> Runtime Zod Validation ──> Interactive React State (3D Cards / Step Quiz)
```

```text
Local Productivity Data ──> Typed Centralized Storage (storage.ts) ──> localStorage ──> Tasks / Calendar / Bookmarks / Pomodoro / Profile / Statistics
```

- **Zero conversational chatter**: UI fields are strongly typed (`question`, `answer`, `options`, `correctAnswer`, `explanation`, `difficulty`), never raw dumped chat completions.
- **Client-Side Instant Productivity**: Tasks, calendar, bookmarks, pomodoro, search, and statistics work **instantly on the client** without unnecessary API latency or AI token burn.
- **In-Memory Mistake Retry**: Missed quiz questions are isolated in local React memory for targeted re-testing with zero extra network round-trips.

---

## 2. Comprehensive Feature Suite

### 1. Study Dashboard
- **Welcome Header**: Greeting with current date, student initials, and active study streak flame badge.
- **Verified Learning Metrics**: Dynamically calculated counts for tasks completed, active streak, quiz accuracy %, cards studied, and hours focused.
- **Today's Plan**: Interactive agenda combining tasks due today, scheduled study sessions, and exams.
- **Quick Action Triggers**: Instant shortcuts to generate study sets, add tasks, schedule study sessions, launch Pomodoro, or browse bookmarks.
- **Saved Study Sets**: Quick access to past generated AI topics saved directly in local storage.

### 2. Tasks / To-Do Management System
- Strongly typed `Task` model (`id`, `title`, `description`, `completed`, `priority`, `dueDate`, `category`, `createdAt`, `completedAt`).
- **Interactive Actions**: Create, edit, delete, complete, and reopen tasks with completion timestamps.
- **Filtering**: All, Active, Completed, Today, Upcoming, and High Priority.
- **Sorting**: Due date, priority level (high to low), creation time, and alphabetical.

### 3. Study Calendar
- **Interactive Month Grid**: Visual date indicators, today indicator, previous/next month switching.
- **Event Types**: Distinct badges for `study`, `assignment`, `exam`, `deadline`, and `other`.
- **Day Agenda**: Selecting any date displays that day's scheduled sessions with event editing and deletion.
- **Event Creation Modal**: Validation on title, date, start time, end time, and description.

### 4. Bookmark System
- Integrated bookmarking across the entire study experience:
  - **Flashcards**: Quick `☆ Save` / `★ Saved` star on each card.
  - **Quiz Questions**: Bookmark challenging questions with correct answer and pedagogical explanation.
  - **Study Sets**: Save entire generated modules to local library.
- Dedicated **Bookmarks View** with instant type filters (`all`, `flashcard`, `quiz`, `study-set`) and text search.

### 5. Pomodoro Focus Timer
- **Drift-Free Accuracy**: Avoids naive `setInterval` countdown drift by calculating against target timestamp (`endTime = Date.now() + remainingMs`).
- **Modes**: Focus (default 25 min), Short Break (5 min), and Long Break (15 min).
- **Controls**: Start, Pause, Resume, Reset, and Skip.
- **Customizable Settings**: User-configurable durations and long break intervals.
- **Auto Logging**: Completed focus sessions automatically update study statistics, log activities, and increment total focus hours.

### 6. Global Search (`Ctrl+K` / `Cmd+K`)
- Unified command palette searchable across tasks, calendar events, bookmarks, and saved study sets.
- Instant client-side fuzzy keyword matching.
- Keyboard shortcuts (`Ctrl+K` or `Cmd+K` to toggle, `ESC` to dismiss).
- Clickable results that navigate directly to the matching tab and item.

### 7. Student Profile & Verified Statistics
- **Editable Student Profile**: Full Name, Email, Bio, Study Goal, and Avatar Initials.
- **Calculated Metrics**: Real-time stats derived from actual application usage:
  - Current Study Streak (consecutive day calculation)
  - Quiz Retention Accuracy % (`correctAnswers / totalAnswers`)
  - Total Flashcards Reviewed
  - Pomodoro Focus Hours
  - Active vs. Completed Tasks
- **Activity Consistency Log**: Displays distinct recorded study dates.

### 8. AI Study Workspace (Core Experience)
- Accepts up to 5,000 characters of notes, textbook excerpts, or topics.
- **3D Flashcard Flip**: Perspective flip cards with keyboard navigation (`Space` to flip, `←` / `→` arrows).
- **Practice Quiz**: Step-by-step quiz with 4 options, instant visual feedback, and explanations.
- **Exporting**: One-click download of the complete study set as a formatted `.json` file.
- **Diagnostic Mode**: Toggleable simulation buttons for testing malformed JSON, invalid schemas, and server errors live.

---

## 3. Architecture & Project Structure

```text
flam/
├── api/
│   └── generate-study.ts       # Vercel Serverless Function (Production endpoint)
├── server/
│   └── server.ts               # Express Local Proxy (Development server on port 3001)
├── src/
│   ├── components/
│   │   ├── bookmarks/          # BookmarkPage
│   │   ├── calendar/           # CalendarPage, EventModal
│   │   ├── dashboard/          # Dashboard, StatsCard, TodayPlan, QuickActions
│   │   ├── layout/             # Sidebar, Header, MobileNav
│   │   ├── pomodoro/           # PomodoroPage, PomodoroSettingsModal
│   │   ├── profile/            # ProfilePage
│   │   ├── search/             # SearchCommandModal
│   │   ├── states/             # LoadingState, ErrorState, EmptyState
│   │   ├── study/              # StudyInput, Flashcard, FlashcardView, QuizQuestion, QuizView, StudyHeader
│   │   ├── tasks/              # TaskPage, TaskCard, TaskModal
│   │   └── ui/                 # ToastContainer
│   ├── context/
│   │   └── ProductivityContext.tsx # Centralized state provider & activity logger
│   ├── hooks/
│   │   ├── useReducedMotion.ts # Accessibility hook for animation preferences
│   │   └── useStudyGeneration.ts # Request controller, abort & stale protection
│   ├── lib/
│   │   ├── api.ts              # Resilient dual-endpoint client router
│   │   ├── storage.ts          # Typed, versioned localStorage persistence
│   │   └── validateStudyPlan.ts # Zod schema validation & JSON cleaner
│   ├── types/
│   │   ├── productivity.ts     # Strongly typed Task, Event, Bookmark, Profile, Stats
│   │   └── study.ts            # Strongly typed StudyPlan, Flashcard, Quiz
│   ├── App.tsx                 # Root layout with responsive navigation & tab routing
│   ├── index.css               # Design tokens, glassmorphism, 3D card perspective
│   └── main.tsx
├── scripts/
│   └── test-validation.ts      # 31 automated unit tests
├── .env.example
├── vercel.json                 # Vercel serverless deployment routing
└── package.json
```

---

## 4. How AI is Used in StudyAI

As required by the assignment guidelines:

1. **Structured Study Generation**: Gemini is prompted with a strict system instruction requiring a pure JSON payload matching the `StudyPlan` contract.
2. **Defensive Parsing**: Raw responses are stripped of markdown fences (` ```json `), validated against edge-case anomalies (array roots, malformed strings), and sanitized before JSON parsing.
3. **Runtime Schema Validation**: The parsed JSON is validated through Zod (`validateStudyPlan.ts`). If the response fails any schema rule (e.g., missing question, wrong option count, invalid difficulty), it gracefully catches the error and surfaces user remediation.
4. **React State Ownership**: Once validated, React takes complete ownership of interactive state (flipping cards, tracking quiz score, retrying mistakes, bookmarking items, logging statistics).
5. **Development Assistance**: AI tools were utilized during development to pair-program components, craft test cases, and refine TypeScript interfaces.

---

## 5. Automated Test Suite (31 Tests Passing)

The project includes an extensive automated test suite covering both the AI defensive layer and the productivity system:

Run the test suite with:

```bash
npm test
```

### Verified Test Cases:
- **1-16. AI Schema & Defensive Parsing**:
  - Valid StudyPlan happy path
  - Empty response detection
  - Malformed JSON handling without crashing
  - Markdown code fence stripping
  - Array root rejection
  - Missing title rejection
  - Empty flashcards array rejection
  - Question validation & difficulty checks
  - Quiz structure, 4 distinct options, and correct answer validation
  - Multi-question quiz verification
- **17. Stale Request Protection**: Prevents older delayed API responses from overwriting newer generations.
- **18-20. Task Management**: Creation, completion timestamping, filtering (active, high, today), and priority sorting.
- **21-24. Global Search**: Multi-entity keyword matching, deep content search, and empty state returns.
- **25. Pomodoro Drift Prevention**: Timestamp-based computation validation.
- **26-28. Deterministic Study Streak**: Consecutive day chain calculation, gap reset handling, and empty activity states.
- **29. Quiz Accuracy Calculation**: Accurate rounding and zero-attempt guard.
- **30-31. Storage Recovery**: Malformed JSON recovery and version migration fallbacks.

---

## 6. How to Run Locally

### Prerequisites
- Node.js 18+ (Node 20 or 22 recommended)
- Google AI Studio Gemini API Key

### Step 1: Clone and Install
```bash
git clone https://github.com/prajwalsunagar0326-hash/Study-Assistant.git
cd Study-Assistant
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the project root:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

> **Security Note**: Never expose `GEMINI_API_KEY` through client-side `VITE_` variables. The server proxy and Vercel functions keep the key strictly server-side.

### Step 3: Run the Development Server
```bash
npm run dev
```
This runs Vite frontend (`http://localhost:5173`) and the Express proxy (`http://localhost:3001`) concurrently.

### Step 4: Run Tests & Build
```bash
npm test          # Run 31 automated tests
npm run build     # Validate TypeScript & build production bundle
```

---

## 7. How to Deploy to Vercel

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete student productivity platform with dashboard, tasks, calendar, bookmarks, and pomodoro"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Add the Environment Variable in Vercel Project Settings:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
5. Click **Deploy**. Vercel will build the frontend and serve `/api/generate-study` as a serverless function automatically via `vercel.json`.
