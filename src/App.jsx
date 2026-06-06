import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BikeListing from './pages/BikeListing'
import BikeDetails from './pages/BikeDetails'
import BookingSummary from './pages/BookingSummary'
import BookingSuccess from './pages/BookingSuccess'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import BikesManagement from './pages/admin/BikesManagement'
import Bookings from './pages/admin/Bookings'
import Settings from './pages/admin/Settings'
import AdminLogin from './pages/admin/AdminLogin'
import GalleryManagement from './pages/admin/GalleryManagement'
import Gallery from './pages/Gallery'
import Terms from './pages/Terms'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import CartDrawer from './components/CartDrawer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<BikeListing />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
        <Route path="/summary" element={<BookingSummary />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/bikes" element={
          <AdminProtectedRoute>
            <BikesManagement />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminProtectedRoute>
            <Bookings />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminProtectedRoute>
            <Settings />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/gallery" element={
          <AdminProtectedRoute>
            <GalleryManagement />
          </AdminProtectedRoute>
        } />
      </Routes>
      <CartDrawer />
    </Router>
  )
}

export default App

