import React from 'react'
import { MapPin, Phone, Compass, Star } from 'lucide-react'

const LocationSection = () => {
  return (
    <section className="py-12 md:py-20 px-5 sm:px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Our Shop</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">Pick up your ride directly from our hub in the heart of Pondicherry.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Left: Contact Info */}
          <div className="w-full md:w-1/3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white z-10 relative">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              Retro Bike Rent <Star className="w-5 h-5 fill-primary-500 text-primary-500" />
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Address</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    No:2, Thiyagarajan street,<br />
                    near New Bus stand, lyyanar Nagar,<br />
                    Raja Nagar, Orleanpet,<br />
                    Puducherry, 605013
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Phone</p>
                  <p className="text-gray-600 text-sm">+91 78069 74223</p>
                </div>
              </div>
            </div>

            {/* Guide Callout */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-200/50 rounded-full blur-xl group-hover:bg-blue-300/50 transition-colors" />
              <div className="flex gap-3 items-start relative z-10">
                <Compass className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900 text-sm mb-1">Free Tour Guide Advice</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Not sure where to go? Ask us! We offer free itineraries and local secrets to make your Pondy trip unforgettable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map Embed */}
          <div className="w-full md:w-2/3 h-[300px] md:h-auto md:min-h-[400px] bg-gray-200 relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15614.507261321689!2d79.8150928!3d11.9343911!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a536131b5d4c09f%3A0xc72aae7dae8c5209!2sRETRO%20BIKE%20RENT!5e0!3m2!1sen!2sin!4v1715922332000!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Retro Bike Rent Location"
            ></iframe>
            
            {/* Get Directions Button Overlay */}
            <div className="absolute bottom-6 right-6 z-10 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a 
                href="https://maps.app.goo.gl/sDncTntYZDAN8q7j7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-blue-50 hover:scale-105 transition-all"
              >
                <Compass className="w-5 h-5" />
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationSection
