# Skill DNA

A developer credibility platform that turns a GitHub account into a verified, scored profile — real activity, real repos, real contribution history — instead of a self-reported résumé.

**Live app:** https://skill-dna-kappa.vercel.app
**Backend API:** https://skill-dna-2sqj.onrender.com (source repository is private)

## What it does

- **Search any public GitHub username** from the homepage and see a live snapshot of their activity, languages, and pinned repos — no login required to search.
- **Proof-of-Work score** — a 5-factor score (coding consistency, community impact, technical breadth, project quality, open-source contribution) computed from real GitHub signals: commits, PRs, followers, stars, forks, repo descriptions, language spread, and external open-source contributions.
- **Claim your profile** with GitHub OAuth to unlock your full `/u/:username` page: your 5-factor breakdown, a contribution heatmap, and pinned repos, refreshed automatically (hourly) every time you view it.
- **AI-powered improvement suggestions** — for any score under 80, an AI model reads the raw signals behind it and generates one concrete, actionable suggestion per weak factor (e.g. "add descriptions to your repos"), shown inline next to the relevant score card.
- **Share a profile** with a one-click copy-link button.
- **Login required to view any `/u/:username` page** — visiting your own profile refreshes it live via the claim flow; visiting someone else's shows their last-claimed data.
- A dark, GitHub-inspired UI, including an animated, pausable marquee of example developer profiles on the homepage with live scores.

## Tech stack

**Frontend**
- React (Vite), React Router
- Plain CSS with custom properties (no framework) — dark theme, GitHub-style accent green

**Backend**
- Node.js + Express
- Supabase (Postgres) for caching claimed profiles
- `express-session` for login sessions and `express-rate-limit` for per-user request limits
- GitHub OAuth (login + claim flow) and a dedicated GitHub Personal Access Token (for anonymous public search, so search traffic isn't rate-limited per visitor)
- Google Gemini API for AI-generated improvement suggestions (isolated behind a single function so the provider can be swapped later)

**APIs**
- GitHub GraphQL API — profile, repo, and contribution data (both OAuth-authenticated and PAT-authenticated paths)
- GitHub OAuth — user authentication and profile claiming
- Google Gemini — AI suggestion generation

**Deployment**
- Frontend on Vercel
- Backend on Render

## How it works

1. **Anonymous search** (homepage → `/results`) hits a backend route authenticated with a server-side GitHub token, not the visitor's own — so search isn't limited by GitHub's 60-req/hour public rate limit, and no login is required to look someone up.
2. **Claiming** (GitHub OAuth) proves you own a GitHub account and caches your GraphQL + repo-signal data in Supabase, with a 1-hour freshness window before it's automatically re-fetched.
3. **`/u/:username` pages require login.** The backend checks the login session on every profile and suggestions request and returns `401` otherwise, so the requirement is enforced on the server, not just in the UI. Visiting your own profile always re-runs the claim flow (so it's fresh at most hourly); visiting someone else's just reads their existing cached row — if they've never claimed, you'll see a "not claimed yet" message instead.
4. **Scoring happens only on the backend.** The server computes the five factor scores and the final score and sends them to the browser as a ready-made `scores` object, so the scoring logic never ships in the frontend bundle. The same scores also tell the AI suggestions route which factors are weak before it builds its prompt.
5. **Rate limiting.** Profile requests and AI suggestion requests are limited per logged-in user, which protects the Gemini quota without penalising people who share a network.
6. **AI suggestions** are generated on demand: the backend filters a profile's factors to whichever scored under 80, builds a prompt with the raw signals behind each one, and asks Gemini for one suggestion per factor as structured JSON.

## Running locally

**Frontend**
```bash
git clone https://github.com/caesar926/skill-dna
cd skill-dna
npm install
npm run dev
```
In development the frontend talks to a backend on `http://localhost:3001`; production builds use the deployed backend.

**Backend** (the backend repository is private, so this section is for the maintainer)
```bash
cd skill-dna-server
npm install
```
Create a `.env` file next to `server.js` with:
```
SESSION_SECRET=your_session_secret
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/auth/callback
FRONTEND_URL=http://localhost:5173
GITHUB_PAT=your_personal_access_token
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_service_key
```
Then:
```bash
node server.js
```
Never commit `.env`; make sure it is listed in `.gitignore`. For local login, register a separate GitHub OAuth app whose callback URL is `http://localhost:3001/auth/callback`, since one OAuth app only supports one callback URL.

## What I learned building this

Started as a single search box and grew into a two-service product: OAuth login and token refresh, GraphQL vs. REST API design trade-offs, caching strategy (Supabase + freshness windows) to avoid hammering a third-party API's rate limits, designing a multi-factor scoring model against a real product spec, prompting an LLM for structured, grounded output rather than generic text, and the everyday realities of shipping — CORS across local/prod environments, React state and effect timing bugs, and coordinating a frontend and backend deployed as two separate services.

## Possible next steps

- Recruiter-facing discovery and search (intentionally deferred until real user/profile numbers justify it)
- An AI-generated developer summary for that future recruiter view
- Sort/filter repos by stars or language
- A persistent session store (current sessions live in memory and reset on every backend redeploy)
- Rate limiting on the public search route
- A proper logo and homepage visual identity pass
