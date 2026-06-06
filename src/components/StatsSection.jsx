import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ZoomIn, LayoutGrid, ArrowRight } from 'lucide-react'

const StatsSection = ({ images = [] }) => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)

  const userImageUrls = images.filter(img => img.is_active !== false).map(img => img.image_url)
  const totalImages = userImageUrls.length

  const [slotIndices, setSlotIndices] = useState(() =>
    Array.from({ length: 10 }).map((_, i) => i % (totalImages || 10))
  )

  useEffect(() => {
    setSlotIndices(Array.from({ length: 10 }).map((_, i) => i % (totalImages || 10)))
  }, [totalImages])

  useEffect(() => {
    if (totalImages <= 10) return
    const interval = setInterval(() => {
      setSlotIndices(prev => {
        const next = [...prev]
        const slotToSwap = Math.floor(Math.random() * 10)
        const available = Array.from({ length: totalImages }, (_, i) => i).filter(i => !next.includes(i))
        if (available.length > 0) {
          next[slotToSwap] = available[Math.floor(Math.random() * available.length)]
        }
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [totalImages])

  const placeholders = [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80',
    'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=80',
    'https://images.unsplash.com/photo-1558980394-0a37e155bc22?w=400&q=80',
    'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=400&q=80',
    'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=400&q=80',
    'https://images.unsplash.com/photo-1558981001-1995369a39a9?w=400&q=80',
    'https://images.unsplash.com/photo-1558980663-3685c1d673c4?w=400&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80',
  ]

  const displayImages = slotIndices.map(index =>
    totalImages > 0 ? userImageUrls[index] : placeholders[index]
  )

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  // Plain render function (NOT a component) — avoids React unmounting it on every state change,
  // which would reset the whileInView animation and leave images invisible.
  const renderImageTile = (index, className = '', rounded = 'rounded-2xl') => (
    <motion.div
      key={`tile-${index}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden cursor-pointer group ${rounded} ${className}`}
      onClick={() => setSelectedImage(displayImages[index])}
    >
      <AnimatePresence>
        <motion.img
          key={displayImages[index]}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          src={displayImages[index]}
          alt="Gallery"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <ZoomIn className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-lg" />
      </div>
    </motion.div>
  )

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-5 gap-2 xs:gap-2.5 sm:gap-4 md:gap-6 items-center">
          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col justify-center text-left"
          >
            <span className="text-[7px] xs:text-[9px] sm:text-xs md:text-sm font-bold text-gray-500 tracking-wider leading-none uppercase">REGULARLY SERVICED</span>
            <span className="text-[14px] xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary-500 mt-0.5 sm:mt-1 leading-none uppercase">FLEET</span>
          </motion.div>
          {renderImageTile(0, 'aspect-square shadow-sm')}
          {renderImageTile(1, 'aspect-square shadow-sm')}
          {renderImageTile(2, 'aspect-square shadow-sm border border-primary-400 sm:border-2 md:border-4')}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col justify-center text-right"
          >
            <span className="text-[14px] xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-none uppercase">6000+</span>
            <span className="text-[7px] xs:text-[9px] sm:text-xs md:text-sm font-bold text-gray-500 tracking-wider mt-0.5 sm:mt-1 leading-none uppercase">BIKES ON ROAD</span>
          </motion.div>

          {/* Row 2 */}
          {renderImageTile(3, 'aspect-square shadow-sm')}
          {renderImageTile(4, 'aspect-square shadow-sm')}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col justify-center items-center text-center"
          >
            <span className="text-[18px] xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none">10</span>
            <span className="text-[5.5px] xs:text-[7.5px] sm:text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5 sm:mt-1 leading-none">YEARS OF</span>
            <span className="text-[5.5px] xs:text-[7.5px] sm:text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">EXCELLENCE</span>
          </motion.div>
          {renderImageTile(5, 'aspect-square shadow-sm')}
          {renderImageTile(6, 'aspect-square shadow-sm')}

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col justify-center text-left"
          >
            <span className="text-[7px] xs:text-[9px] sm:text-xs md:text-sm font-bold text-gray-500 tracking-wider leading-none uppercase">SPREAD ACROSS</span>
            <span className="text-[12px] xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mt-0.5 sm:mt-1 leading-none uppercase">20+ CITIES</span>
          </motion.div>
          {renderImageTile(7, 'aspect-square shadow-sm border border-primary-400 sm:border-2 md:border-4')}
          {renderImageTile(8, 'aspect-square shadow-sm')}
          {renderImageTile(9, 'aspect-square shadow-sm')}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col justify-center text-right"
          >
            <span className="text-[14px] xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary-500 leading-none uppercase">1.8M+</span>
            <span className="text-[7px] xs:text-[9px] sm:text-xs md:text-sm font-bold text-gray-800 tracking-wider mt-0.5 sm:mt-1 leading-none uppercase">HAPPY USERS</span>
          </motion.div>
        </div>

        {/* Unified CTA */}
        <div className="mt-10 md:mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-850 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl md:rounded-full transition-colors shadow-lg text-xs sm:text-sm md:text-base"
          >
            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
            Visit Full Gallery
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        </div>
      </div>

      {/* ──────────── LIGHTBOX ──────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-full z-50 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ✕ Close
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default StatsSection
