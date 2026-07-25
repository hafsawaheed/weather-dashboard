# Architecture Decisions

## Stable domain model

Raw OpenWeather responses are converted into a single weather model inside `weatherService.js`. Components do not know whether data came from One Call 3.0 or the standard forecast endpoint. This keeps API-plan differences out of the rendering layer.

## Narrow global state

Only preferences that must be shared broadly are stored in Context. Request state remains local to the dashboard workflow, avoiding broad context updates and unnecessary rerenders.

## Resilient request lifecycle

Forecast and search requests use independent abort controllers. A new request cancels the older request in the same workflow so stale responses cannot overwrite newer user selections.

## Progressive delivery

The chart module is split with `React.lazy`. Core weather details render without waiting for Recharts to load, while a chart-specific skeleton preserves layout stability.

## Accessibility defaults

Interactive controls use semantic buttons, visible focus rings, descriptive labels, keyboard listbox navigation, live status regions, reduced-motion handling, and sufficient text contrast in both themes.

## Security boundary

The browser build reads a Vite environment variable because this is a frontend portfolio project. A real production system should proxy weather requests through a controlled backend to avoid exposing a provider credential.
