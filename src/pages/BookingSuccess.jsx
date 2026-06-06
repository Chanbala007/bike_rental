import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Calendar, Home, Receipt, Trophy, Zap, Star } from 'lucide-react'
import confetti from 'canvas-confetti'
import Logo from '../components/Logo'

const BookingSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingInfo, setBookingInfo] = useState(null)

  useEffect(() => {
    if (location.state) {
      setBookingInfo(location.state)
      
      // Trigger confetti if it's the 6th booking milestone
      if (location.state.isMilestone) {
        const duration = 5 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min, max) => Math.random() * (max - min) + min

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)
          // since particles fall down, start a bit higher than random
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#f29325', '#000000', '#ffffff'] })
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#f29325', '#000000', '#ffffff'] })
        }, 250)
      }
    } else {
      // If no state, redirect to home
      navigate('/')
    }
  }, [location, navigate])

  if (!bookingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
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
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5">
          <Logo />
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Booking {bookingInfo.paymentId ? 'Confirmed!' : 'Reserved!'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            {bookingInfo.paymentId
              ? 'Your payment was successful and your booking has been confirmed.'
              : <>Your bike has been successfully reserved. You can pay at the shop during pickup. <span className="font-bold text-gray-900 ml-1">Please share your Booking ID when picking up the bike.</span></>}
          </p>

          {/* Loyalty Milestone Celebration Banner */}
          {bookingInfo.isMilestone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <Trophy size={120} className="text-amber-500" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-6 transition-transform shadow-lg">
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mb-2 uppercase tracking-tight">
                    Loyalty Unlocked!
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-8 bg-amber-500/50" />
                    <span className="text-amber-400 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase">Level 6 Achieved</span>
                    <div className="h-px w-8 bg-amber-500/50" />
                  </div>
                  
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 leading-relaxed max-w-sm mx-auto">
                    Congratulations! You've just unlocked <span className="text-white font-bold">Lifetime 30% Discount</span> on all future bookings.
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl border border-white/10 flex items-center gap-4 group-hover:bg-white/15 transition-colors">
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Your Benefit</span>
                      <span className="text-xl sm:text-2xl font-bold text-white">30% OFF forever</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary-600" />
              Booking Details
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold text-gray-900">#{bookingInfo.bookingId}</span>
              </div>
              {bookingInfo.paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-semibold text-gray-900">{bookingInfo.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-green-600 uppercase tracking-wider text-xs sm:text-sm">
                  {bookingInfo.paymentId ? 'Paid & Confirmed' : 'Reserved (Pay at Shop)'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 sm:p-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-primary-900 font-medium mb-1">What's Next?</p>
                <div className="text-sm text-primary-700 space-y-2">
                  <p>You will receive a confirmation message shortly.</p>
                  {bookingInfo.paymentId ? (
                    <p>Our team will contact you before the pickup date to confirm the delivery location and time.</p>
                  ) : (
                    <p>Please visit our shop at the selected time to pick up your bike. Don't forget to bring a valid ID proof.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
            <motion.button
              onClick={() => navigate('/bikes')}
              className="flex-1 bg-white text-primary-600 border-2 border-primary-600 py-4 rounded-xl font-semibold hover:bg-primary-50 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Another Bike
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingSuccess

