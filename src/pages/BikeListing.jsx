import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, Loader } from 'lucide-react'
import BikeCard from '../components/BikeCard'
import Logo from '../components/Logo'
import CartIcon from '../components/CartIcon'
import UserIcon from '../components/UserIcon'
import Footer from '../components/Footer'
import LocationSection from '../components/LocationSection'
import { useCart } from '../context/CartContext'
import { useBikes } from '../hooks/useBikes'

const BikeListing = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [searchQuery, setSearchQuery] = useState('')
  const { openCart, getCartCount } = useCart()
  const { bikes, loading, error } = useBikes()

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  const filteredBikes = bikes.filter(bike => {
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || bike.category === categoryFilter
    const isAvailable = bike.status === 'available'
    return matchesSearch && matchesCategory && isAvailable
  })

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
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors animate-pulse"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div className="hidden sm:block">
              <Logo className="h-10" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1">
              Choose Your Ride
            </h1>
            <div className="flex items-center gap-2">
              <UserIcon onClick={() => navigate('/profile')} />
              <CartIcon onClick={openCart} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Quick Cart Summary Banner */}
      {getCartCount() > 0 && (
        <motion.div
          className="bg-primary-50 border-b border-primary-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{getCartCount()}</span>
                </div>
                <p className="text-sm text-primary-900 font-medium">
                  {getCartCount()} {getCartCount() === 1 ? 'bike' : 'bikes'} in your cart
                </p>
              </div>
              <motion.button
                onClick={openCart}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4">
        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bikes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
          />
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: null, label: 'All Rides', icon: null },
            { id: 'bike', label: 'Bikes', icon: null },
            { id: 'scooter', label: 'Scooters', icon: null },
          ].map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                categoryFilter === cat.id
                  ? 'bg-primary-600 text-white shadow-primary-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bike Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading bikes...</p>
          </div>
        ) : error ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-500 mb-2">Error loading bikes: {error}</p>
            <p className="text-gray-500 text-sm">Please check your connection and try again.</p>
          </motion.div>
        ) : filteredBikes.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">No bikes found matching your search.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredBikes.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BikeCard bike={bike} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LocationSection />
      <Footer />
    </div>
  )
}

export default BikeListing

