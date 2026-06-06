import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logoImage from '../Media/new_logo2.png'

const Logo = ({ className = '', onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate('/')
    }
  }

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={logoImage}
        alt="Retro Bike Rent Logo"
        className="h-12 sm:h-14 object-contain"
      />
    </motion.div>
  )
}

export default Logo

