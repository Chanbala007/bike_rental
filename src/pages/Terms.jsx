import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, AlertTriangle, Phone, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const termsList = [
    {
      title: 'Vehicle Condition & Damages',
      text: 'Customers must photograph the vehicle from all sides upon pickup; they are responsible for any new damage or scratches. If there are any damages and scratches, you have to pay for that.'
    },
    {
      title: 'Rental Duration & Boundaries',
      text: 'Vehicles are rented on a daily basis (not 24 hours), and must be returned by 9 PM. In case of any delay, an extra charge will be collected. The vehicle is not to be taken out of Pondicherry. We rent only for your local sightseeing (Maximum Range 20 kms). Driving to Pitchavaram & Mahabalipuram is not allowed.'
    },
    {
      title: 'Keys, Helmets & Punctures',
      text: 'Customers are responsible for any punctures made. Customers should keep their rental vehicle key safely; if you lose the key, you will be charged for a new lock set. Customers should keep their helmet safely; if lost, you will be charged for a new helmet.'
    },
    {
      title: 'Traffic Rules & Fines',
      text: 'Customers should strictly obey the traffic rules according to Puducherry Government. Triple riding, going one way, parking in a no-parking zone are strictly prohibited. If caught by police, the customer is solely responsible for the fine amount, which will be more than ₹1000 to ₹5000.'
    },
    {
      title: 'Belongings Security',
      text: 'Customers are advised not to keep their expensive things inside the vehicle box.'
    },
    {
      title: 'Fuel Policy',
      text: 'While returning the vehicle, customers should not bargain money for excess petrol.'
    },
    {
      title: 'Breakdowns & Recovery',
      text: 'In case of any problem in the vehicle, customers are advised to inform us and share the location for recovery.'
    },
    {
      title: 'Extensions',
      text: 'Customers should inform us earlier for extending of renting days.'
    },
    {
      title: 'Accidents',
      text: 'If any accident occurs, customers are responsible for recovery charges & travelling charges.'
    },
    {
      title: 'Overnight Parking',
      text: 'Please lock the vehicle always and keep the vehicle in a safe place at night.'
    },
    {
      title: 'Closing Hours',
      text: 'We close at 9:00 PM on all days. You will have to await your turn to return the scooter, plan accordingly.'
    },
    {
      title: 'No Vehicle Zones',
      text: 'Gandhi Beach, Rock Beach, and Promenade are No Vehicle Zones. (If found driving or parked, the Police will fine you).'
    },
    {
      title: 'Beach Safety Warnings',
      text: 'On the Beaches: Do not Drink and Swim, Be Safe, Be Alert. (Stay in the knee-deep water, sudden depth inside the water).'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary-100 text-primary-600 rounded-full shadow-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
              Terms <span className="text-primary-500">and</span> Conditions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Please read these terms carefully before booking a ride. By using our service, you agree to comply with the rules below.
            </p>
          </motion.div>

          {/* Terms List */}
          <div className="space-y-6 sm:space-y-8 relative">
            {/* Background decorative line */}
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px bg-gray-200 hidden sm:block"></div>

            {termsList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 group"
              >
                {/* Number Indicator */}
                <div className="hidden sm:flex flex-shrink-0 w-20 justify-end relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:border-primary-500 group-hover:text-primary-600 transition-colors shadow-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-grow bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 text-primary-500 sm:hidden" />
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[15px] sm:text-base">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-red-50 border-l-4 border-red-500 p-6 sm:p-8 rounded-r-2xl shadow-sm flex items-start sm:items-center gap-4 sm:gap-6 flex-col sm:flex-row"
          >
            <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-900 mb-1">Emergency Contact</h4>
              <p className="text-red-700 font-medium text-lg flex items-center gap-2 flex-wrap">
                In case of any emergency, please contact
                <span className="font-black bg-red-200 px-3 py-1 rounded-lg flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Mr. Uday - 7806974223
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Terms
