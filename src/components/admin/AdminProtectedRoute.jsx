import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { adminAuthAPI } from '../../services/api'

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await adminAuthAPI.getMe()
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader className="w-10 h-10 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Verifying admin access...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute
