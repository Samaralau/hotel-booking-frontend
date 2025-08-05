import { useState, useEffect } from 'react'
// import useAuthStore from '../store'
import useAuthStore from '../stores/AuthStore'
import useToastStore from '../stores/ToastStore'
import { useLocation } from 'wouter'
import { BACKEND_URL } from '../config/api'

interface DeleteAccountProps {
  open: boolean
  onClose: () => void
}

interface DeleteResponse {
  success: boolean
  message: string
}

function DeleteToast({ open, onClose }: DeleteAccountProps) {
  const [isActive, setIsActive] = useState(false)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  // const { logout } = useAuthStore();
  const logout = useAuthStore(state => state.logout)
  const accessToken = useAuthStore(state => state.accessToken)
  // const curEmail = useAuthStore((state) => state.userdetails.email);
  const curEmail = useAuthStore(state => state.userDetails.email)
  const setToast = useToastStore(state => state.setToast)
  const [msg, setMsg] = useState('')
  const [, nav] = useLocation()

  function closeClick() {
    setIsActive(false)
    onClose()
  }

  useEffect(() => {
    setIsActive(open)
  }, [open])

  async function DeleteUser(): Promise<void> {
    const pwd_del = document.getElementById('passwd_del') as HTMLInputElement
    // let token: string | null;
    if (isLoggedIn) {
      console.log('isloggedin', isLoggedIn)
      console.log('password: ', pwd_del.value)
      console.log('email: ', curEmail)
      // token = sessionStorage.getItem("accessToken");
      // if (token == null) {
      //   token = "";
      // }
      const res = await fetch(`${BACKEND_URL}/users/delete`, {
        method: 'POST',
        headers: {
          // Authorization: "Bearer " + token,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: curEmail,
          password: pwd_del.value,
        }),
      })

      const msg = (await res.json()) as DeleteResponse
      if (res.ok) {
        logout()
        // sessionStorage.setItem("toast", msg.message);
        setToast(msg.message)
        nav('/')
      }
      else {
        setMsg(msg.message || 'Account deletion failed.')
      }
    }
    else {
      setMsg('Please sign in first')
    }
  }

  return isActive
    ? (
      <>
        <div
          id="toast-interactive"
          className="mx-auto m-8 item-center w-full max-w-sm p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-400"
          role="alert"
        >
          <div className="flex">
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
            </div>
            <div className="ms-3 text-sm font-normal">
              <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                Termination of Account
              </span>
              <div className="mb-2 text-sm font-normal">
                Are you sure? This action is irreversible.
              </div>
              <div className="mb-2 text-sm font-normal">
                Key in your password.
              </div>
              <input
                type="password"
                name="passwd_del"
                id="passwd_del"
                placeholder="••••••••"
                className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <a
                href="#"
                onClick={() => {
                  void DeleteUser()
                }}
                id="deleteAccount"
                className="m-2 inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              >
                Yes, delete my account
              </a>
              <p>{msg}</p>
            </div>
            <button
              type="button"
              id="closeButton"
              onClick={() => {
                void closeClick()
              }}
              className="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-interactive"
              aria-label="Close"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    )
    : null
}

export default DeleteToast
