import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Loader, User } from 'lucide-react'
import { authAPI, customerAPI } from '../services/api'

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [authStep, setAuthStep] = useState('phone') // 'phone' | 'otp' | 'register'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [userData, setUserData] = useState(null)
  const [otpChannel, setOtpChannel] = useState('whatsapp') // 'sms' | 'whatsapp'
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await authAPI.sendOTP(phone, otpChannel)
      setAuthStep('otp')
    } catch (error) {
      setError(error.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.verifyOTP(phone, otp)
      const loggedInUser = response.user
      setUserData(loggedInUser)

      if (loggedInUser.is_new_user) {
        setAuthStep('register')
      } else {
        onSuccess(loggedInUser)
        onClose()
      }
    } catch (error) {
      setError(error.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await customerAPI.update(userData.id, {
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        email: registerForm.email
      })

      const updatedUser = {
        ...userData,
        first_name: registerForm.firstName,
        last_name: registerForm.lastName,
        email: registerForm.email
      }
      
      onSuccess(updatedUser)
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                {authStep === 'phone' && 'Welcome Back'}
                {authStep === 'otp' && 'Verify Mobile'}
                {authStep === 'register' && 'Complete Profile'}
              </h3>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-8">
              {/* Step 1: Phone */}
              {authStep === 'phone' && (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-gray-100">
                        <span className="text-sm font-bold text-gray-400">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) setPhone(e.target.value.replace(/\D/g, ''))
                        }}
                        className="w-full pl-16 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-primary-500 font-bold transition-all"
                        placeholder="00000 00000"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Receive OTP on</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOtpChannel('whatsapp')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                          otpChannel === 'whatsapp' 
                            ? 'border-primary-500 bg-primary-50 text-primary-900' 
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${otpChannel === 'whatsapp' ? 'bg-primary-500 animate-pulse' : 'bg-gray-300'}`} />
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpChannel('sms')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                          otpChannel === 'sms' 
                            ? 'border-primary-500 bg-primary-50 text-primary-900' 
                            : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${otpChannel === 'sms' ? 'bg-primary-500 animate-pulse' : 'bg-gray-300'}`} />
                        Normal SMS
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : `Get OTP via ${otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {authStep === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-gray-500 font-medium">One-Time Password has been sent to</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-black text-gray-900">+91 {phone}</span>
                      <button type="button" onClick={() => setAuthStep('phone')} className="text-primary-600 text-xs font-bold underline">Change</button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        if (e.target.value.length <= 6) setOtp(e.target.value.replace(/\D/g, ''))
                      }}
                      className="w-48 text-center text-3xl font-black tracking-[0.5em] px-4 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-primary-500 transition-all"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_-5px_rgba(242,147,37,0.4)] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : 'Confirm & Proceed'}
                  </button>
                </form>
              )}

              {/* Step 3: Registration */}
              {authStep === 'register' && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                      <input
                        type="text"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-primary-500 font-bold"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                      <input
                        type="text"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-primary-500 font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-primary-500 font-bold"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg mt-4 shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : 'Complete Setup'}
                  </button>
                </form>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-bold text-center mt-6 bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
