import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CartIcon = ({ onClick, light = false }) => {
  const { getCartCount } = useCart()
  const count = getCartCount()

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-2 rounded-lg transition-colors ${
        light ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ShoppingCart className="w-6 h-6" />
      {count > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary-600 rounded-full flex items-center justify-center px-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <span className="text-xs font-bold text-white">{count > 99 ? '99+' : count}</span>
        </motion.div>
      )}
    </motion.button>
  )
}

export default CartIcon

