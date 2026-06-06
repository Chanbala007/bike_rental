import { useState, useEffect } from 'react'
import { bikeAPI } from '../services/api'

export const useBike = (bikeId) => {
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (bikeId) {
      fetchBike(bikeId)
    }
  }, [bikeId])

  const fetchBike = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const data = await bikeAPI.getById(id)
      // Transform API response to match frontend format
      const transformedBike = {
        id: data.id,
        name: data.name,
        price: data.price_per_day,
        engineCC: data.engine_cc,
        image: data.image_url || null, // Will use fallback in component
        description: data.description || '',
        features: (() => {
          if (!data.features) return []
          try {
            return typeof data.features === 'string' ? JSON.parse(data.features) : data.features
          } catch {
            return []
          }
        })(),
        status: data.status || 'available'
      }
      setBike(transformedBike)
    } catch (err) {
      console.error('Error fetching bike:', err)
      setError(err.message)
      setBike(null)
    } finally {
      setLoading(false)
    }
  }

  return { bike, loading, error, refetch: () => fetchBike(bikeId) }
}

