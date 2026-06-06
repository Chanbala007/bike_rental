import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, LogOut, ArrowLeft, Calendar, MapPin, Bike, Loader, Clock, AlertCircle, CreditCard } from 'lucide-react'
import { authAPI, bookingAPI, paymentAPI } from '../services/api'
import Logo from '../components/Logo'
import CartIcon from '../components/CartIcon'
import { useCart } from '../context/CartContext'
import { handleImageError, getImageFallback } from '../utils/imageFallback'

const UserProfile = () => {
  const navigate = useNavigate()
  const { openCart } = useCart()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const currentUser = await authAPI.getMe()
      if (currentUser) {
        setUser(currentUser)
        const userBookings = await bookingAPI.getMyBookings()
        setBookings(userBookings)
      }
    } catch (err) {
      console.log('User not logged in or token expired')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      setBookings([])
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700 font-semibold'
      case 'picked': return 'bg-purple-100 text-purple-700 font-semibold'
      case 'pending': return 'bg-yellow-100 text-yellow-700 font-semibold'
      case 'completed': return 'bg-blue-100 text-blue-700 font-semibold'
      case 'cancelled': return 'bg-red-100 text-red-700 font-semibold'
      default: return 'bg-gray-100 text-gray-700 font-semibold'
    }
  }

  const formatDateString = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm p-4 text-center">
          <Logo />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2"><ArrowLeft className="w-6 h-6" /></button>
          <Logo />
          <div className="w-10"></div>
        </header>
        <div className="flex flex-col items-center justify-center p-8 mt-20 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You are logged out</h2>
          <p className="text-gray-600 mb-8 max-w-sm">Please start a new bike booking to authenticate and view your upcoming rides.</p>
          <button 
            onClick={() => navigate('/bikes')}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Book a Bike
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <Logo />
          </div>
          <CartIcon onClick={openCart} />
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-5 py-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-6 mb-6 sm:mb-0">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.first_name} {user.last_name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Phone className="w-4 h-4" /> +91 {user.phone}
                </div>
                {user.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" /> {user.email}
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">You haven't rented any bikes yet. Let's fix that!</p>
              <button 
                onClick={() => navigate('/bikes')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Browse Bikes
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((item) => {
                const b = item.booking ? item.booking : item
                const bike = item.bike ? item.bike : { name: `Bike #${b.bike_id}` }

                return (
                  <motion.div 
                    key={b.id} 
                    className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row transition hover:shadow-lg"
                    whileHover={{ y: -2 }}
                  >
                    <div className="md:w-1/3 bg-gray-100 h-48 md:h-auto relative">
                      <img
                        src={bike.image_url || getImageFallback(bike.name, 400, 300)}
                        alt={bike.name}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, bike.name)}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(b.status)}`}>
                          {b.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
                          <span className="font-bold text-lg text-primary-600">₹{b.total_price}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5"><Calendar className="w-5 h-5 text-gray-400" /></div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pickup</p>
                              <p className="text-sm font-medium text-gray-900">{formatDateString(b.pickup_date)} at {b.pickup_time}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5"><Clock className="w-5 h-5 text-gray-400" /></div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Drop-off</p>
                              <p className="text-sm font-medium text-gray-900">{formatDateString(b.drop_date)} at {b.drop_time}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 mt-4">
                          <div className="mt-0.5"><MapPin className="w-5 h-5 text-gray-400" /></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                            <p className="text-sm text-gray-700 line-clamp-1">{b.location}</p>
                          </div>
                        </div>
                      </div>
                      
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-gray-400">Booking ID: #{b.id}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
