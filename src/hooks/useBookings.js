import { useState, useEffect } from 'react'
import { bookingAPI } from '../services/api'

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingAPI.getAll()
      // Transform API response to match frontend format
      const transformedBookings = data.map(booking => ({
        id: booking.id,
        bikeId: booking.bike_id,
        customerId: booking.customer_id,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        pickupDate: booking.pickup_date,
        pickupTime: booking.pickup_time,
        dropDate: booking.drop_date,
        dropTime: booking.drop_time,
        location: booking.location,
        locationLat: booking.location_lat,
        locationLng: booking.location_lng,
        totalPrice: booking.total_price,
        status: booking.status || 'pending',
        bookingSource: booking.booking_source || 'online',
        pickedAt: booking.picked_at,
        returnedAt: booking.returned_at,
        createdAt: booking.created_at
      }))
      setBookings(transformedBookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const refreshBookings = () => {
    fetchBookings()
  }

  return { bookings, loading, error, refreshBookings }
}

