import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail, MapPin, Star } from 'lucide-react'
import logoImage from '../Media/new_logo2.png'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src={logoImage} alt="Retro Bike Rent" className="w-12 h-12 object-contain bg-white p-1 rounded-md" />
            <span className="text-2xl font-black tracking-tight">Retro Bike Rent</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
            Providing premium two-wheeler rentals to tourists and locals in Pondicherry since 2016. Your journey is our priority.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><button onClick={() => navigate('/bikes')} className="text-gray-400 hover:text-white transition-colors">Rent a Bike</button></li>
            <li><button onClick={() => navigate('/gallery')} className="text-gray-400 hover:text-white transition-colors">Our Gallery</button></li>
            <li><button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</button></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> +91 78069 74223</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> support@retrobikes.in</li>
            <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-1 flex-shrink-0" /> No:2, Thiyagarajan street, near New Bus stand, lyyanar Nagar, Raja Nagar, Orleanpet, Puducherry, 605013</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Retro Bike Rent Pondicherry. All rights reserved.</p>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          Made with <Star className="w-4 h-4 text-red-500 fill-red-500" /> in Pondicherry
        </div>
      </div>
    </footer>
  )
}

export default Footer
