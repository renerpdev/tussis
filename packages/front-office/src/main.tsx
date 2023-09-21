import { NextUIProvider } from '@nextui-org/react'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import App from './app/app'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000000, // sate time set to 5 mins
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </BrowserRouter>
    </StrictMode>
  </QueryClientProvider>,
)
