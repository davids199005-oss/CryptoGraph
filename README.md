# CryptoGraph

**Cryptocurrency market dashboard** with real-time charts, detailed coin views, and AI-powered buy/sell recommendations.

**Live:** [https://davids199005-oss.github.io/CryptoGraph/](https://davids199005-oss.github.io/CryptoGraph/)

---

## Features

| Feature | Description |
|--------|-------------|
| **Market overview** | Top cryptocurrencies with search, multi-currency prices (USD, EUR, ILS), and selection (up to 5 coins) |
| **Coin details** | Full page per coin: market data, supply, ATH/ATL; loads from API when opening a direct link |
| **Reports** | Real-time line chart and report cards for selected coins (CryptoCompare, 10s refresh) |
| **AI recommendations** | GPT-based buy / do not buy advice with short reasoning (optional, requires OpenAI API key) |
| **Persistence** | Selected coins saved to `localStorage` and restored on reload |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **UI** | React 19, React Router 7, MUI 6, Recharts |
| **State** | Redux Toolkit (coins list, selected coins, search) |
| **Data** | Axios, CoinGecko API, CryptoCompare API |
| **AI** | OpenAI API (gpt-5-mini by default) |
| **Build** | Vite 7, TypeScript 5.9 |

---

## Project structure

```
src/
├── Components/     # UI: Layout, PageArea (Home, Reports, Recommendations, About), CoinsArea
├── Hooks/          # useCoinDetails, useReportsData, useRecommendations
├── Redux/          # Store, slices (coins, selectedCoins, search), middleware (persist)
├── Services/       # CoinsService, OpenAiService
├── Utils/           # AppConfig, PriceFormatter, coinDetailsMapper, LocalStorageUtils
├── Models/         # CoinsModel, ApiTypes
└── theme/          # MUI crypto theme (neon cyan/magenta, dark)
```

---

## Getting started

### Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm)

### Install

```bash
git clone <repo-url>
cd CryptoGraph
npm install
```

### Environment variables

Create a `.env` file in the project root:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENAI_API_KEY` | For AI recommendations | Your OpenAI API key |
| `VITE_OPENAI_MODEL`   | No (default: `gpt-5-mini`) | Model name for recommendations |

Without `VITE_OPENAI_API_KEY`, the app runs normally; the Recommendations page will show a message to add the key.

### Run

```bash
# Development
npm start
# or
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

Open **http://localhost:5173** (or the port Vite prints). Default route redirects to `/Home`.

### Deploy (GitHub Pages)

The app is configured for GitHub Pages with base path `/CryptoGraph/`. To deploy:

1. In repo **Settings → Pages** set **Source** to **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**.
2. Run:

```bash
npm run deploy
```

This builds the project and pushes the `dist` output to the `gh-pages` branch. The site will be available at `https://<username>.github.io/CryptoGraph/`.

---

## API usage

- **CoinGecko** — list, details, simple price (no key for public endpoints).
- **CryptoCompare** — batch USD prices for the Reports chart (no key for used endpoint).
- **OpenAI** — recommendations only when `VITE_OPENAI_API_KEY` is set.

---

## License

MIT 
Copyright © 2026 David Veryutin. 
Data provided by CoinGecko and CryptoCompare APIs.
