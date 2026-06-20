import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, MapPin, Bike, CreditCard, User, Phone, Mail, Loader, X, AlertCircle, Truck, Zap } from 'lucide-react'
import Logo from '../components/Logo'
import CartIcon from '../components/CartIcon'
import UserIcon from '../components/UserIcon'
import { useCart } from '../context/CartContext'
import { handleImageError, getImageFallback } from '../utils/imageFallback'
import { paymentAPI, customerAPI, authAPI, bookingAPI } from '../services/api'
import AuthModal from '../components/AuthModal'

const BookingSummary = () => {
  const navigate = useNavigate()
  const { openCart, clearCart } = useCart()
  const [bookingDetails, setBookingDetails] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  const [bookingCount, setBookingCount] = useState(0)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    const details = localStorage.getItem('bookingDetails')
    if (details) {
      setBookingDetails(JSON.parse(details))
    } else {
      navigate('/bikes')
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [navigate])

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const { bike, date, time, location, pickupDate, pickupTime, dropDate, dropTime, days, fulfillmentType } = bookingDetails

  // Handle both old format (date, time) and new format (pickupDate, pickupTime, dropDate, dropTime)
  const isNewFormat = pickupDate && pickupTime && dropDate && dropTime
  const rentalDays = days || 1
  const basePrice = bike.price * rentalDays
  const hasLoyaltyDiscount = bookingCount >= 5
  const discountAmount = hasLoyaltyDiscount ? basePrice * 0.3 : 0
  const totalPrice = basePrice - discountAmount

  const handleProceedToPay = async () => {
    setPaymentError('')
    // Check if user is logged in
    try {
      const currentUser = await authAPI.getMe()
      if (currentUser) {
        setUser(currentUser)
        // Fetch booking count for loyalty
        try {
          const { count } = await bookingAPI.getMyCount()
          setBookingCount(count)
          handlePayment(currentUser, count) 
        } catch (err) {
          console.error("Error fetching booking count", err)
          handlePayment(currentUser, 0)
        }
      } else {
        // Not logged in
        setShowAuthModal(true)
      }
    } catch (error) {
      // Not logged in or error
      console.log("Not logged in or session expired", error)
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = async (loggedInUser) => {
    setUser(loggedInUser)
    setShowAuthModal(false)
    
    // Update booking details with customer info
    const updatedDetails = {
      ...bookingDetails,
      customer_id: loggedInUser.id,
      customer_name: `${loggedInUser.first_name || ''} ${loggedInUser.last_name || ''}`.trim() || 'Guest',
      customer_email: loggedInUser.email,
      customer_phone: loggedInUser.phone,
    }
    setBookingDetails(updatedDetails)
    localStorage.setItem('bookingDetails', JSON.stringify(updatedDetails))

    // Fetch booking count after registration/login
    try {
      const { count } = await bookingAPI.getMyCount()
      setBookingCount(count)
      handlePayment(loggedInUser, count)
    } catch (err) {
      console.error("Error fetching booking count", err)
      handlePayment(loggedInUser, 0)
    }
  }

  const handlePayment = async (currentUser, currentCount = null) => {
    setShowQRModal(true)
  }

  const confirmBooking = async () => {
    setProcessingPayment(true)
    setPaymentError('')

    try {
      // Prepare booking data
      const formatDateForBackend = (dateStr) => {
        if (!dateStr) return null
        if (dateStr.includes('T')) return dateStr
        const date = new Date(dateStr)
        return date.toISOString()
      }

      const bookingData = {
        bike_id: bike.id,
        customer_id: user?.id,
        customer_name: `${user?.first_name} ${user?.last_name}` || 'Guest',
        customer_email: user?.email,
        customer_phone: user?.phone,
        pickup_date: formatDateForBackend(isNewFormat ? pickupDate : date),
        pickup_time: isNewFormat ? pickupTime : (time || '10:00'),
        drop_date: formatDateForBackend(isNewFormat ? dropDate : date),
        drop_time: isNewFormat ? dropTime : (time || '10:00'),
        location: location || 'Not specified',
        total_price: totalPrice
      }

      // Bypass Razorpay completely - direct booking creation
      const response = await bookingAPI.create(bookingData)

      clearCart()
      localStorage.removeItem('bookingDetails')

      navigate('/booking-success', {
        state: {
          bookingId: response.id,
          paymentId: "MANUAL_UPI",
          isMilestone: bookingCount >= 5
        }
      })
    } catch (error) {
      console.error('Booking error:', error)
      setPaymentError(error.message || 'Failed to complete booking. Please try again.')
    } finally {
      setProcessingPayment(false)
      setShowQRModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <UserIcon onClick={() => navigate('/profile')} />
            <CartIcon onClick={openCart} />
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Booking Summary
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Review your booking details</p>
          </div>

          {/* Bike Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={bike.image || getImageFallback(bike.name, 800, 600)}
                alt={bike.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, bike.name)}
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bike className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{bike.name}</h2>
              </div>
              <p className="text-gray-600 mb-2 text-sm">{bike.engineCC}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Booking Details</h3>

            <div className="space-y-4">
              {/* Pickup Section */}
              <div className="pb-4 border-b">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Bike Pickup
                </h4>
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup Date</p>
                    <p className="font-semibold text-gray-900">
                      {isNewFormat
                        ? new Date(pickupDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        : date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p className="font-semibold text-gray-900">{isNewFormat ? pickupTime : (time || 'N/A')}</p>
                  </div>
                </div>
              </div>

              {/* Drop Section */}
              {isNewFormat && (
                <div className="pb-4 border-b">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Bike Drop
                  </h4>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Drop Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(dropDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Drop Time</p>
                      <p className="font-semibold text-gray-900">{dropTime}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fulfillment Method */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${fulfillmentType === 'delivery' ? 'bg-green-100' : 'bg-primary-100'}`}>
                  {fulfillmentType === 'delivery' ? <Truck className="w-5 h-5 text-green-600" /> : <MapPin className="w-5 h-5 text-primary-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Fulfillment Method</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {fulfillmentType === 'delivery' ? 'Delivery on stay' : 'In-Shop Pickup'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {location}
                  </p>
                  {fulfillmentType === 'pickup' && (
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-2 border-t pt-2 border-primary-100">
                      Opposite to new bus stand
                    </p>
                  )}
                  {fulfillmentType === 'delivery' && (
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-2 border-t pt-2 border-green-100">
                      Admin will contact you
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Display (If User is Logged In) */}
          {user && (
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Customer Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg"><User className="w-5 h-5 text-primary-600" /></div>
                  <div><p className="text-sm text-gray-500">Name</p><p className="font-semibold">{user.first_name} {user.last_name}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg"><Phone className="w-5 h-5 text-primary-600" /></div>
                  <div><p className="text-sm text-gray-500">Phone</p><p className="font-semibold">{user.phone}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Price Summary</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rental ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</span>
                <span className="font-semibold text-gray-900">₹{bike.price} × {rentalDays}</span>
              </div>
              {hasLoyaltyDiscount && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center text-green-600 font-bold bg-green-50 px-3 py-2 rounded-xl border border-green-100"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Loyalty Discount (30%)</span>
                  </div>
                  <span>- ₹{Math.round(discountAmount)}</span>
                </motion.div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  {hasLoyaltyDiscount && (
                    <p className="text-sm text-gray-400 line-through">₹{basePrice}</p>
                  )}
                  <span className="text-3xl font-bold text-primary-600">₹{Math.round(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>



          {/* Payment Error */}
          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-600">{paymentError}</p>
            </div>
          )}

          {/* Proceed to Pay Button */}
          <motion.button
            onClick={handleProceedToPay}
            disabled={processingPayment}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${processingPayment
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            whileHover={!processingPayment ? { scale: 1.02 } : {}}
            whileTap={!processingPayment ? { scale: 0.98 } : {}}
          >
            {processingPayment ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Pay
              </>
            )}
          </motion.button>

          <button onClick={() => navigate(-1)} className="w-full mt-4 text-center text-gray-500">Back</button>

        </motion.div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pay via UPI</h3>
              <p className="text-gray-500 text-sm mb-6">Scan the QR code below using any UPI app to pay ₹{Math.round(totalPrice)}</p>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 inline-block border-2 border-gray-100">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${import.meta.env.VITE_UPI_ID || 'test@upi'}&pn=RetroBikeRent&am=${Math.round(totalPrice)}&cu=INR`}
                  alt="UPI QR Code" 
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmBooking}
                  disabled={processingPayment}
                  className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  {processingPayment ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  I have paid ₹{Math.round(totalPrice)}
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  disabled={processingPayment}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingSummary
