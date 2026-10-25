# CloudPrep AI — Turn your mistakes into mastery.

An unofficial learning companion that helps beginners prepare for the Microsoft Azure Fundamentals (AZ-900) exam through original practice questions, beginner-friendly explanations with African examples, and revision that targets the topics a learner actually gets wrong.

> **Disclaimer:** CloudPrep AI is an independent learning tool. It is not affiliated with or endorsed by Microsoft.

**Live preview:** a copy is published as a claude.ai Artifact at https://claude.ai/artifact/QTbrKynE7WycHEHjX3RWH1. It is private to its owner unless they share it.

## Contents

1. [Problem statement](#1-problem-statement)
2. [Our solution and intended users](#2-our-solution-and-intended-users)
3. [Features currently implemented](#3-features-currently-implemented)
4. [How the learning experience works](#4-how-the-learning-experience-works)
5. [Technology stack](#5-technology-stack)
6. [Project file structure](#6-project-file-structure)
7. [Installation and configuration](#7-installation-and-configuration)
8. [AI server setup](#8-ai-server-setup)
9. [Running and testing](#9-running-and-testing)
10. [Current limitations](#10-current-limitations)
11. [Security considerations](#11-security-considerations)
12. [Future improvements](#12-future-improvements)
13. [Disclaimer](#13-disclaimer)

---

## 1. Problem statement

AZ-900 is an entry-level cloud exam, but beginners often struggle with it for reasons that have little to do with intelligence:

- **Unfamiliar vocabulary.** Terms such as IaaS, availability zones, elasticity and shared responsibility are abstract and easy to confuse.
- **Practice without direction.** A quiz that only reports a score does not tell a learner *which* ideas to revisit or *why* they were wrong.
- **Examples that do not feel familiar.** We wanted explanations rooted in everyday African contexts such as mobile money, hospitals, schools and online shops.
- **Unclear progress.** Learners find it hard to tell whether they are improving or just remembering questions they have already seen.

These are the motivations behind the project. This README does not cite statistics about learner outcomes, and CloudPrep AI has not been evaluated with real learners.

## 2. Our solution and intended users

CloudPrep AI is a single-page web application with a dashboard. Learners take original quizzes, ask a Study Buddy to explain concepts, see which topics their recorded answers suggest they should revise, and retest after revising.

**Intended users:** beginners preparing for AZ-900, especially those who benefit from plain language and familiar African examples.

**Design approach:** a clean white interface with navy text and blue accents, a persistent sidebar for the dashboard, and a layout that adapts to mobile screens (the sidebar becomes a slide-out menu on narrow screens). A dark colour scheme is applied automatically when the device prefers it.

## 3. Features currently implemented

All features below exist in `cloudprep-ai.html`.

| Area | What it does |
|---|---|
| **Landing page** | Hero section, "Get Started" button, three feature cards, a How It Works section and the unofficial-tool disclaimer. No Microsoft logos. |
| **Overview** | Counts of completed quizzes, average score and topics needing revision, plus shortcuts. Shows an empty state for new learners. |
| **Quiz Lab** | Choose a topic (or all), difficulty (any, beginner, intermediate) and question count (3, 5, 10 or 15). One question at a time, instant feedback with an explanation, then a score and a review. The bank holds 36 original questions across 6 topics (6 each), so long quizzes may be shorter than requested. |
| **Quiz records** | Each finished quiz stores the questions, selected answers, correct answers, topic, difficulty, score and date. Records are validated before saving. Older records remain readable. |
| **Weakness Coach** | Analyses recorded answers by topic. A topic is flagged when it has at least 3 answers and under 70% correct. With fewer answers it says there is not enough data. Shows accuracy, answers attempted, concepts linked to incorrect answers, a recommended lesson and a "why this is recommended" explanation. |
| **Revision session** | For a chosen weak topic: a short lesson, then up to 4 practice questions chosen to exclude questions the learner previously got wrong. |
| **Mastery check** | A new quiz (up to 5 questions) on the same topic that compares the result with the learner's earlier recorded accuracy and states how many questions had appeared before. It never claims mastery from one short quiz. |
| **Study Buddy** | Chat-style interface with session history, three learning modes, 12 curated lessons, knowledge checks, optional AI answers and a Quiz Me button (see below). |
| **Study Planner** | Enter an exam date, weekly study hours (1 to 40) and difficult topics to generate an editable week-by-week schedule (up to 12 weeks). Tasks can be ticked, edited, deleted and added. |
| **Progress** | Completed quizzes, questions answered, overall accuracy, the last 10 scores, topic-level performance and history, all from recorded results only. Includes a "practice performance does not guarantee exam success" notice and a reset button. |

### Study Buddy in detail

- **Three learning modes** (switchable at any time):
  - **Explain Simply** shows a short plain-language explanation first.
  - **Real-Life Example** leads with a practical scenario.
  - **Test My Understanding** shows the knowledge check first. The learner chooses an answer and presses Submit, and only then are the correct answer and explanation revealed. There is also a "Skip and reveal" option.
- **Every answer contains:** a plain-language explanation, an analogy (labelled as simplified and not how Azure actually works), a relatable African example, an Azure example, key terms, and an original four-option knowledge check with a correct answer and explanation.
- **12 curated lessons** with suggested prompts: cloud computing and cloud models, IaaS/PaaS/SaaS, regions and availability zones, scalability and elasticity, shared responsibility, cloud pricing, security, governance, the Azure Well-Architected Framework, Azure compute, Azure storage and Azure networking. These are labelled "Curated explanation · not AI".
- **Quiz Me** starts a recorded five-question quiz on the quiz topic related to the answer just studied. **Targeted practice** opens a revision session instead.
- **Send to Weakness Coach** saves a concept the learner chooses to flag. The Coach shows these separately and labels them as the learner's own flags, not measured performance.
- **Personalised suggestions** appear only when recorded quiz results show a weak topic. Otherwise the page says to take a quiz first.
- **Honest AI states:** loading indicator with a Stop button, clear error messages, a Retry button, and an offer to show the curated lesson instead. A failed request is never shown as an AI answer.

Study Buddy knowledge checks are **not** written to quiz records or Progress.

## 4. How the learning experience works

CloudPrep AI is built around a loop we call **Weakness-to-Mastery**. As a product direction it means: *practise, find out what went wrong, revise those ideas, then retest.* The parts that exist today are:

1. **Practise.** The learner completes a quiz in Quiz Lab. Answers are saved with the question text and the concept each question tests.
2. **Diagnose.** The Weakness Coach calculates accuracy per topic from recorded answers only. Topics with fewer than 3 answers are shown as "not enough data" rather than as weak.
3. **Understand.** For each flagged topic the Coach lists the concepts behind missed answers and explains why the topic was recommended.
4. **Revise.** A revision session shows the lesson, then new practice questions that avoid previously missed ones. Revision answers are saved but are not counted in topic accuracy, because the learner has just read the lesson.
5. **Retest.** A mastery check gives a fresh quiz on the topic and shows before and after accuracy, the change in percentage points, and a caution about small samples.

**What this does not include:** adaptive difficulty, spaced repetition, long-term mastery tracking or any claim that a learner has "mastered" a topic. With only 6 questions per topic, a mastery check can repeat earlier questions, and the page says how many.

The Study Buddy plugs into the same loop: a learner can flag a concept for the Coach, start targeted practice, or launch a quiz on what they just studied.

## 5. Technology stack

**Confirmed from the project files:**

| Layer | Technology |
|---|---|
| Frontend | A single HTML file with inline CSS and vanilla JavaScript. No framework, no build step, no package manager and no external scripts, stylesheets, fonts or images. |
| Persistence | Browser `localStorage` (keys prefixed `cp:` for attempts, study plan and flagged concepts), accessed through one `Store` object. |
| AI server | Node.js using only built-in modules (`http`, `fs`, `path`, `url`) and the global `fetch`. No npm dependencies. |
| AI provider | Anthropic Messages API, called by the server with the `anthropic-version: 2023-06-01` header. |
| Published preview | A claude.ai Artifact. On that page, AI answers use the Artifact `sample` capability, which runs through the viewer's own Claude account. |

**Cannot be confirmed:**

- The default model name in the server, `claude-sonnet-5-5`, has not been checked against the live Anthropic API. Set `AI_MODEL` to a model your account can use if it fails.
- The minimum Node.js version. The server's comments say Node 18 or newer, but only a recent Node release was used during development checks.
- Browser compatibility beyond the checks described in [section 9](#9-running-and-testing).
- Any Supabase integration. The storage code is isolated in a `Store` object so a backend could replace it later, but **no Supabase or other backend code exists**.

## 6. Project file structure

```
.
├── README.md                  This file
├── README-AI-SETUP.md         Existing AI setup guide (unchanged)
├── cloudprep-ai.html          The whole application (UI, quiz engine, Study Buddy)
└── cloudprep-ai-server.mjs    Static file host and AI proxy for the Study Buddy
```

Inside `cloudprep-ai.html`, the script is organised in labelled sections:

| Section | Contents |
|---|---|
| Config and storage | `CONFIG.aiEndpoint` and the `Store` adapter over `localStorage` |
| Content | `T` (6 topics), `Q` (36 original questions with concept tags), `CUR` (12 curated lessons) |
| Quiz engine | `buildQuiz`, `badRec` (validation before saving), `tstats`, `status`, `weak` |
| Router and shell | Hash-based navigation and the sidebar layout |
| Views | Overview, Quiz Lab, Study Buddy, Weakness Coach, Study Planner, Progress |
| Learning loop | `startRevision`, `startPractice`, `startMastery`, `quizTopic` |
| Study Buddy AI | `normAI` (response validation), `viaServer`, `viaClaude`, `curatedFor` |

## 7. Installation and configuration

There is nothing to install and no build step.

**Quickest start (curated lessons only):** open `cloudprep-ai.html` in a modern browser. Quiz Lab, Weakness Coach, Study Planner and Progress all work. The Study Buddy uses its curated lessons and labels them as not AI. Data is saved in that browser only.

**With AI answers:** run the included server (next section). It needs Node.js 18 or newer and an Anthropic API key.

## 8. AI server setup

This summarises `README-AI-SETUP.md`, which remains the detailed reference.

1. Put `cloudprep-ai.html` and `cloudprep-ai-server.mjs` in the same folder.
2. Start the server, supplying your key through the environment (never in a file that is committed):
   ```
   ANTHROPIC_API_KEY=your-key-here node cloudprep-ai-server.mjs
   ```
3. Open http://localhost:8787. The server serves the page and points it at `/api/study-buddy` automatically, so no CORS setup is needed.

### Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | none | Your Anthropic API key. Kept only in the server process. |
| `AI_MODEL` | No | `claude-sonnet-5-5` | Model used for answers |
| `PORT` | No | `8787` | Port to listen on |
| `RATE_PER_MIN` | No | `15` | Requests per IP address per minute |
| `ALLOWED_ORIGIN` | No | none | Only needed if the page is hosted on a different origin |
| `ANTHROPIC_API_URL` | No | Anthropic Messages endpoint | Override for the upstream URL, for example to point at a local stand-in during testing |

### API contract

| | |
|---|---|
| Endpoint | `POST /api/study-buddy` |
| Request | `{"question": "..."}` (trimmed and capped at 300 characters; minimum 3) |
| Success | A JSON object with `title`, `simple`, `analogy`, `azureExample`, `realLife`, `terms`, `check`, `topic` and `caveat`, or `{"offTopic": true, "message": "..."}` |
| Errors | `503 not_configured`, `429 rate_limited`, `400 bad_json` / `question_too_short`, `413 too_large`, `502 upstream_error` / `invalid_model_output`, `504 upstream_unreachable` |
| Health | `GET /api/health` returns `{"ok": true, "configured": true or false}` |

If the key is missing, the server returns `503 not_configured` and the page shows a clear error rather than an answer.

## 9. Running and testing

**There is no automated test suite in this repository.** Verify the app manually:

1. Open the app, press **Get Started**, and take a quiz in **Quiz Lab**. Check **Progress** shows the score and history.
2. Answer several questions wrongly on one topic, then open **Weakness Coach** and confirm it explains the recommendation.
3. Start a **revision session**, answer the practice questions, then take the **mastery check** and read the before and after comparison.
4. In **Study Buddy**, ask "What is Azure Blob Storage?" and switch between the three modes. In Test My Understanding, confirm the explanation stays hidden until you submit an answer.
5. Press **Quiz me** under an answer and confirm a five-question quiz starts.

**Checking the server:**

```
curl http://localhost:8787/api/health
```

To exercise the AI route (this sends a real request to Anthropic and uses your API credits):

```
curl -X POST http://localhost:8787/api/study-buddy \
  -H "Content-Type: application/json" \
  -d '{"question":"What is IaaS?"}'
```

**What has been checked so far.** During development, temporary scripts (not included in this repository) were used to check the page logic in a simulated browser and to test the server against a local stand-in for the Anthropic API. They covered the quiz and record validation, the Weakness Coach analysis, the revision and mastery flow, the Study Buddy modes, and error handling for server failures, malformed responses, stopped requests and rate limits. The 60-second client timeout path was not exercised. They also confirmed that the page's own code can call the running server. These checks did not use a real browser or the live Anthropic API.

## 10. Current limitations

- **No real Anthropic response has been verified.** The server has only been tested against a local stand-in. Whether the live API accepts the default model name, and whether real answers always match the expected JSON format, is untested.
- **Small question bank.** 36 questions (6 per topic) limits quiz variety and can cause repeats in revision and mastery checks.
- **Curated content has not been audited line by line.** The lessons were written from general knowledge of Azure documentation and the AZ-900 skill areas, and have not been checked against Microsoft Learn. The Well-Architected Framework lesson is marked supplementary because it could not be confirmed as an explicit AZ-900 skills-outline item. AI answers can also be wrong. Each answer links to the official study guide.
- **Local data only.** There is no sign-in, and results live in one browser's `localStorage`. Clearing browser data or switching device loses them.
- **The published preview cannot call your server.** A claude.ai Artifact page cannot reach other hosts, so server-based AI needs the page hosted by you. In the preview, AI uses the viewer's Claude account after they grant permission, and falls back to curated lessons if they decline.
- **Not tested in a real browser or on real devices.** Responsive layout and accessibility were designed in (labels, live regions and pressed states are used) but have not been formally audited.
- **Curated lessons cover 12 topics.** Questions outside them get an honest "no match" message unless AI is available.
- **Not an exam predictor.** Practice scores do not indicate exam results. This notice is shown in the app.

## 11. Security considerations

- **The API key stays on the server.** It is read from an environment variable and is never sent to the browser or written into the HTML. The page contains no key material.
- **Server protections:** request bodies are limited to 4,000 characters, questions are capped at 300 characters, and requests are rate-limited per IP address (default 15 per minute). Upstream errors are mapped to short codes instead of being forwarded.
- **The AI route has no authentication.** Anyone who can reach the server can use your API credits. Do not expose it to the public internet without adding access control. The rate limiter keys on the connecting address, so behind a reverse proxy all users may share one limit.
- **The page validates AI output.** Responses that are incomplete or malformed are discarded and never displayed, and all rendered text is HTML-escaped.
- **Local data is unencrypted** in `localStorage` and is not shared with a server. The server does not store questions or answers.
- **Privacy:** when AI is used, the learner's question text is sent to Anthropic through your server (or, in the Artifact preview, through the viewer's Claude account). Avoid entering personal information.
- **CORS** is disabled by default and enabled only for the origin set in `ALLOWED_ORIGIN`.

## 12. Future improvements

These are ideas, not implemented features:

- Verify the AI route against the live Anthropic API and confirm a working default model.
- Expand the question bank and add more curated lessons, then review all content against Microsoft Learn.
- Add real accounts and cloud persistence (for example Supabase). The `Store` object is the intended seam, but nothing is implemented.
- Add automated tests and a real-browser accessibility and mobile review.
- Extend the learning loop with spaced repetition and longer-term progress tracking across several mastery checks.
- Add authentication and stronger rate limiting to the AI server before any public deployment.
- Add a licence file (none is included yet).

## 13. Disclaimer

**CloudPrep AI is an independent learning tool. It is not affiliated with or endorsed by Microsoft.** It does not use Microsoft logos, and all quiz questions are original. Microsoft and Azure are trademarks of Microsoft Corporation and are used here only to describe the exam topic. Practice results do not guarantee exam success.
