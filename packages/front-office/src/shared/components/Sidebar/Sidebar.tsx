import { HiChartPie, HiInbox, HiViewBoards } from 'react-icons/hi'
import { IconType } from 'react-icons/lib'
import { NavLink } from 'react-router-dom'

const SIDEBAR_ITEMS: { route: string; value: string; icon: IconType }[] = [
  {
    route: 'dashboard',
    value: 'Dashboard',
    icon: HiChartPie,
  },
  {
    route: 'issues',
    value: 'Issues',
    icon: HiViewBoards,
  },
  {
    route: 'symptoms',
    value: 'Symptoms',
    icon: HiInbox,
  },
  {
    route: 'meds',
    value: 'Meds',
    icon: HiInbox,
  },
]

export default function Sidebar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-56 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {SIDEBAR_ITEMS.map(({ icon: Icon, route, value }) => (
            <li key={route}>
              <NavLink
                to={`/${route}`}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg dark:text-white hover:text-white hover:bg-cyan-500 group
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
          ))}
        </ul>
      </div>
    </aside>
  )
}
