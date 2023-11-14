import { getAuth } from '@firebase/auth'
import { Spinner } from '@nextui-org/react'
import { lazy, PropsWithChildren, ReactElement, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorPage, RootPage } from './pages'
import LoginPage from './pages/login/LoginPage'
import { usePersistedStore } from './useStore'

const LazyIssuesPage = lazy(() => import('./pages/issues/IssuesPage'))
const LazyMedsPage = lazy(() => import('./pages/meds/MedsPage'))
const LazySymptomsPage = lazy(() => import('./pages/symptoms/SymptomsPage'))
const LazyDashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { currentUser } = usePersistedStore()

  if (!currentUser) {
    return (
      <Navigate
        to={'/login'}
        replace
      />
    )
  }

  return children as ReactElement
}
const UnProtectedRoute = ({ children }: PropsWithChildren) => {
  const { currentUser } = usePersistedStore()

  if (currentUser) {
    return (
      <Navigate
        to={'/'}
        replace
      />
    )
  }

  return children as ReactElement
}

const App = () => {
  const { setCurrentUser } = usePersistedStore()

  useEffect(() => {
    getAuth().useDeviceLanguage()

    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setCurrentUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [setCurrentUser])

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          errorElement={<ErrorPage />}
          path={'/'}
          element={
            <ProtectedRoute>
              <RootPage />
            </ProtectedRoute>
          }
        >
          <Route
            path={'/'}
            element={
              <Navigate
                to={'/dashboard'}
                replace
              />
            }
          />
          <Route
            index
            path={'/dashboard'}
            element={
              <Suspense
                children={<LazyDashboardPage />}
                fallback={<Spinner />}
              />
            }
          />
          <Route
            path={'/issues'}
            element={
              <Suspense
                children={<LazyIssuesPage />}
                fallback={<Spinner />}
              />
            }
          />
          <Route
            path={'/meds'}
            element={
              <Suspense
                children={<LazyMedsPage />}
                fallback={<Spinner />}
              />
            }
          />
          <Route
            path={'/symptoms'}
            element={
              <Suspense
                children={<LazySymptomsPage />}
                fallback={<Spinner />}
              />
            }
          />
        </Route>
        <Route
          index
          path={'/login'}
          element={
            <UnProtectedRoute>
              <LoginPage />
            </UnProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
