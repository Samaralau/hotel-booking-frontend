import { Link } from 'wouter'
import { useState, useEffect } from 'react'
import DeleteToast from './DeleteAccount'
// import useAuthStore from '../store'
import useAuthStore from '../stores/AuthStore'
import { RedirectToast } from '../components/ui/Redirect'

export const UserPage = () => {
  const [firstname, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [isClick, setIsClick] = useState(false)
  // const { isLoggedIn, userdetails } = useAuthStore();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const userDetails = useAuthStore(state => state.userDetails)
  const [showRedirectToast, setShowRedirectToast] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setShowRedirectToast(true)
    }
    else {
      setEmail(userDetails.email)
      setFirstName(userDetails.firstName)
    }
  }, [isLoggedIn, userDetails.email, userDetails.firstName])

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
              <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Details
              </h5>
              {/* Username */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-m font-medium text-gray-900 dark:text-white">
                  Username:
                </label>
                <span className="col-span-2 text-m text-gray-900 dark:text-white">
                  {firstname}
                </span>
              </div>
              {/* Email */}
              <div className="grid grid-cols-3 items-center">
                <label className="text-m font-medium text-gray-900 dark:text-white">
                  Email:
                </label>
                <span className="col-span-2 text-m text-gray-900 dark:text-white">
                  {email}
                </span>
              </div>
              {/* Change Password Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h2>
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
              </div>

              {/* Delete Account */}
              <div className="pt-1">
                <button
                  onClick={handleClick}
                  type="button"
                  id="deleteButton"
                  className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>

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
