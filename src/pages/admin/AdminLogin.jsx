import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Loader } from 'lucide-react'
import Logo from '../../components/Logo'
import { adminAuthAPI } from '../../services/api'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await adminAuthAPI.login(username, password)
      navigate('/admin') // Redirect to dashboard
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !username || !password}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all
                ${loading || !username || !password ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'}`}
              whileHover={!(loading || !username || !password) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !username || !password) ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLogin
