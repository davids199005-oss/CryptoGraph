import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import './index.css'
import { Layout } from './Components/LayoutArea/Layout/Layout'
import { BrowserRouter } from 'react-router-dom'
import { store } from './Redux/Store'
import { cryptoTheme } from './theme/cryptoTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={cryptoTheme}>
          <CssBaseline />
          <Layout />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
