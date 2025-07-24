import { MyAccountDropdown } from '../ui/MyAccount'
import useAuthStore from '../../store'
import { useEffect } from 'react'

interface NavBarProps {
  pageTitle: string
}

export const NavBar = ({ pageTitle }: NavBarProps) => {
  const toastmsg = useAuthStore(state => state.toast)
  const { timeout } = useAuthStore()

  useEffect(() => {
    if (toastmsg != '') {
      const timer = setTimeout(() => timeout(), 2000)
      return () => clearTimeout(timer)
    }
  }, [toastmsg, timeout])
  return (
    <div className="navbar p-0 bg-base-100">
      <div className="flex-1">
        <h1 className="text-4xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex-none">
        {toastmsg != ''
          ? (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
              {toastmsg}
            </div>
          )
          : null}
        <MyAccountDropdown />
      </div>
    </div>
  )
}
