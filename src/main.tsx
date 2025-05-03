import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { createTheme, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient()
const theme = createTheme({
  palette: {
    mode: 'light',
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={3}>
				<App />
			</SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
