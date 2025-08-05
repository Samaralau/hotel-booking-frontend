import { useLocation } from 'wouter'

export const RedirectToast = () => {
  const [,nav] = useLocation()
  function directLogin() {
    nav('/login')
  }
  function directHome() {
    nav('/')
  }

  return (
    <div id="toast-message-cta" className="justify-center items-center m-auto w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-400" role="alert">
      <div className="flex justify-center">
        <div className="ms-3 text-sm font-normal">
          <div className="mb-2 text-sm font-normal">You are currently not logged in. </div>
          <div className="mb-2 text-sm font-normal">Would you like to be redirected to the login page?</div>
          <button onClick={() => { void directLogin() }} className="px-3 py-1 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">Yes</button>
        </div>
        <button type="button" onClick={() => { void directHome() }} className="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-message-cta" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
