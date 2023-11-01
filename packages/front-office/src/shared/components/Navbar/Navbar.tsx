import { Avatar, DarkThemeToggle, Dropdown, Navbar as FNavbar } from 'flowbite-react'
import { HiLogout, HiMenu, HiUser } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <FNavbar
      fluid
      rounded
      className="fixed top-0 left-0 z-50 w-full h-14 bg-white dark:bg-gray-800 border-b border-gray-200"
    >
      <FNavbar.Toggle
        barIcon={HiMenu}
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
      />
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
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
              size="sm"
            />
          }
        >
          <Dropdown.Header className="sdsd">
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item icon={HiUser}>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </FNavbar>
  )
}
