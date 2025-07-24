import { Route, Switch } from 'wouter'
import { RootLayout } from './components/layout/RootLayout'
import { NotFound } from './components/ui/NotFound'
import { HomePage } from './pages/HomePage'
import { BookingPage } from './pages/BookingPage'
import { ResultsPage } from './pages/ResultsPage'
import { HotelDetailPage } from './pages/HotelDetailPage'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { UserPage } from './pages/UserPage'

function App() {
  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/results/:destination_id" component={ResultsPage} />
        <Route path="/hotels/detail/:hotel_id" component={HotelDetailPage} />
        <Route path="/booking/:hotel_id" component={BookingPage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/user" component={UserPage} />

        /* 404 fallback route */
        <Route component={NotFound} />
      </Switch>
    </RootLayout>
  )
}

export default App
