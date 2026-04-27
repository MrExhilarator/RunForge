# RunForge

A free, browser-based running companion. Pick a training plan, track your runs with live GPS, and sync to Strava — no subscriptions, no paywalls.

**Live:** https://MrExhilarator.github.io/RunForge

## Features

- Preset training plans for 5K, 10K, Half Marathon, and Marathon, plus a custom plan builder
- Live GPS tracking with real-time pace, distance, and progress against the day's workout
- Run history with splits, totals, and per-run GPX export
- Strava OAuth: one-click connect, manual upload, or auto-upload after each run
- Light and dark themes
- Supabase auth and storage so plans, runs, and integrations follow you across devices

## Tech stack

- React 19 (Create React App)
- Supabase (auth + Postgres + RLS)
- Strava API via a Cloudflare Worker for the token exchange
- `gh-pages` for deployment

## Prerequisites

- Node 24 (`.nvmrc` is set; run `nvm use` in this directory)
- A Supabase project, a Strava API app, and a deployed Cloudflare Worker — see [SETUP.md](SETUP.md)

## Getting started

```bash
nvm use
npm install
npm start
```

The dev server runs at http://localhost:3000/runforge.

Before the app is functional end-to-end, fill in the four placeholders in [src/config.js](src/config.js):

- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — from your Supabase project
- `STRAVA_CLIENT_ID` — from your Strava API app
- `STRAVA_TOKEN_WORKER_URL` — your deployed Cloudflare Worker

The Supabase SQL schema lives in [SETUP.md](SETUP.md).

## Scripts

| Command         | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `npm start`     | Run the dev server with hot reload                         |
| `npm run build` | Produce an optimized production bundle in `build/`         |
| `npm test`      | Run the Jest test runner in watch mode                     |
| `npm run deploy`| Build, then publish `build/` to the `gh-pages` branch      |

## Project structure

```
src/
├── App.js                  # Root component, screen routing, user data orchestration
├── config.js               # Supabase + Strava URLs and keys
├── supabaseClient.js       # Supabase client singleton
├── theme.js                # LIGHT / DARK palettes, ThemeContext, TYPE_COLORS
├── styles.js               # Shared inline-style helpers (card, tag, bigBtn, …)
├── utils.js                # haversine, formatPace, formatDur, genGPX
├── data/presetPlans.js     # 5K / 10K / HM / Marathon plan definitions
├── services/
│   ├── authService.js      # Sign-in/up, profile + plan + run + Strava-token storage
│   └── stravaService.js    # OAuth exchange, refresh, upload, recent activities
└── components/
    ├── LandingPage.js      # Marketing page (pre-auth)
    ├── AuthScreen.js       # Email/password sign-in and sign-up
    ├── PlansBrowser.js     # Preset preview + custom plan builder
    ├── TrackScreen.js      # Live GPS run tracking
    ├── HistoryScreen.js    # Past runs and stats
    └── StravaScreen.js     # Strava OAuth, upload, recent activities
```

## Deployment

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch. Make sure the `homepage` field in [package.json](package.json) matches your Pages URL, and that GitHub Pages is enabled in repo settings (Settings → Pages → Source: `gh-pages` branch).
