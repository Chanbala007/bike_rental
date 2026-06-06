import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Image as ImageIcon, Loader, CheckCircle2, XCircle } from 'lucide-react'
import { galleryAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'

const GalleryManagement = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const data = await galleryAPI.getAllAdmin()
      setImages(data)
    } catch (err) {
      console.error('Error fetching gallery images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      try {
        const base64String = reader.result
        await galleryAPI.create({
          image_url: base64String,
          caption: file.name,
          sort_order: images.length,
          is_active: true
        })
        fetchImages()
      } catch (err) {
        console.error('Failed to upload image:', err)
        alert('Failed to upload image. It might be too large for the database.')
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    
    reader.readAsDataURL(file)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return
    
    try {
      await galleryAPI.delete(id)
      setImages(images.filter(img => img.id !== id))
    } catch (err) {
      console.error('Failed to delete image:', err)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await galleryAPI.toggleStatus(id, { is_active: !currentStatus })
      setImages(images.map(img => img.id === id ? { ...img, is_active: !currentStatus } : img))
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Upload and manage photos for the homepage and gallery.</p>
        </div>
        <div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Images Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Upload your best shop and vehicle photos here. They will appear on the homepage slideshow.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="aspect-video relative group">
                <img 
                  src={image.image_url} 
                  alt={image.caption || 'Gallery image'} 
                  className={`w-full h-full object-cover ${!image.is_active ? 'grayscale opacity-60' : ''}`}
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-4">
                  <button
                    onClick={() => handleToggleStatus(image.id, image.is_active)}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    {image.is_active ? <XCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {image.is_active ? 'Hide Image' : 'Show Image'}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {!image.is_active && (
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                    Hidden
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default GalleryManagement
