# CryptoGraph

A modern React app for cryptocurrency analytics: real-time market data, detailed coin pages, chart-based reports, and AI-powered recommendations.

![React](https://img.shields.io/badge/React-19-20232A?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## Features

- Displays top cryptocurrencies with key market metrics.
- Provides detailed coin pages with market information.
- Builds reports and trend charts for selected coins.
- Generates AI recommendations (`buy` / `do not buy`) based on market data.
- Persists selected coins in `localStorage`.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **UI:** MUI + custom neon cyberpunk theme
- **State:** Redux Toolkit + middleware
- **Charts:** Recharts
- **API:** CoinGecko, CryptoCompare, OpenAI

---

## Routes

- `/Home` - main page with the coin list
- `/coins/:coinId` - detailed coin page
- `/Reports` - reports and charts
- `/Recommendations` - AI recommendations
- `/About` - project overview

---

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_OPENAI_API_KEY=your_openai_key
VITE_OPENAI_MODEL=gpt-5-mini
```

### 3) Run the development server

```bash
npm run dev
```

Vite will start a local server (usually `http://localhost:5173`).

---

## Scripts

```bash
npm run dev      # run development server
npm run start    # alias for dev
npm run lint     # ESLint
npm run build    # type-check + production build
npm run preview  # preview production build locally
npm run deploy   # build and publish to GitHub Pages
```

---

## Project Structure

```text
src/
  Components/      # UI components
  Hooks/           # custom React hooks
  Models/          # data models and API types
  Pages/           # page-level components
  Redux/           # store, slices, middleware
  Services/        # API clients and request logic
  Utils/           # utilities and mappers
  Theme/           # MUI theme
```

---

## Deployment (GitHub Pages)

The project already has `base` configured in `vite.config.ts`:

```ts
base: '/CryptoGraph/'
```

To deploy:

```bash
npm run deploy
```

The build also creates `dist/404.html` automatically for proper client-side routing on GitHub Pages.

---

## Important Security Note

- OpenAI is currently called directly from the browser (`dangerouslyAllowBrowser`), which means the API key is exposed on the client side.
- For production, move OpenAI calls to a backend service and keep the API key server-side only.

---

## Roadmap

- [ ] Move OpenAI requests to a backend service
- [ ] Add tests (unit + integration)
- [ ] Improve network error handling and retry strategy
- [ ] Optimize bundle size (lazy routes / code splitting)

---

## Author

**David Veryutin**

If this project is helpful, consider giving it a star.

