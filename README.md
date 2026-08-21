# NextHire AI

Resume-based mock interviews with AI interviewer avatars, natural voices, target-role practice, and scored performance reports.

Upload a PDF resume, pick an interviewer, optionally paste a job description, and run a live voice (or typed) mock interview. Questions are grounded in your skills, projects, and experience — not generic filler. After the session you get per-answer scores, a radar breakdown, and an improvement roadmap.

## Features

- **Resume-driven questions** — PDFs are parsed and structured into skills, experience, and projects. Every question ties back to that context.
- **Interviewer avatars** — Five personas with distinct voices and styles (Monica, Marcus, Elena, James, Priya).
- **Target role practice** — Save a job posting and practice questions that cross-reference your resume with the role. Reports include a job-fit score and gap analysis.
- **Live voice interviews** — Zoom-style call UI with Groq Orpheus TTS and browser speech recognition, plus typed answers as a fallback.
- **Adaptive difficulty** — Sessions start at junior and move between junior / mid / senior based on recent scores.
- **Session controls** — Answer length (short / medium / long), tone (professional / conversational / technical / friendly), and question count (1–15, default 8).
- **Scored reports** — Technical correctness, depth, clarity, and confidence per answer, plus a final summary, strengths, weak areas, and a roadmap.

## How it works

1. **Register / log in** — Email and password; sessions use an HTTP-only JWT cookie.
2. **Upload a resume** — PDF up to 5 MB. Text is extracted and structured with Groq.
3. **Configure the session** — Choose an avatar, optional target role, and interview settings (or use defaults from Settings).
4. **Go live** — Speak or type answers. Each answer is scored; difficulty can adjust mid-session.
5. **Review the report** — Scores, feedback, and job-fit insights when a target role was selected.

## Tech stack

| Layer | Stack |
| --- | --- |
| App | [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4 |
| Database | MongoDB via Mongoose |
| Auth | bcrypt password hashing, JWT (`jose`), HTTP-only cookie |
| LLM | Groq — Llama 3.3 70B (primary), Llama 3.1 8B Instant (fast / fallback) |
| Speech | Groq Orpheus TTS (`canopylabs/orpheus-v1-english`); Web Speech API for recognition |
| Resume parse | `pdf-parse` |

## Prerequisites

- Node.js 20+
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Groq](https://console.groq.com/) API key with access to chat and Orpheus TTS

Voice interviews work best in Chrome or Edge (Web Speech API).

## Getting started

```bash
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/nexthire
JWT_SECRET=replace-with-at-least-16-characters
GROQ_API_KEY=gsk_your_groq_api_key
```

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signing secret, minimum 16 characters |
| `GROQ_API_KEY` | Yes | Used for interview chat, scoring, resume structuring, and TTS |

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## App map

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing |
| `/login`, `/register` | Auth |
| `/dashboard` | Overview: resume count, interviews, average score |
| `/resumes` | Upload and manage PDFs; start an interview |
| `/target-roles` | Saved job descriptions |
| `/avatars` | Interviewer roster |
| `/interviews` | Session history and reports |
| `/interview/[sessionId]` | Live voice interview |
| `/settings` | Default avatar, length, tone, question count, training context |

Protected routes require a signed-in user (`middleware.ts`).

## Interviewer avatars

| Avatar | Role | Style |
| --- | --- | --- |
| Monica | Engineering Manager | Calm, encouraging |
| Marcus | Staff Engineer | Direct, high bar |
| Elena | Principal Architect | Precise, systems-focused |
| James | Talent Partner | Conversational, puts you at ease |
| Priya | VP of Engineering | Leadership and impact |

Each avatar maps to a Groq Orpheus voice and stays in character for the full session.

## Project layout

```
app/                 Pages and API routes
components/          UI, interview call, marketing, layout
lib/                 Auth, Groq client, MongoDB, avatars, speech helpers
models/              User, Resume, JobDescription, InterviewSession
services/            Interview, evaluation, reports, resume parse, TTS
```

API surface lives under `app/api/`: auth, resume upload, job descriptions, interview start/answer, settings, and TTS.
