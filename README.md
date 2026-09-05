# Skill DNA

A developer profile tool that turns a GitHub username into a verified skill snapshot — real repos, real language breakdown, and (when authenticated) a full contribution activity heatmap. Built to explore the idea that a developer's GitHub history is a stronger signal than a resume.

**Live app:** https://skill-dna-kappa.vercel.app
**Backend:** https://skill-dna-2sqj.onrender.com

## What it does

- Search any GitHub username and pull their real public profile, repos, and language stats via the GitHub REST API
- Visualize language usage as a donut chart (Recharts)
- Browse pinned/public repos in a responsive card grid
- Sign in with GitHub (OAuth) to unlock authenticated data: a GraphQL-powered contribution heatmap, pinned repositories, commit/PR activity metrics
- Automatic token refresh — no need to re-authenticate every session
- Loading states, network timeouts, and graceful error handling throughout

## Tech stack

**Frontend**
- React (Vite)
- Recharts for data visualization
- Plain CSS with custom properties (no framework)

**Backend**
- Node.js + Express
- Handles the GitHub OAuth token exchange and refresh flow (kept server-side to protect the client secret)

**APIs**
- GitHub REST API — public profile and repo data
- GitHub GraphQL API — authenticated contribution calendar and pinned repos
- GitHub OAuth — user authentication

**Deployment**
- Frontend on Vercel
- Backend on Render

## How it works

1. A search hits the GitHub REST API directly from the browser for public profile and repo data.
2. Repo languages are tallied client-side and rendered as a donut chart.
3. If the user is logged in, a second request goes to the GitHub GraphQL API (via a short-lived OAuth access token) for contribution and pinned-repo data.
4. All OAuth token exchanges — including refreshing an expired access token — happen through a small Express backend, so the GitHub client secret never touches the browser.

## Running locally

**Frontend**
```bash
git clone https://github.com/caesar926/skill-dna
cd skill-dna
npm install
npm run dev
```

**Backend**
```bash
git clone https://github.com/caesar926/skill-dna-server
cd skill-dna-server
npm install
```
Create a `.env` file with:
```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```
Then:
```bash
node server.js
```

## What I learned building this

This was also a project to learn React from the ground up — starting from a single search input and button, through `useState`/`useEffect`, lifting state, working with REST and GraphQL APIs, building a full OAuth login flow with token refresh, and deploying a two-service app (frontend + backend) to production.

## Possible next steps

- Sort/filter repos by stars or language
- A full year-round contribution graph (currently limited by GitHub API scope)
- "Post a job" and recruiter-facing views
