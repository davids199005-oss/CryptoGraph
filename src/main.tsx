/**
 * Application entry point. Mounts the React app with Redux, router, and MUI theme.
 * basename="/CryptoGraph" is required for GitHub Pages deployment.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import './index.css'
import { Layout } from './Components/LayoutArea/Layout/Layout'
import { BrowserRouter } from 'react-router-dom'
import { store } from './Redux/Store'
import { cryptoTheme } from './Theme/cryptoTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/CryptoGraph">
        <ThemeProvider theme={cryptoTheme}>
          <CssBaseline />
          <Layout />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
