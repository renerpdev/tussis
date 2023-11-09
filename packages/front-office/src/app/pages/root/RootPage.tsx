import type { CustomFlowbiteTheme } from 'flowbite-react'
import { Flowbite } from 'flowbite-react'
import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../../shared/components'

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
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Navbar />
      <Sidebar />
      <main className={`md:ml-56 pt-unit-18 p-4 dark:bg-gray-800`}>
        <div className="rounded-lg">
          <Outlet />
        </div>
      </main>
    </Flowbite>
  )
}
