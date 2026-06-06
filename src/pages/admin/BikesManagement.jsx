import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Search, Package, Loader } from 'lucide-react'
import { bikeAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import BikeForm from '../../components/admin/BikeForm'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'
import { handleImageError, getImageFallback } from '../../utils/imageFallback'

const BikesManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [bikes, setBikes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBike, setSelectedBike] = useState(null)
  const [bikeToDelete, setBikeToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch bikes from API
  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bikeAPI.getAll()
      // Transform API response to match frontend format
      const transformedBikes = data.map(bike => ({
        id: bike.id,
        name: bike.name,
        price: bike.price_per_day,
        engineCC: bike.engine_cc,
        image: bike.image_url || null, // Will use fallback in component
        description: bike.description || '',
        features: (() => {
          if (!bike.features) return []
          try {
            return typeof bike.features === 'string' ? JSON.parse(bike.features) : bike.features
          } catch {
            return []
          }
        })(),
        status: bike.status || 'available',
        category: bike.category || 'bike'
      }))
      setBikes(transformedBikes)
    } catch (err) {
      console.error('Error fetching bikes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if we should open form from URL
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true)
      setSelectedBike(null)
      setSearchParams({})
    } else if (searchParams.get('action') === 'edit' && searchParams.get('id')) {
      const bike = bikes.find(b => b.id === parseInt(searchParams.get('id')))
      if (bike) {
        setSelectedBike(bike)
        setIsFormOpen(true)
        setSearchParams({})
      }
    }
  }, [searchParams, bikes, setSearchParams])

  const filteredBikes = bikes.filter(bike =>
    bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bike.engineCC.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async (formData) => {
    try {
      setLoading(true)
      // Transform frontend format to API format
      const apiData = {
        name: formData.name,
        engine_cc: formData.engineCC,
        price_per_day: parseFloat(formData.price),
        image_url: formData.image || null,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        features: Array.isArray(formData.features) 
          ? JSON.stringify(formData.features) 
          : (formData.features || null)
      }

      if (selectedBike) {
        // Update existing bike
        await bikeAPI.update(selectedBike.id, apiData)
      } else {
        // Create new bike
        await bikeAPI.create(apiData)
      }
      
      // Refresh bikes list
      await fetchBikes()
      setIsFormOpen(false)
      setSelectedBike(null)
    } catch (err) {
      console.error('Error saving bike:', err)
      alert(`Error saving bike: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (bikeToDelete) {
      try {
        setLoading(true)
        await bikeAPI.delete(bikeToDelete.id)
        // Refresh bikes list
        await fetchBikes()
        setIsDeleteModalOpen(false)
        setBikeToDelete(null)
      } catch (err) {
        console.error('Error deleting bike:', err)
        alert(`Error deleting bike: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const openEditForm = (bike) => {
    setSelectedBike(bike)
    setIsFormOpen(true)
  }

  const openDeleteModal = (bike) => {
    setBikeToDelete(bike)
    setIsDeleteModalOpen(true)
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bikes Management</h1>
            <p className="text-gray-600">Manage your bike inventory</p>
          </div>
          <motion.button
            onClick={() => {
              setSelectedBike(null)
              setIsFormOpen(true)
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Add New Bike
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bikes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && bikes.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading bikes...</p>
          </div>
        )}

        {/* Error State */}
        {error && bikes.length === 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-500 mb-2">Error loading bikes: {error}</p>
            <motion.button
              onClick={fetchBikes}
              className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBikes.length === 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchQuery ? 'No bikes found matching your search.' : 'No bikes added yet.'}
            </p>
            {!searchQuery && (
              <motion.button
                onClick={() => setIsFormOpen(true)}
                className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Add Your First Bike
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-4">
          {filteredBikes.map((bike, index) => (
            <motion.div
              key={bike.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex">
                <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
                  <img
                    src={bike.image || getImageFallback(bike.name, 200, 200)}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, bike.name)}
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{bike.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{bike.engineCC}</p>
                  <p className="text-lg font-bold text-primary-600 mb-3">₹{bike.price}/day</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      bike.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {bike.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize">
                      {bike.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openEditForm(bike)}
                      className="flex-1 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => openDeleteModal(bike)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bike
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Engine CC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBikes.map((bike, index) => (
                  <motion.tr
                    key={bike.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={bike.image || getImageFallback(bike.name, 100, 100)}
                          alt={bike.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => handleImageError(e, bike.name)}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{bike.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{bike.engineCC}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-600">₹{bike.price}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {bike.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bike.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {bike.status === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          onClick={() => openEditForm(bike)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => openDeleteModal(bike)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forms and Modals */}
        <BikeForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedBike(null)
          }}
          bike={selectedBike}
          onSave={handleSave}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setBikeToDelete(null)
          }}
          onConfirm={handleDelete}
          itemName={bikeToDelete?.name || ''}
        />
      </motion.div>
    </AdminLayout>
  )
}

export default BikesManagement

