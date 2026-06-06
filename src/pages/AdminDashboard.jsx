import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, Eye } from 'lucide-react'
import { bookings } from '../data/bikes'
import Logo from '../components/Logo'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all bookings</p>
            </div>
            <div className="hidden sm:block">
              <Logo className="h-10" />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, colorClass: 'text-primary-600' },
            { label: 'Today', value: 3, colorClass: 'text-green-600' },
            { label: 'Pending', value: 1, colorClass: 'text-yellow-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.colorClass}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>
          
          <div className="divide-y">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {booking.customerName}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Bike:</span>
                        <span>{booking.bike}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span>{booking.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">₹{booking.total}</p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                    
                    <motion.button
                      className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      View on Map
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

