import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Trash2, ArrowRight, Plus, Minus, MapPin, Truck, Phone, ArrowLeft, Copy, Map, Check, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { handleImageError, getImageFallback } from '../utils/imageFallback'

const CartDrawer = () => {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, clearCart, isCartOpen, closeCart, getTotalPrice } = useCart()
  const navigate = useNavigate()
  const [showFulfillmentModal, setShowFulfillmentModal] = useState(false)
  const [fulfillmentType, setFulfillmentType] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [copied, setCopied] = useState(false)
  
  const shopAddress = "7, Thennanjalai Rd, opposite to Passport Office, Subaiya Nagar, Orleanpet, Puducherry, 605001"

  const handleContinueBooking = () => {
    if (cartItems.length > 0) {
      setShowFulfillmentModal(true)
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(shopAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFinalizeBooking = () => {
    if (cartItems.length > 0) {
      const firstItem = cartItems[0]
      localStorage.setItem('bookingDetails', JSON.stringify({
        bike: {
          id: firstItem.bikeId,
          name: firstItem.bikeName,
          image: firstItem.bikeImage,
          price: firstItem.pricePerDay,
          engineCC: firstItem.engineCC
        },
        pickupDate: firstItem.pickupDate,
        pickupTime: firstItem.pickupTime,
        dropDate: firstItem.dropDate,
        dropTime: firstItem.dropTime,
        days: firstItem.days,
        fulfillmentType: fulfillmentType,
        location: fulfillmentType === 'pickup' ? '' : deliveryAddress,
        adminPhone: '+916384788089'
      }))

      setShowFulfillmentModal(false)
      closeCart()
      navigate('/summary')
    }
  }

  const totalPrice = getTotalPrice()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          key="cart-backdrop"
          className="fixed inset-0 bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
        />
      )}

      {isCartOpen && (
        <motion.div
          key="cart-drawer"
          className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cart</h2>
              {cartItems.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            {cartItems.length > 0 ? (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex gap-4 mb-4">
                        <img
                          src={item.bikeImage || getImageFallback(item.bikeName, 200, 200)}
                          alt={item.bikeName}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => handleImageError(e, item.bikeName)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm">{item.bikeName}</h3>
                            <motion.button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600 flex-shrink-0"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{item.engineCC}</p>
                          <p className="text-sm font-bold text-primary-600">
                            ₹{item.pricePerDay}/day
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mb-3 pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Quantity</span>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => decrementQuantity(item.id)}
                              className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </motion.button>
                            <span className="w-10 text-center font-bold text-gray-900">
                              {item.quantity || 1}
                            </span>
                            <motion.button
                              onClick={() => incrementQuantity(item.id)}
                              className="w-8 h-8 rounded-lg bg-primary-600 hover:bg-primary-700 flex items-center justify-center transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Pickup & Drop Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <p className="text-gray-500 mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                            Pickup
                          </p>
                          <p className="text-gray-700 font-medium">
                            {new Date(item.pickupDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <p className="text-gray-600">{item.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            Drop
                          </p>
                          <p className="text-gray-700 font-medium">
                            {new Date(item.dropDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <p className="text-gray-600">{item.dropTime}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          {item.days} {item.days === 1 ? 'day' : 'days'} × {item.quantity || 1}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{(item.pricePerDay * item.days * (item.quantity || 1))}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2 mb-3">
                    {cartItems.map((item) => {
                      const quantity = item.quantity || 1
                      const itemTotal = item.pricePerDay * item.days * quantity
                      return (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {item.bikeName} ({item.days} {item.days === 1 ? 'day' : 'days'}) × {quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{itemTotal}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.button
                    onClick={() => {
                      closeCart()
                      navigate('/bikes')
                    }}
                    className="w-full bg-white border-2 border-primary-600 text-primary-600 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Bike
                  </motion.button>
                  <motion.button
                    onClick={handleContinueBooking}
                    className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Booking
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  {cartItems.length > 1 && (
                    <motion.button
                      onClick={clearCart}
                      className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear All
                    </motion.button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <motion.button
                  onClick={closeCart}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Bikes
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Fulfillment Modal Overflowing outside Drawer */}
      <AnimatePresence>
        {showFulfillmentModal && (
          <motion.div 
            key="fulfillment-backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              key="fulfillment-modal"
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

                {/* Dynamic Content */}
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
                          {shopAddress}
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
                  disabled={!fulfillmentType || (fulfillmentType === 'delivery' && !deliveryAddress)}
                  onClick={handleFinalizeBooking}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                    fulfillmentType && !(fulfillmentType === 'delivery' && !deliveryAddress)
                      ? (fulfillmentType === 'delivery' ? 'bg-green-600' : 'bg-gray-900') + ' text-white shadow-xl hover:translate-y-[-2px]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm & Proceed
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default CartDrawer

