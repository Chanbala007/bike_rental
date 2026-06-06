import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Menu, X, Bike } from 'lucide-react'
import Logo from './Logo'
import CartIcon from './CartIcon'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { openCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes?category=bike' },
    { name: 'Scooters', path: '/bikes?category=scooter' },
  ]

  const isHome = location.pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100 ${
        isScrolled ? 'shadow-md py-3' : 'shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled || !isHome ? 'text-gray-700 hover:text-primary-600' : 'text-gray-800 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <CartIcon onClick={openCart} light={false} />
            <motion.button
              onClick={() => navigate('/profile')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </motion.button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-lg font-medium text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    navigate('/profile')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full text-left text-lg font-medium text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-xl"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
