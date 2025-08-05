import { useState } from 'react'
import { Link } from 'wouter'
import useAuthStore from '../../stores/AuthStore'
import useToastStore from '../../stores/ToastStore'

export const MyAccountDropdown = () => {
  const logout = useAuthStore(state => state.logout)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const setToast = useToastStore(state => state.setToast)
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)
  const handleLogout = () => {
    logout()
    setToast('You have been signed out.', 'success')
  }
  if (!isLoggedIn) {
    return (
      <Link href="/Login" className="btn btn-primary">
        Login
      </Link>
    )
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
      >
        My Account
        <svg className="w-2.5 h-2.5 ml-2.5" fill="none" viewBox="0 0 10 6">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-md shadow bg-white dark:bg-gray-700">
          <Link
            href="/user"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
