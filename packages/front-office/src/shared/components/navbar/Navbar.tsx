import { getAuth } from '@firebase/auth'
import { Chip } from '@nextui-org/react'
import { Avatar, DarkThemeToggle, Dropdown, Navbar as FNavbar } from 'flowbite-react'
import { useCallback, useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { HiLogout, HiMenu, HiUser } from 'react-icons/hi'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStore } from '../../../app/useStore'
import { AUTH_COOKIE_NAME } from '../../utils'

export const Navbar = () => {
  const navigate = useNavigate()
  const { sidebarOpen, setSidebarOpen } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth?.user, [cookies])
  const userRole = useMemo(() => currentUser.role, [currentUser])
  const { t: tNav } = useTranslation('translation', {
    keyPrefix: 'components.navbar',
  })
  const { t: tProfile } = useTranslation('translation', {
    keyPrefix: 'profile',
  })
  const { t: tApp } = useTranslation('translation', {
    keyPrefix: 'app',
  })

  const handleSignOut = useCallback(async () => {
    try {
      await getAuth().signOut()
      toast.success(tNav('logout-success'))
      navigate('/login', { replace: true })
    } catch (e: any) {
      toast.error(e.message)
    }
  }, [navigate, tNav])

  const handleSidebarVisibility = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen, setSidebarOpen])

  return (
    <FNavbar
      fluid
      rounded
      className="fixed top-0 left-0 z-50 w-full h-14 bg-white dark:bg-gray-800 border-b border-gray-200"
    >
      {currentUser && (
        <FNavbar.Toggle
          barIcon={HiMenu}
          aria-controls="logo-sidebar"
          onClick={handleSidebarVisibility}
        />
      )}
      <FNavbar.Brand
        as={NavLink}
        to="/"
      >
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white uppercase">
          {tApp('title')}
        </span>
      </FNavbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle />
        {currentUser && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={currentUser?.photoURL || ''}
                rounded
                size="sm"
              />
            }
          >
            <Dropdown.Header>
              <div className="flex flex-col gap-2">
                <div>
                  {currentUser?.displayName && (
                    <span className="block text-sm capitalize">{currentUser?.displayName}</span>
                  )}
                  {currentUser?.email && (
                    <span className="block truncate text-xs font-medium text-gray-600 dark:text-gray-300">
                      {currentUser?.email}
                    </span>
                  )}
                </div>
                {userRole && (
                  <Chip
                    variant="faded"
                    size="sm"
                    className="text-xs capitalize"
                  >
                    {tProfile(`roles.${userRole.toLowerCase()}`)}
                  </Chip>
                )}
              </div>
            </Dropdown.Header>
            <Dropdown.Item
              icon={HiUser}
              as={NavLink}
              to={'/my-account'}
            >
              {tNav('my-account')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={HiLogout}
              onClick={handleSignOut}
            >
              {tNav('logout')}
            </Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </FNavbar>
  )
}
