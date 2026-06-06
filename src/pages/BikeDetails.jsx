import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Check, ShoppingCart, Plus, Loader, MapPin, Truck, Phone, Copy, ExternalLink, Map, X } from 'lucide-react'
import Logo from '../components/Logo'
import CartIcon from '../components/CartIcon'
import { useCart } from '../context/CartContext'
import { useBike } from '../hooks/useBike'
import { handleImageError, getImageFallback } from '../utils/imageFallback'
import { authAPI, bookingAPI } from '../services/api'

const BikeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bike, loading, error } = useBike(parseInt(id))
  const { addToCart, isBikeInCart, openCart } = useCart()

  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [dropDate, setDropDate] = useState('')
  const [dropTime, setDropTime] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false)
  const [fulfillmentType, setFulfillmentType] = useState(null) // 'pickup' | 'delivery'
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [reserving, setReserving] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading bike details...</p>
        </div>
      </div>
    )
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading bike</p>
          <p className="text-gray-500 text-sm mb-4">{error || 'Bike not found'}</p>
          <button
            onClick={() => navigate('/bikes')}
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Back to Bikes
          </button>
        </div>
      </div>
    )
  }

  // Now we know bike exists, safe to access its properties
  const isInCart = isBikeInCart(bike.id)

  const handleAddToCart = () => {
    if (!pickupDate || !pickupTime || !dropDate || !dropTime) {
      return
    }

    setIsAddingToCart(true)
    addToCart(bike, pickupDate, pickupTime, dropDate, dropTime)
    
    // Show success animation
    setTimeout(() => {
      setIsAddingToCart(false)
      openCart()
    }, 500)
  }

  const handleBrowseMore = () => {
    navigate('/bikes')
  }

  const get24hTime = (time12h) => {
    if (!time12h) return ''
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  const handleProceed = () => {
    if (pickupDate && pickupTime && dropDate && dropTime) {
      setShowFulfillmentModal(true)
    }
  }

  const handleFinalizeBooking = () => {
    if (!fulfillmentType) return

    const pickup = new Date(`${pickupDate}T${get24hTime(pickupTime)}`)
    const drop = new Date(`${dropDate}T${get24hTime(dropTime)}`)
    const diffTime = Math.abs(drop - pickup)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

    const shopAddress = "7, Thennanjalai Rd, opposite to Passport Office, Subaiya Nagar, Orleanpet, Puducherry, 605001"
    
    // Store booking details in localStorage
    localStorage.setItem('bookingDetails', JSON.stringify({
      bike: bike,
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      dropDate: dropDate,
      dropTime: dropTime,
      days: diffDays,
      fulfillmentType: fulfillmentType,
      location: fulfillmentType === 'pickup' ? '' : deliveryAddress,
      adminPhone: '+916384788089'
    }))

    // Navigate to summary page for Razorpay checkout
    navigate('/summary')
  }

  const handleCopyAddress = () => {
    const address = "7, Thennanjalai Rd, opposite to Passport Office, Subaiya Nagar, Orleanpet, Puducherry, 605001"
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate number of days and total price
  const calculateDays = () => {
    if (pickupDate && dropDate && pickupTime && dropTime) {
      const pickup = new Date(`${pickupDate}T${get24hTime(pickupTime)}`)
      const drop = new Date(`${dropDate}T${get24hTime(dropTime)}`)
      const diffTime = Math.abs(drop - pickup)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
      return diffDays
    }
    return 1
  }

  const rentalDays = calculateDays()
  const totalPrice = bike.price * rentalDays

  // Generate time slots (6 AM to 9 PM)
  const timeSlots = []
  for (let hour = 6; hour <= 21; hour++) {
    for (let min of ['00', '30']) {
      const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      timeSlots.push(`${h12}:${min} ${ampm}`)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]
  
  // Get minimum drop date (should be after pickup date)
  const getMinDropDate = () => {
    return pickupDate || today
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
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/bikes')}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Bikes</span>
            </button>
            <div className="hidden sm:flex items-center gap-4 ml-auto">
              <Logo className="h-10" />
              <CartIcon onClick={openCart} />
            </div>
            <div className="sm:hidden ml-auto">
              <CartIcon onClick={openCart} />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bike Image */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="relative h-48 sm:h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={bike.image || getImageFallback(bike.name, 800, 600)}
                alt={bike.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, bike.name)}
              />
            </div>
          </div>

          {/* Bike Info */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{bike.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base mb-4">{bike.description}</p>
            
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500">Engine</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{bike.engineCC}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-600">₹{bike.price}<span className="text-sm sm:text-lg text-gray-500 font-normal">/day</span></p>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bike.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vibrant Unified Date-Time Picker */}
          <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -mr-16 -mt-16 blur-3xl opacity-30"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Booking Schedule</h2>
                <p className="text-sm text-gray-500 font-medium">Select your pickup and return windows</p>
              </div>
              
              {pickupDate && dropDate && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary-600 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-[0_10px_30px_-10px_rgba(242,147,37,0.5)] flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  {rentalDays} {rentalDays === 1 ? 'DAY' : 'DAYS'} RENTAL
                </motion.div>
              )}
            </div>

            <div className="space-y-10">
              {/* Pickup Group */}
              <div className="group">
                <label className="block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4 ml-1 group-focus-within:text-primary-600 transition-colors">
                  Pickup Date and Time
                </label>
                <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-[22px] bg-gray-50 border-2 border-gray-100 group-focus-within:border-primary-400 group-focus-within:bg-white group-focus-within:shadow-[0_20px_40px_-15px_rgba(242,147,37,0.15)] transition-all duration-300">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value)
                        if (dropDate && e.target.value > dropDate) setDropDate('')
                      }}
                      className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-transparent focus:outline-none font-bold text-gray-900 appearance-none"
                    />
                  </div>
                  <div className="hidden sm:block w-px h-8 self-center bg-gray-200"></div>
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-transparent focus:outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Pickup Time</option>
                      {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Drop Group */}
              <div className={`group transition-all duration-500 ${!pickupDate ? 'opacity-30 blur-sm pointer-events-none scale-95' : 'opacity-100'}`}>
                <label className="block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4 ml-1 group-focus-within:text-green-600 transition-colors">
                  Return Date and Time
                </label>
                <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-[22px] bg-gray-50 border-2 border-gray-100 group-focus-within:border-green-400 group-focus-within:bg-white group-focus-within:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] transition-all duration-300">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      min={getMinDropDate()}
                      value={dropDate}
                      onChange={(e) => setDropDate(e.target.value)}
                      disabled={!pickupDate}
                      className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-transparent focus:outline-none font-bold text-gray-900 appearance-none"
                    />
                  </div>
                  <div className="hidden sm:block w-px h-8 self-center bg-gray-200"></div>
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={dropTime}
                      onChange={(e) => setDropTime(e.target.value)}
                      disabled={!dropDate}
                      className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-transparent focus:outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Return Time</option>
                      {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Visualization */}
            <AnimatePresence>
              {pickupDate && pickupTime && dropDate && dropTime && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-10 overflow-hidden"
                >
                  <div className="bg-gray-900 rounded-3xl p-6 text-white relative">
                    <div className="absolute top-4 right-4 text-white/10"><Check className="w-12 h-12" /></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Valuation</span>
                        </div>
                        <span className="text-2xl font-black text-primary-400">₹{totalPrice}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                          <p className="text-gray-500 mb-1">Duration</p>
                          <p className="font-bold text-gray-100">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-gray-500 mb-1">Standard Rate</p>
                          <p className="font-bold text-gray-100">₹{bike.price}/day</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 space-y-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={!pickupDate || !pickupTime || !dropDate || !dropTime || isInCart}
                className={`w-full py-5 rounded-2xl font-black text-xl tracking-tight transition-all flex items-center justify-center gap-3 overflow-hidden group relative ${
                  pickupDate && pickupTime && dropDate && dropTime && !isInCart
                    ? isAddingToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-500 shadow-[0_20px_40px_-15px_rgba(242,147,37,0.4)]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={pickupDate && pickupTime && dropDate && dropTime && !isInCart && !isAddingToCart ? { y: -4 } : {}}
                whileTap={pickupDate && pickupTime && dropDate && dropTime && !isInCart && !isAddingToCart ? { scale: 0.98 } : {}}
              >
                {isAddingToCart ? (
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-2">
                      <Check className="w-6 h-6" /> Ready for your trip!
                    </motion.div>
                ) : isInCart ? (
                  <div className="flex items-center gap-2 opacity-60"><Check className="w-6 h-6" /> Already in Cart</div>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                    Secure Booking
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleProceed}
                disabled={!pickupDate || !pickupTime || !dropDate || !dropTime}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                  pickupDate && pickupTime && dropDate && dropTime
                    ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                Proceed to Location Verification
              </motion.button>
            </div>

            {/* Browse More Bikes Link */}
            <motion.button
              onClick={handleBrowseMore}
              className="w-full py-3 text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center justify-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Browse More Bikes
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Fulfillment Modal */}
      <AnimatePresence>
        {showFulfillmentModal && (
          <motion.div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button 
                onClick={() => setShowFulfillmentModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="p-5 sm:p-8 md:p-10">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">How do you want it?</h3>
                  <p className="text-sm text-gray-500 font-medium">Choose your preferred fulfillment method</p>
                </div>

                <div className="grid gap-4 mb-8">
                  {/* Pickup Option */}
                  <button 
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left relative group ${
                      fulfillmentType === 'pickup' 
                        ? 'border-primary-500 bg-primary-50/30' 
                        : 'border-gray-100 hover:border-primary-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
                        fulfillmentType === 'pickup' ? 'bg-primary-600 text-white' : 'bg-white text-gray-400 border border-gray-100'
                      }`}>
                        <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="font-black text-gray-900 text-base sm:text-lg mb-1 italic">In-Shop Pickup</h4>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                          Pickup from our hub opposite to new bus stand.
                        </p>
                      </div>
                      {fulfillmentType === 'pickup' && (
                        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Delivery Option */}
                  <button 
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left relative group ${
                      fulfillmentType === 'delivery' 
                        ? 'border-green-500 bg-green-50/30' 
                        : 'border-gray-100 hover:border-green-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
                        fulfillmentType === 'delivery' ? 'bg-green-600 text-white' : 'bg-white text-gray-400 border border-gray-100'
                      }`}>
                        <Truck className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="font-black text-gray-900 text-base sm:text-lg mb-1 italic">Home Delivery</h4>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                          We bring the ride to your doorstep.
                        </p>
                      </div>
                      {fulfillmentType === 'delivery' && (
                        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Dynamic Content based on selection */}
                <AnimatePresence mode="wait">
                  {fulfillmentType === 'pickup' && (
                    <motion.div 
                      key="pickup-info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-gray-900 rounded-[24px] p-6 text-white mb-8 relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black tracking-widest text-primary-400 uppercase">Shop Hub Address</span>
                        </div>
                        <p className="text-sm font-bold leading-relaxed mb-6 text-gray-200">
                          7, Thennanjalai Rd, opposite to Passport Office, Subaiya Nagar, Orleanpet, Puducherry, 605001
                        </p>
                        <div className="flex gap-3">
                          <button 
                            onClick={handleCopyAddress}
                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Address'}
                          </button>
                          <a 
                            href="https://maps.app.goo.gl/gDMbH5ui4UtXfjye6" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(242,147,37,0.3)]"
                          >
                            <Map className="w-4 h-4" />
                            Directions
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {fulfillmentType === 'delivery' && (
                    <motion.div 
                      key="delivery-info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-100 rounded-[24px] p-6 text-green-900 mb-8 relative border-2 border-green-200"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-black tracking-widest text-green-700 uppercase">Delivery Details</span>
                        </div>
                        <p className="text-sm font-bold leading-relaxed mb-4">
                          Enter your address so we can bring the bike to you!
                        </p>
                        
                        <div className="mb-2">
                          <textarea 
                            placeholder="Flat/House No, Apartment, Landmark..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 text-sm font-bold transition-all min-h-[80px]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={!fulfillmentType || reserving || (fulfillmentType === 'delivery' && !deliveryAddress)}
                  onClick={handleFinalizeBooking}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                    fulfillmentType && !(fulfillmentType === 'delivery' && !deliveryAddress)
                      ? (fulfillmentType === 'delivery' ? 'bg-green-600' : 'bg-gray-900') + ' text-white shadow-xl hover:translate-y-[-2px]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {reserving ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    'Confirm & Proceed'
                  )}
                  {!reserving && <ArrowLeft className="w-5 h-5 rotate-180" />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default BikeDetails

