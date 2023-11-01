import { NextUIProvider } from '@nextui-org/react'
import 'flowbite'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './app/app'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000000, // sale time set to 5 mins,
      retry: 1,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <NextUIProvider>
        <App />
        <ToastContainer
          position={'bottom-right'}
          draggablePercent={60}
          autoClose={2000}
        />
      </NextUIProvider>
    </StrictMode>
  </QueryClientProvider>,
)
