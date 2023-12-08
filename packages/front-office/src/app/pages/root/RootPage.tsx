import type { CustomFlowbiteTheme } from 'flowbite-react'
import { Flowbite } from 'flowbite-react'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar } from '../../../shared/components'
import { AUTH_COOKIE_NAME } from '../../../shared/utils'
import usePersistStore from '../../usePersistStore'

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
  const userVerified = useMemo(() => cookies.auth?.user.emailVerified, [cookies.auth?.user])
  const { cookiesAccepted, setCookiesAccepted } = usePersistStore()
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.root',
  })

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Navbar />
      <Sidebar />
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 w-full p-5 z-50 text-cyan-700 bg-cyan-50 dark:bg-gray-800 dark:text-white text-sm text-center border-t-gray-500 border-t-2 animate-appearance-in">
          <p
            dangerouslySetInnerHTML={{
              __html: t('cookies-message', {
                url: 'https://docs.google.com/document/d/1jtZ_W64UsciV8M2waDhPEBAFIIZDixgyYeBdj6tFcQo',
              }),
            }}
          />
          <button
            className="mt-4 px-8 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
            onClick={() => setCookiesAccepted(true)}
          >
            {t('cookies-button')}
          </button>
        </div>
      )}
      <main className={`md:ml-56 pt-unit-18 p-4 dark:bg-gray-800`}>
        {!userVerified && (
          <div
            className="px-8 py-2 bg-warning-50 dark:bg-warning-100 border-2 border-warning text-cyan-950 dark:text-white rounded-3xl mb-4 text-center w-fit mx-auto"
            dangerouslySetInnerHTML={{ __html: t('banner-message', { url: '/my-account' }) }}
          />
        )}
        <div className="rounded-lg">
          <Outlet />
        </div>
      </main>
    </Flowbite>
  )
}
