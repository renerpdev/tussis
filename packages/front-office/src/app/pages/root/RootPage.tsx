import type { CustomFlowbiteTheme } from 'flowbite-react'
import { Flowbite } from 'flowbite-react'
import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../../shared/components'

const customTheme: CustomFlowbiteTheme = {
  datepicker: {
    root: {
      base: 'relative',
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
      <main className="p-4 md:ml-56 pt-unit-18 dark:bg-gray-800">
        <div className="rounded-lg">
          <Outlet />
        </div>
      </main>
    </Flowbite>
  )
}
