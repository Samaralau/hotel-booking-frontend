import { Link } from 'wouter'
import { useState, useEffect } from 'react'
import DeleteToast from './DeleteAccount'
import useAuthStore from '../store'
import { RedirectToast } from '../components/ui/Redirect'

export const UserPage = () => {
  const [firstname, setfirstName] = useState('')
  const [email, setemail] = useState('')
  const [isClick, setIsClick] = useState(false)
  const { isLoggedIn, userdetails } = useAuthStore()
  const [showRedirectToast, setShowRedirectToast] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setShowRedirectToast(true)
    }
    else {
      setemail(userdetails.email)
      setfirstName(userdetails.firstName)
    }
  }, [isLoggedIn, userdetails.email, userdetails.firstName])

  function handleClick() {
    setIsClick(true)
  }

  function closeToast() {
    setIsClick(false)
  }

  return (
    <>
      {/* Account detail page */}
      {isLoggedIn && (
        <>
          <nav>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <h1 className="text-4xl font-bold mb-8">Account Page</h1>
              <Link
                href="/"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Home Page
              </Link>
            </div>
          </nav>
          <div
            id="detail"
            className={`${isClick ? 'opacity-50' : 'opacity-100'} items-center justify-between mx-auto w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700`}
          >
            <form className="space-y-6" action="#">
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                Account Details
              </h5>
              <div className="flex">
                <label className="block mb-2 text-m font-medium text-gray-900 dark:text-white mr-8">
                  Username:
                </label>
                <label
                  id="username"
                  className="block mb-2 text-m font-medium text-gray-900 dark:text-white"
                >
                  {firstname}
                </label>
              </div>
              <div className="flex">
                <label className="block mb-2 text-m font-medium text-gray-900 dark:text-white mr-8">
                  Email:
                </label>
                <label
                  id="email"
                  className="block mb-2 text-m font-medium text-gray-900 dark:text-white"
                >
                  {email}
                </label>
              </div>
              <p className="text-xl font-medium text-gray-900 dark:text-white">
                Change Password
              </p>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Current password
                </label>
                <input
                  type="password"
                  name="passwd"
                  id="passwd"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New password
                </label>
                <input
                  type="password"
                  name="passwd_conf"
                  id="passwd_conf"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <button
                type="button"
                id="changepsw"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Change Password
              </button>
              <button
                onClick={handleClick}
                type="button"
                id="deleteButton"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-pink-700 dark:focus:ring-blue-800"
              >
                Delete Account
              </button>
            </form>
          </div>
        </>
      )}
      {/* / Redirect to login or home */}
      {showRedirectToast && <RedirectToast />}

      {/* Delete Account Toast */}
      {isClick ? <DeleteToast open={isClick} onClose={closeToast} /> : null}
    </>
  )
}
