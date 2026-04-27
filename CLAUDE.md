# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:3000
npm test           # Jest + React Testing Library (watch mode)
npm run build      # Production build to /build
npm run deploy     # Build + deploy to GitHub Pages (gh-pages branch)
```

## Architecture

RunForge is a **monolithic single-page React app** — all application code lives in `src/App.js` (~1,600 lines). There is no React Router; navigation is handled via screen state (`"landing"` → `"auth"` → `"app"`) and a tab state (`track | plans | history | strava`) in the root `RunForge` component.

### Service Layer (in App.js)

**`FirebaseService`** — despite the name, uses Supabase exclusively. Handles auth (signUp, signIn, signOut, resetPassword) and database operations (savePlan, loadPlan, saveRun, loadRuns, saveCompletedWorkouts, saveStravaTokens). All DB calls use the Supabase JS client with RLS-enforced user isolation.

**`StravaService`** — Strava OAuth 2.0 integration. Token exchange/refresh goes through a Cloudflare Worker (`STRAVA_TOKEN_WORKER_URL`) to work around CORS. Handles activity upload, GPX attachment, and auto-sync logic.

### Key Globals (top of App.js)

- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — Supabase project credentials
- `STRAVA_CLIENT_ID`, `STRAVA_TOKEN_WORKER_URL` — Strava integration config
- These are currently hardcoded and must be replaced per environment

### Theme System

`ThemeContext` provides a `theme` object (either `LIGHT` or `DARK`) to all components. UI components consume theme via `useContext(ThemeContext)` and apply values as inline styles. `TYPE_COLORS` maps workout types (Easy Run, Intervals, Tempo, etc.) to colors for visualization.

### Data Models

```js
// Run
{ id, date, duration, distance, avgPace, workoutType, coords: [{lat, lng, alt, time}] }

// Training Plan
{ id, name, distance, level, weeks, workouts: [{week, day, type, distance, notes}] }

// Strava Integration  
{ access_token, refresh_token, expires_at, athlete, autoUpload }
```

### GPS / Utility Functions

- `haversine(lat1, lon1, lat2, lon2)` — distance between coordinates
- `formatPace(kmh)` — converts km/h to MM:SS string
- `formatDur(seconds)` — converts seconds to HH:MM:SS
- `genGPX(coords)` — generates GPX XML from coordinate array

### Database Schema

Supabase tables: `profiles`, `plans`, `runs`, `progress`, `integrations`. The SQL schema for initialization is documented in the comment block at the top of `App.js` (lines ~18–74).

## Deployment

Deploys to GitHub Pages via `npm run deploy`. The `homepage` field in `package.json` must be set to the correct GitHub Pages URL before deploying.
