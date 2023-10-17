import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/error/ErrorPage'
import { RootPage } from './pages/root/RootPage'
import { WelcomePage } from './pages/welcome/WelcomePage'

const LazyIssuesPage = lazy(() => import('./pages/issues/IssuesPage'))
const LazyMedsPage = lazy(() => import('./pages/meds/MedsPage'))
const LazySymptomsPage = lazy(() => import('./pages/symptoms/SymptomsPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: '/issues',
        element: <Suspense children={<LazyIssuesPage />} />,
      },
      {
        path: '/meds',
        element: <Suspense children={<LazyMedsPage />} />,
      },
      {
        path: '/symptoms',
        element: <Suspense children={<LazySymptomsPage />} />,
      },
    ],
  },
])

const App = () => <RouterProvider router={router} />

export default App
