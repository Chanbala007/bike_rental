import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Bike, Calendar, Settings, User, LogOut, Image as ImageIcon } from 'lucide-react'
import Logo from '../Logo'
import { adminAuthAPI } from '../../services/api'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Bike, label: 'Bikes', path: '/admin/bikes' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await adminAuthAPI.logout()
      navigate('/admin/login')
    } catch (err) {
      console.error('Logout failed:', err)
      navigate('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            
            {/* Logo */}
            <Logo className="h-10" onClick={() => navigate('/admin')} />
          </div>

          {/* Admin Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">retrobikes_official</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              )
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              
              {/* Sidebar */}
              <motion.aside
                className="fixed left-0 top-[80px] bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden"
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <nav className="p-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path)
                          setSidebarOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                          active
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

