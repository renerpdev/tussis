import { getAuth } from '@firebase/auth'
import { lazy, PropsWithChildren, ReactElement, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage, ErrorPage, RootPage } from './pages'
import LoginPage from './pages/login/LoginPage'
import { usePersistedStore } from './useStore'

const LazyIssuesPage = lazy(() => import('./pages/issues/IssuesPage'))
const LazyMedsPage = lazy(() => import('./pages/meds/MedsPage'))
const LazySymptomsPage = lazy(() => import('./pages/symptoms/SymptomsPage'))

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
          element={
            <ProtectedRoute>
              <RootPage />
            </ProtectedRoute>
          }
        >
          <Route
            index
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
            element={<DashboardPage />}
          />
          <Route
            path={'/issues'}
            element={<Suspense children={<LazyIssuesPage />} />}
          />
          <Route
            path={'/meds'}
            element={<Suspense children={<LazyMedsPage />} />}
          />
          <Route
            path={'/symptoms'}
            element={<Suspense children={<LazySymptomsPage />} />}
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
