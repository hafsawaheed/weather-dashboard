# SkyCloudy Weather Dashboard

A production-oriented weather dashboard built with React 19, Vite, Tailwind CSS, Axios, Framer Motion, Recharts, React Icons, Context API, browser geolocation, and local storage.

## Highlights

- Current conditions with location-aware date and time
- Humidity, pressure, visibility, wind, cloud cover, sunrise, sunset, and UV cards
- Hourly outlook and five-day forecast
- Lazy-loaded temperature and humidity charts
- Debounced location search with keyboard navigation
- Browser geolocation with a safe default-location fallback
- Persistent favorite cities, theme, and unit preference
- Dynamic weather and day/night backgrounds
- Loading skeletons, error recovery, empty states, and an application error boundary
- Responsive, mobile-first glassmorphism interface
- Abortable requests to prevent stale search and forecast updates
- Reduced-motion support and visible keyboard focus states

## Requirements

- Node.js 20.19+ or 22.12+
- An OpenWeather API key

## Installation

```bash
npm install
cp .env.example .env
```

Add the API key to `.env`:

```env
VITE_OPENWEATHER_API_KEY=replace_with_your_key
```

Start the development server:

```bash
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

Run static analysis:

```bash
npm run lint
```

## API Behavior

The service layer always loads OpenWeather's current weather and five-day forecast endpoints. It also attempts One Call 3.0 for true hourly data, daily data, and UV index.

When One Call 3.0 is unavailable for the API subscription, the interface remains functional:

- Hourly cards use the standard three-hour forecast intervals.
- Five-day cards are aggregated from forecast entries.
- UV index is shown as unavailable rather than estimated.

This avoids presenting invented weather values and keeps the application compatible with common OpenWeather plans.

## Architecture

```text
src/
├── api/                  # Axios client configuration
├── assets/               # Bundled brand assets
├── components/
│   ├── common/           # Error, empty, and section primitives
│   ├── layout/           # Navbar, shell, and footer
│   ├── ui/               # Glass card, motion, skeleton, icon button
│   └── weather/          # Domain presentation components
├── constants/            # App, units, endpoints, storage keys
├── context/              # Theme, favorites, and settings providers
├── hooks/                # Weather, storage, debounce, clock, geolocation
├── pages/                # Dashboard orchestration
├── services/             # API requests and response normalization
├── styles/               # Tailwind import and global visual system
├── utils/                # Date, formatting, storage, weather helpers
├── App.jsx
└── main.jsx
```

### State boundaries

- `ThemeContext` owns only the light/dark preference.
- `FavoritesContext` owns only locally saved cities.
- `SettingsContext` owns only global unit preferences.
- Forecast data, request status, errors, and search results remain inside `useWeather` because they belong to the dashboard workflow rather than global application state.

### Data flow

1. `DashboardPage` requests browser coordinates on first load.
2. `useWeather` delegates network work to `weatherService`.
3. `weatherService` calls OpenWeather and normalizes all responses into one stable UI model.
4. Presentation components receive normalized data and never depend on raw API response shapes.
5. Changing units refetches the latest coordinates without resetting the whole interface.

### Performance choices

- `WeatherCharts` is loaded with `React.lazy` and `Suspense` so Recharts is excluded from the initial dashboard chunk.
- Axios requests use `AbortController` to cancel stale forecast and autocomplete requests.
- Derived statistic and chart models use memoization.
- Weather cards use stable normalized objects and small, single-purpose components.
- Animations honor the user's reduced-motion preference.

## Environment and API-key security

Vite variables prefixed with `VITE_` are compiled into browser code. For a public portfolio demo, configure domain and usage restrictions where the provider supports them and monitor usage.

For a commercial deployment, place OpenWeather calls behind a serverless function or backend proxy so the provider key is not shipped to the browser. Never commit `.env` or `.env.local`.

## Vercel Deployment

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Keep the detected framework preset as **Vite**.
4. Add `VITE_OPENWEATHER_API_KEY` under Project Settings → Environment Variables.
5. Deploy. Vercel will run `npm run build` and publish `dist`.

The included `vercel.json` explicitly identifies the Vite framework. The application does not require route rewrites because it currently has a single dashboard route.

## Main Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Generate production assets |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint across JavaScript and JSX |

## Suggested Improvements

- Add a serverless API proxy and server-side caching.
- Add unit and component tests with Vitest and Testing Library.
- Add end-to-end coverage with Playwright.
- Add severe-weather alerts when the subscribed API plan provides them.
- Add recent searches and command-palette navigation.
- Add internationalization and locale-aware units.
- Add air-quality, precipitation, and weather-map modules.
- Add offline caching with a service worker.
- Add observability for API latency, failures, and client exceptions.

## Portfolio Notes

This repository is intentionally structured to demonstrate separation of concerns: components render, hooks coordinate behavior, contexts own narrow global preferences, and services handle external data. The fallback forecast path is a deliberate reliability feature rather than duplicated UI logic.
