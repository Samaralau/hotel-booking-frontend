import { useEffect } from 'react'
import { useLocation, useSearch } from 'wouter'
import { MyAccountDropdown } from '../ui/MyAccount'
import useAuthStore from '../../stores/AuthStore'

interface NavBarProps {
  pageTitle: string
}

export const NavBar = ({ pageTitle }: NavBarProps) => {
  const setRedirectUrl = useAuthStore(state => state.setRedirectUrl)
  const [location] = useLocation()
  const search = useSearch()

  // Save current URL whenever user navigates
  useEffect(() => {
    if (location !== '/login' && location !== '/signup') {
      const currentUrl = location + (search ? `?${search}` : '')
      setRedirectUrl(currentUrl)
    }
  }, [location, search, setRedirectUrl])

  return (
    <div className="navbar p-0 bg-base-100">
      <div className="flex-1">
        <h1 className="text-4xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex-none">
        <MyAccountDropdown />
      </div>
    </div>
  )
}
