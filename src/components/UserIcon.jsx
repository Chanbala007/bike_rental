import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const UserIcon = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <User className="w-6 h-6 text-gray-700" />
    </motion.button>
  )
}

export default UserIcon
