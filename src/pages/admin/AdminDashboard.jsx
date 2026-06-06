import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bike, Calendar, TrendingUp, Package, Loader } from 'lucide-react'
import { bikeAPI, adminAuthAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('today')
  const [dashboardStats, setDashboardStats] = useState({ bookings_count: 0, revenue: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetchBikes()
  }, [])

  useEffect(() => {
    fetchDashboardStats()
  }, [timeframe])

  const fetchDashboardStats = async () => {
    setStatsLoading(true)
    try {
      const data = await adminAuthAPI.getStats(timeframe)
      setDashboardStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchBikes = async () => {
    try {
      const data = await bikeAPI.getAll()
      const transformedBikes = data.map(bike => ({
        id: bike.id,
        name: bike.name,
        price: bike.price_per_day,
        engineCC: bike.engine_cc,
        status: bike.status || 'available'
      }))
      setBikes(transformedBikes)
    } catch (err) {
      console.error('Error fetching bikes:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: Bike,
      label: 'Total Bikes',
      value: loading ? '...' : bikes.length,
      color: 'primary',
      path: '/admin/bikes'
    },
    {
      icon: Package,
      label: 'Active Bikes',
      value: loading ? '...' : bikes.filter(b => b.status !== 'unavailable').length,
      color: 'green',
      path: '/admin/bikes'
    },
    {
      icon: Calendar,
      label: "Bookings",
      value: statsLoading ? '...' : dashboardStats.bookings_count,
      color: 'blue',
      path: '/admin/bookings'
    },
    {
      icon: TrendingUp,
      label: 'Revenue',
      value: statsLoading ? '...' : `₹${dashboardStats.revenue?.toLocaleString('en-IN')}`,
      color: 'purple',
      path: '/admin/bookings'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600'
    }
    return colors[color] || colors.primary
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your bike rental business</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border-none bg-transparent focus:ring-0 text-sm font-semibold text-gray-700 cursor-pointer w-full"
            >
              <option value="today">Today</option>
              <option value="1week">This Week</option>
              <option value="1month">This Month</option>
              <option value="1year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(stat.path)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={() => navigate('/admin/bikes?action=add')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bike className="w-5 h-5" />
              Add New Bike
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/bookings')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5" />
              View Bookings
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

export default AdminDashboard

