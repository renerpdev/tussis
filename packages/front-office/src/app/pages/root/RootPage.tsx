import { Outlet } from 'react-router-dom'
import { Navbar } from '../../../shared/components/Navbar/Navbar'
import Sidebar from '../../../shared/components/Sidebar/Sidebar'

export const RootPage = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="p-4 sm:ml-56 mt-14">
        <div className="rounded-lg">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
