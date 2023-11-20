import { NextUIProvider } from '@nextui-org/react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'flowbite/dist/flowbite.min.js'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './app/app'

dayjs.locale('es')
dayjs.extend(relativeTime)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // sale time set to `never` to avoid re-fetching data
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
