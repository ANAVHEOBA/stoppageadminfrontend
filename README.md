# Stoppage Admin Frontend

Admin operations console for **Stoppage** on **X Layer**.

This app is built for operating sports prediction markets at tournament scale, not just manually creating one market at a time.

## What this app does

- create sports event shells
- create structured match bundles with matchup metadata
- generate catalog-driven child markets for a fixture
- upload and update team images
- publish event shells and event markets
- set prices
- bootstrap liquidity for one market or an entire event
- manage resolution and market operations

The admin surface is one of the main differentiators in the project because it makes World Cup-scale market operations practical during a live event cycle.

## Tech stack

- SolidStart
- SolidJS
- TypeScript
- Vite

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Environment

Create `.env` from `.env.example` and point the console at the backend admin API.

## Related repos

- Root submission overview: [`../README.md`](../README.md)
- Public frontend: [`../stoppagefrontend`](../stoppagefrontend)
- Backend API: [`../stoppagebackend`](../stoppagebackend)
- Contracts: [`../stoppagecontract`](../stoppagecontract)
