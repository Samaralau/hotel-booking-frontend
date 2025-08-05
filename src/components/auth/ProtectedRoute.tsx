import { useEffect } from 'react'
import { useLocation } from 'wouter'
import useAuthStore from '../../stores/AuthStore'
import useToastStore from '../../stores/ToastStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  redirectTo = '/',
}: ProtectedRouteProps) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const setToast = useToastStore(state => state.setToast)
  const [, navigate] = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      setToast('Please log in to access this page.', 'error')
      navigate(redirectTo)
    }
  }, [isLoggedIn, setToast, navigate, redirectTo])

  // Don't render anything while redirecting
  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}
