// Helper function to get dynamic API URL
const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  if (window.location.hostname !== 'localhost' && url.includes('localhost')) {
    url = url.replace('localhost', window.location.hostname);
  }
  return url;
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${getApiUrl()}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Enable cookies
    ...options,
  }

  try {
    console.log('API Call:', url, config.method || 'GET')
    const response = await fetch(url, config)
    console.log('Response status:', response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP error! status: ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    // Provide more helpful error message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to backend API at ${getApiUrl()}. Make sure the backend server is running on port 8000.`)
    }
    throw error
  }
}

// Auth API
export const authAPI = {
  sendOTP: (phone, channel = 'sms') => apiCall('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, channel }),
  }),
  verifyOTP: (phone, otp) => apiCall('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  }),
  getMe: () => apiCall('/auth/me'),
  logout: () => apiCall('/auth/logout', {
    method: 'POST',
  }),
}

// Admin Auth API
export const adminAuthAPI = {
  login: (username, password) => apiCall('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  getMe: () => apiCall('/auth/admin/me'),
  logout: () => apiCall('/auth/admin/logout', {
    method: 'POST',
  }),
  getStats: (timeframe) => apiCall(`/bookings/admin/stats?timeframe=${timeframe}`),
}

// Bike API
export const bikeAPI = {
  getAll: () => apiCall('/bikes/'),
  getById: (id) => apiCall(`/bikes/${id}`),
  create: (bikeData) => apiCall('/bikes/', {
    method: 'POST',
    body: JSON.stringify(bikeData),
  }),
  update: (id, bikeData) => apiCall(`/bikes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bikeData),
  }),
  delete: (id) => apiCall(`/bikes/${id}`, {
    method: 'DELETE',
  }),
  getByStatus: (status) => apiCall(`/bikes/status/${status}`),
}

// Booking API
export const bookingAPI = {
  getAll: (customerId = null) => {
    const url = customerId ? `/bookings/?customer_id=${customerId}` : '/bookings/'
    return apiCall(url)
  },
  getMyBookings: () => apiCall('/bookings/my/bookings'),
  getById: (id) => apiCall(`/bookings/${id}`),
  create: (bookingData) => apiCall('/bookings/', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  createWalkIn: (bookingData) => apiCall('/bookings/admin/walk-in', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  pick: (id) => apiCall(`/bookings/${id}/pick`, { method: 'PUT' }),
  return: (id) => apiCall(`/bookings/${id}/return`, { method: 'PUT' }),
  notifyDelivery: (data) => apiCall('/bookings/notify-delivery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLocation: (id, location) => apiCall(`/bookings/${id}/location`, {
    method: 'PATCH',
    body: JSON.stringify({ location }),
  }),
  confirmPayment: (id) => apiCall(`/bookings/${id}/confirm-payment`, {
    method: 'PUT'
  }),
  getMyCount: () => apiCall('/bookings/my/count'),
}

// Customer API
export const customerAPI = {
  getAll: () => apiCall('/customers/'),
  getByPhone: (phone) => apiCall(`/customers/phone/${phone}`),
  create: (customerData) => apiCall('/customers/', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  getById: (id) => apiCall(`/customers/${id}`),
  update: (id, data) => apiCall(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// Payment API
export const paymentAPI = {
  createOrder: (orderData) => apiCall('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  verifyPayment: (paymentData) => apiCall('/payments/verify-payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
}

// Gallery API
export const galleryAPI = {
  getAll: () => apiCall('/gallery/'),
  getAllAdmin: () => apiCall('/gallery/all'),
  create: (imageData) => apiCall('/gallery/', {
    method: 'POST',
    body: JSON.stringify(imageData),
  }),
  toggleStatus: (id, statusData) => apiCall(`/gallery/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  }),
  delete: (id) => apiCall(`/gallery/${id}`, {
    method: 'DELETE',
  }),
}

