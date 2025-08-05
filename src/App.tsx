import { useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RootLayout } from './components/layout/RootLayout'
import { NotFound } from './components/ui/NotFound'
import { HomePage } from './pages/HomePage'
import { BookingPage } from './pages/BookingPage'
import { ResultsPage } from './pages/ResultsPage'
import { HotelDetailPage } from './pages/HotelDetailPage'
import { Signup } from './pages/SignupPage'
import { Login } from './pages/LoginPage'
import { UserPage } from './pages/UserPage'
import useAuthStore from './stores/AuthStore'

function App() {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus)

  // Check auth status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/results/:destination_id" component={ResultsPage} />
        <Route path="/hotels/detail/:hotel_id" component={HotelDetailPage} />
        <Route path="/booking/:hotel_id">
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user">
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        </Route>
        /* 404 fallback route */
        <Route component={NotFound} />
      </Switch>
    </RootLayout>
  )
}

export default App
