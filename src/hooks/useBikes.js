import { useState, useEffect } from 'react'
import { bikeAPI } from '../services/api'

export const useBikes = () => {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBikes()
  }, [])

  const fetchBikes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bikeAPI.getAll()
      // Transform API response to match frontend format
      const transformedBikes = data.map(bike => ({
        id: bike.id,
        name: bike.name,
        price: bike.price_per_day,
        engineCC: bike.engine_cc,
        image: bike.image_url || null, // Will use fallback in component
        description: bike.description || '',
        features: (() => {
          if (!bike.features) return []
          try {
            return typeof bike.features === 'string' ? JSON.parse(bike.features) : bike.features
          } catch {
            return []
          }
        })(),
        status: bike.status || 'available',
        category: bike.category || 'bike'
      }))
      setBikes(transformedBikes)
    } catch (err) {
      console.error('Error fetching bikes:', err)
      setError(err.message)
      // Fallback to dummy data if API fails
      setBikes([])
    } finally {
      setLoading(false)
    }
  }

  const refreshBikes = () => {
    fetchBikes()
  }

  return { bikes, loading, error, refreshBikes }
}

