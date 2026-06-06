import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Loader } from 'lucide-react'

const BikeForm = ({ isOpen, onClose, bike = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    engineCC: '',
    price: '',
    description: '',
    status: 'available',
    category: 'bike',
    image: '',
    features: []
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (bike) {
      setFormData({
        name: bike.name || '',
        engineCC: bike.engineCC || '',
        price: bike.price || '',
        description: bike.description || '',
        status: bike.status || 'available',
        category: bike.category || 'bike',
        image: bike.image || '',
        features: bike.features || []
      })
      setImagePreview(bike.image || '')
    } else {
      setFormData({
        name: '',
        engineCC: '',
        price: '',
        description: '',
        status: 'available',
        category: 'bike',
        image: '',
        features: []
      })
      setImagePreview('')
    }
    setErrors({})
  }, [bike, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you'd upload this to a server
      // For now, we'll just use a placeholder
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Bike name is required'
    if (!formData.engineCC.trim()) newErrors.engineCC = 'Engine CC is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving bike:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {bike ? 'Edit Bike' : 'Add New Bike'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Bike Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bike Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-600 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Bike Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bike Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="e.g., Royal Enfield Classic 350"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Engine CC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engine CC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="engineCC"
                value={formData.engineCC}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.engineCC ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="e.g., 350cc"
              />
              {errors.engineCC && (
                <p className="mt-1 text-sm text-red-500">{errors.engineCC}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Day (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.price ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="e.g., 800"
                min="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                placeholder="Describe the bike..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Status & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="available"
                      checked={formData.status === 'available'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="unavailable"
                      checked={formData.status === 'unavailable'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Unavailable</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="bike"
                      checked={formData.category === 'bike'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Bike</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="scooter"
                      checked={formData.category === 'scooter'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Scooter</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Bike'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BikeForm

