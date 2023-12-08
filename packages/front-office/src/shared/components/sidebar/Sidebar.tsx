import { useCallback, useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { HiChartPie, HiInbox, HiUsers, HiViewBoards } from 'react-icons/hi'
import { IconType } from 'react-icons/lib'
import { NavLink } from 'react-router-dom'
import { useStore } from '../../../app/useStore'
import i18next from '../../../i18n'
import { AUTH_COOKIE_NAME } from '../../utils'

const SIDEBAR_ITEMS: { route: string; value: string; icon: IconType; isPublic?: boolean }[] = [
  {
    route: 'dashboard',
    value: i18next.t('components.sidebar.dashboard'),
    icon: HiChartPie,
    isPublic: true,
  },
  {
    route: 'issues',
    value: i18next.t('components.sidebar.issues'),
    icon: HiViewBoards,
  },
  {
    route: 'symptoms',
    value: i18next.t('components.sidebar.symptoms'),
    icon: HiInbox,
  },
  {
    route: 'meds',
    value: i18next.t('components.sidebar.meds'),
    icon: HiInbox,
  },
]

const ADMIN_ITEMS = [
  {
    route: 'users',
    value: i18next.t('components.sidebar.users'),
    icon: HiUsers,
  },
]

export function Sidebar() {
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const { sidebarOpen, setSidebarOpen } = useStore()
  const currentUser = useMemo(() => cookies.auth?.user, [cookies])
  const isAdmin = useMemo(() => cookies.auth?.user.role === 'admin', [cookies.auth?.user.role])

  const handleSidebarVisibility = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen, setSidebarOpen])

  return (
    <>
      <div
        className={`text-center h-full z-30 fixed left-0 top-0 w-full bg-gray-800 bg-opacity-50 overflow-hidden ${
          sidebarOpen ? '' : 'hidden'
        }`}
        onClick={handleSidebarVisibility}
      />

      <aside
        className={`fixed top-0 left-0 z-40 w-56 h-screen pt-20 transition-transform ${
          sidebarOpen ? 'transform-none' : '-translate-x-full'
        } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {SIDEBAR_ITEMS.concat(isAdmin ? ADMIN_ITEMS : []).map(
              ({ icon: Icon, route, value, isPublic }) => {
                const canAccess = currentUser || isPublic
                return (
                  <li
                    key={route}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <NavLink
                      to={`/${route}`}
                      title={!canAccess ? 'You must be logged in to access this page' : undefined}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg dark:text-white hover:text-white hover:bg-cyan-500 group ${
                          !canAccess ? 'hidden' : ''
                        }
                  ${
                    isActive
                      ? 'text-cyan-600 dark:bg-cyan-600 dark:hover:text-white'
                      : 'text-gray-900 dark:hover:bg-cyan-500'
                  }`
                      }
                    >
                      {<Icon />}
                      <span className="ml-3">{value}</span>
                    </NavLink>
                  </li>
                )
              },
            )}
          </ul>
        </div>
      </aside>
    </>
  )
}
