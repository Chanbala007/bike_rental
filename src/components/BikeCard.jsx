import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { handleImageError, getImageFallback } from '../utils/imageFallback'

const BikeCard = ({ bike }) => {
  const navigate = useNavigate()
  const { isBikeInCart, openCart } = useCart()

  const isInCart = isBikeInCart(bike.id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    
    // If this bike is already in cart, open cart drawer
    if (isInCart) {
      openCart()
      return
    }

    // Navigate to bike details to select dates
    navigate(`/bike/${bike.id}`)
  }

  return (
    <motion.div
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer h-full flex flex-col justify-between"
      whileHover={{ y: -6, boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/bike/${bike.id}`)}
    >
      <div>
        {/* Bike Image */}
        <div className="relative h-28 xs:h-36 sm:h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={bike.image || getImageFallback(bike.name)}
            alt={bike.name}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, bike.name)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* Bike Info */}
        <div className="p-3 xs:p-4 sm:p-5">
          <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-1">{bike.name}</h3>
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {bike.engineCC}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-3 pb-3 xs:px-4 xs:pb-4 sm:px-5 sm:pb-5 pt-0">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-t pt-2.5 sm:pt-4">
          <div>
            <p className="text-base sm:text-xl md:text-2xl font-black text-primary-600 leading-none">₹{bike.price}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-none">per day</p>
          </div>
          <motion.button
            className={`w-full xs:w-auto px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl font-bold transition-colors text-center ${
              isInCart
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            {isInCart ? 'Added ✓' : 'Book'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default BikeCard

