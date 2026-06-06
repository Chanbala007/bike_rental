import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Loader } from 'lucide-react'
import { galleryAPI } from '../services/api'
import Navbar from '../components/Navbar'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const data = await galleryAPI.getAll()
      setImages(data)
    } catch (err) {
      console.error('Failed to fetch gallery images:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        <div className="text-center mb-10 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4"
          >
            Our <span className="text-primary-600">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Take a look at our premium fleet and happy customers around Pondicherry.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">More photos coming soon!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.image_url} 
                  alt="Gallery photo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white font-bold text-xl p-2"
            onClick={() => setSelectedImage(null)}
          >
            Close
          </button>
          <img 
            src={selectedImage.image_url} 
            alt={selectedImage.caption} 
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 px-5 border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-medium">© 2026 Retro Bike Rent Pondicherry.</p>
        </div>
      </footer>
    </div>
  )
}

export default Gallery
