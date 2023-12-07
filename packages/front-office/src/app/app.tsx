import { getAuth } from '@firebase/auth'
import { Spinner } from '@nextui-org/react'
import dayjs from 'dayjs'
import 'dayjs/locale/es-us.js'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import { PropsWithChildren, ReactElement, Suspense, lazy, useEffect, useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AUTH_COOKIE_NAME } from '../shared/utils'
import { ErrorPage, RootPage } from './pages'
import LoginPage from './pages/login/LoginPage'
import usePersistStore from './usePersistStore'

const LazyIssuesPage = lazy(() => import('./pages/issues/IssuesPage'))
const LazyMedsPage = lazy(() => import('./pages/meds/MedsPage'))
const LazySymptomsPage = lazy(() => import('./pages/symptoms/SymptomsPage'))
const LazyDashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const LazyUsersPage = lazy(() => import('./pages/users/UsersPage'))

const locales = {
  es: 'es-us',
}

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const [cookies] = useCookies([AUTH_COOKIE_NAME])

  if (!cookies.auth) {
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
  const [cookies] = useCookies([AUTH_COOKIE_NAME])

  if (cookies.auth) {
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
  const [cookies, setCookie] = useCookies([AUTH_COOKIE_NAME])
  const isAdmin = useMemo(() => cookies.auth?.user.role === 'admin', [cookies.auth?.user.role])
  const isEditor = useMemo(() => cookies.auth?.user.role === 'editor', [cookies.auth?.user.role])
  const { i18n } = useTranslation()
  const { setIsSigningIn } = usePersistStore()

  useEffect(() => {
    getAuth().useDeviceLanguage()

    const unsubscribe = getAuth().onAuthStateChanged(user => {
      // here we hide the spinner
      setIsSigningIn(false)

      if (user) {
        const cookieValue = {
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: JSON.parse(user.reloadUserInfo?.customAttributes || '{}').role,
          },
          accessToken: user.accessToken,
        }
        setCookie(AUTH_COOKIE_NAME, cookieValue, { path: '/' })
      } else {
        setCookie(AUTH_COOKIE_NAME, null, { path: '/' })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [setCookie])

  useEffect(() => {
    dayjs.locale(locales[i18n.language])
    dayjs.extend(relativeTime)
    dayjs.extend(timezone)
    dayjs.tz.setDefault('America/Montevideo')
  }, [i18n.language, setCookie])

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
          {(isEditor || isAdmin) && (
            <>
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
            </>
          )}

          {isAdmin && (
            <Route
              path={'/users'}
              element={
                <Suspense
                  children={<LazyUsersPage />}
                  fallback={<Spinner />}
                />
              }
            />
          )}
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
