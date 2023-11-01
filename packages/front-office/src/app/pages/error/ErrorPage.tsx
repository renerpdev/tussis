import { HiEmojiSad } from 'react-icons/hi'
import { NavLink, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div id="error-page">
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-800">
        <div className="text-center">
          <HiEmojiSad className="mx-auto h-16 w-16 text-cyan-500" />
          {error?.message && (
            <>
              <div className="bg-danger-600 p-6 text-white my-4">{error?.message}</div>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                Sorry, we couldn’t load the page due to an error.
              </h1>
            </>
          )}
          {error?.statusText === 'Not Found' && (
            <>
              <p className="text-base font-semibold text-cyan-600 dark:text-white">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Page not found
              </h1>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-white">
                Sorry, we couldn’t find the page you’re looking for.
              </p>
            </>
          )}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink
              to="/"
              className="rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Go back home
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  )
}
