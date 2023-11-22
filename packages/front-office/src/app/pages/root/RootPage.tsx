import type { CustomFlowbiteTheme } from 'flowbite-react'
import { Flowbite } from 'flowbite-react'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../../shared/components'
import { AUTH_COOKIE_NAME } from '../../../shared/utils/cookies'

const customTheme: CustomFlowbiteTheme = {
  datepicker: {
    root: {
      base: 'relative',
    },
    views: {
      days: {
        items: {
          base: 'grid grid-cols-7',
          item: {
            selected: 'bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-500',
            disabled: 'opacity-20 cursor-not-allowed',
          },
        },
      },
    },
  },
  textInput: {
    field: {
      input: {
        base: 'w-full',
        colors: {
          gray: 'bg-gray-100 hover:bg-default-200 dark:bg-gray-700 dark:text-white',
        },
      },
    },
  },
}

export const RootPage = () => {
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const isValidRole = useMemo(
    () => cookies.auth?.user.role === 'admin' || cookies.auth?.user.role === 'editor',
    [cookies.auth?.user],
  )

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Navbar />
      <Sidebar />
      <main className={`md:ml-56 pt-unit-18 p-4 dark:bg-gray-800`}>
        {!isValidRole && (
          <div className="px-4 py-2 bg-warning-50 dark:bg-warning-100 border-2 border-warning text-cyan-950 dark:text-white rounded-full mb-4 text-center w-fit mx-auto">
            Necesitas permisos para poder <b>agregar | editar | eliminar</b> datos. Por favor
            contacta a un administrador.
          </div>
        )}
        <div className="rounded-lg">
          <Outlet />
        </div>
      </main>
    </Flowbite>
  )
}
