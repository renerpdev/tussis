import { getAuth } from '@firebase/auth'
import { Avatar, DarkThemeToggle, Dropdown, Navbar as FNavbar } from 'flowbite-react'
import { useCallback } from 'react'
import { HiLogout, HiMenu, HiTrash } from 'react-icons/hi'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePersistedStore, useStore } from '../../../app/useStore'

export const Navbar = () => {
  const navigate = useNavigate()
  const { currentUser } = usePersistedStore()
  const { sidebarOpen, setSidebarOpen } = useStore()

  const handleRemoveAccount = useCallback(() => {
    const confirmedDeletion = window.confirm('Are you sure you want to delete your account?')
    if (confirmedDeletion) {
      currentUser
        ?.delete()
        .then(() => {
          toast.success('Account deleted!')
          navigate('/login')
        })
        .catch(error => {
          toast.error(error.message, {
            toastId: 'delete-account',
          })
        })
    }
  }, [currentUser, navigate])

  const handleSignOut = useCallback(() => {
    getAuth()
      .signOut()
      .then(() => {
        toast.success('Sign-out successful!')
        navigate('/login')
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'sign-out',
        })
      })
  }, [navigate])

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
          Tussis
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
              {currentUser?.displayName && (
                <span className="block text-sm capitalize">{currentUser?.displayName}</span>
              )}
              {currentUser?.isAnonymous && (
                <span className="block text-sm capitalize">Anonymous</span>
              )}
              {currentUser?.email && (
                <span className="block truncate text-sm font-medium">{currentUser?.email}</span>
              )}
            </Dropdown.Header>
            <Dropdown.Item
              icon={HiTrash}
              onClick={handleRemoveAccount}
            >
              Delete Account
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={HiLogout}
              onClick={handleSignOut}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </FNavbar>
  )
}
