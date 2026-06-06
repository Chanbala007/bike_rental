import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bike, ChevronRight, Zap, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LocationSection from '../components/LocationSection'
import logoImage from '../Media/new_logo2.png'
import bikeBg from '../Media/bikes.jpeg'
import scooterBg from '../Media/scooters.jpeg'
import { galleryAPI } from '../services/api'

import TestimonialSection from '../components/TestimonialSection'
const Home = () => {
  const navigate = useNavigate()
  const [galleryImages, setGalleryImages] = useState([])

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const data = await galleryAPI.getAll()
      setGalleryImages(data)
    } catch (err) {
      console.error('Failed to fetch gallery images', err)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 sm:pt-24 sm:pb-14 md:pt-28 md:pb-20 lg:min-h-[85vh] lg:flex lg:items-center px-5 sm:px-6 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full filter blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            {/* Logo — prominent on mobile */}
            <motion.div variants={itemVariants} className="relative z-20 -mb-2 sm:-mb-3">
              <img
                src={logoImage}
                alt="Retro Bike Rent Logo"
                className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-72 lg:h-72 object-contain mx-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.03)]"
              />
            </motion.div>

            {/* Trusted Badge */}
            <motion.div variants={itemVariants} className="flex justify-center mb-3 sm:mb-5">
              <div className="bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-sm">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary-500 text-primary-500" />
                Premium Rentals in Pondicherry Since 2016
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-3 sm:mb-5 md:mb-8 tracking-tight leading-[1.1] relative z-10"
            >
              Rent Bikes Anywhere in
              <span className="block text-primary-500 mt-0.5 sm:mt-1">Pondicherry</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-xl md:text-2xl text-gray-600 mb-5 sm:mb-8 md:mb-14 max-w-2xl mx-auto font-light tracking-wide"
            >
              Select bike. Share location. Get it delivered.
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center">
              <button
                onClick={() => navigate('/bikes')}
                className="group relative px-7 py-3.5 sm:px-10 sm:py-5 bg-primary-600 text-white rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold shadow-[0_0_20px_rgba(242,147,37,0.3)] hover:shadow-[0_0_35px_rgba(242,147,37,0.5)] transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Book Now
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Background Icon */}
        <motion.div
          className="absolute right-[-5%] bottom-[10%] opacity-[0.12] hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Bike size={600} className="text-primary-500" />
        </motion.div>
      </section>

      {/* Category Selection */}
      <section className="py-10 sm:py-16 md:py-28 px-5 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-10 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Your Ride</h2>
            <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-primary-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
            {/* Bikes Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/bikes?category=bike')}
              className="relative group cursor-pointer h-[320px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 bg-white"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img src={bikeBg} alt="Bikes" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              </div>

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/40">
                    <Bike className="text-white w-6 h-6" />
                  </div>
                  <span className="text-primary-400 font-bold tracking-widest uppercase text-sm"></span>
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-3">Bikes</h3>
                <p className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                  Explore with power. Feel the thrill of the open road with our premium range of manual bikes.
                </p>
                <div className="mt-4 md:mt-8 flex items-center text-primary-500 font-bold group-hover:gap-2 transition-all text-sm sm:text-base">
                  Browse Bikes <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div className="absolute top-8 right-8 w-2 h-2 bg-primary-500 rounded-full animate-ping" />
            </motion.div>

            {/* Scooters Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/bikes?category=scooter')}
              className="relative group cursor-pointer h-[320px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 bg-white"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img src={scooterBg} alt="Scooters" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              </div>

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/40">
                    <Zap className="text-white w-6 h-6" />
                  </div>
                  <span className="text-primary-400 font-bold tracking-widest uppercase text-sm"></span>
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-3">Scooters</h3>
                <p className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                  Easy city rides. Zip through the streets of Pondicherry with comfort and style.
                </p>
                <div className="mt-4 md:mt-8 flex items-center text-primary-500 font-bold group-hover:gap-2 transition-all text-sm sm:text-base">
                  Browse Scooters <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-12 md:py-20 px-5 sm:px-6 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Gallery</h2>
              <p className="text-gray-500 text-sm sm:text-base">Real photos of our bikes and happy customers</p>
            </div>
            <button
              onClick={() => navigate('/gallery')}
              className="text-primary-600 font-bold flex items-center gap-2 hover:text-primary-700 transition-colors text-sm sm:text-base"
            >
              View Full Gallery <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative max-w-full overflow-hidden">
            {/* Auto-scrolling container */}
            <div className="flex gap-6 animate-scroll whitespace-nowrap px-4 py-4 hover:[animation-play-state:paused]">
              {/* Double the images for seamless infinite loop */}
              {[...galleryImages, ...galleryImages].map((img, index) => (
                <div
                  key={`${img.id}-${index}`}
                  className="w-[220px] sm:w-[280px] md:w-[350px] shrink-0 aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden relative group shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/gallery')}
                >
                  <img
                    src={img.image_url}
                    alt="Gallery photo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>

          {/* Add CSS for the scroll animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 12px)); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
          `}} />
        </section>
      )}


      <TestimonialSection />

      <LocationSection />
      <Footer />
    </div>
  )
}

export default Home

