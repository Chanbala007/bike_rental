import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, User, Phone, Mail, Loader, Search,
  CheckCircle, XCircle, AlertCircle, Navigation, Copy, Check,
  Plus, X, Store, ChevronDown, ChevronUp, IndianRupee, Bike, Bell, Printer
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import PrintableBill from '../../components/admin/PrintableBill'
import { useBookings } from '../../hooks/useBookings'
import { bikeAPI, bookingAPI, customerAPI } from '../../services/api'

const DEFAULT_FORM = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  bikeId: '',
  pickupDate: '',
  pickupTime: '10:00 AM',
  dropDate: '',
  dropTime: '10:00 AM',
  location: 'In-Shop, Walk-In',
  markBikeUnavailable: true,
}

const Bookings = () => {
  // Generate time slots (6 AM to 9 PM)
  const timeSlots = []
  for (let hour = 6; hour <= 21; hour++) {
    for (let min of ['00', '30']) {
      const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      timeSlots.push(`${h12}:${min} ${ampm}`)
    }
  }

  const { bookings, loading, error, refreshBookings } = useBookings()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchId, setSearchId] = useState('')
  const [bikes, setBikes] = useState({})
  const [allBikes, setAllBikes] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [copiedId, setCopiedId] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'walkin' | 'pickdrop'
  const [showForm, setShowForm] = useState(false)
  const [walkInForm, setWalkInForm] = useState(DEFAULT_FORM)
  const [walkInLoading, setWalkInLoading] = useState(false)
  const [walkInError, setWalkInError] = useState('')
  const [walkInSuccess, setWalkInSuccess] = useState(false)
  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerHistory, setCustomerHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null) // { id, value }
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [notifiedOverdueIds, setNotifiedOverdueIds] = useState(new Set())
  const [overdueCount, setOverdueCount] = useState(0)
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [bookingToPrint, setBookingToPrint] = useState(null)

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const bikesData = await bikeAPI.getAll()
        const bikesMap = {}
        bikesData.forEach(bike => { bikesMap[bike.id] = bike.name })
        setBikes(bikesMap)
        setAllBikes(bikesData)
      } catch (err) {
        console.error('Error fetching bikes:', err)
      }
    }

    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true)
        const data = await customerAPI.getAll()
        setCustomers(data)
      } catch (err) {
        console.error('Error fetching customers:', err)
      } finally {
        setCustomersLoading(false)
      }
    }

    fetchBikes()
    fetchCustomers()
  }, [])

  const handleViewHistory = async (customer) => {
    setSelectedCustomer(customer)
    setHistoryLoading(true)
    try {
      const history = await bookingAPI.getAll(customer.id)
      setCustomerHistory(history)
    } catch (err) {
      console.error('Error fetching customer history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Derived walk-in form calculations
  const selectedBike = allBikes.find(b => b.id === parseInt(walkInForm.bikeId))
  const formDays = (() => {
    if (walkInForm.pickupDate && walkInForm.dropDate) {
      const diff = Math.ceil(
        Math.abs(new Date(walkInForm.dropDate) - new Date(walkInForm.pickupDate)) / (1000 * 60 * 60 * 24)
      )
      return diff || 1
    }
    return 1
  })()
  const bikePricePerDay = selectedBike?.price_per_day || selectedBike?.price || 0
  const formTotalPrice = bikePricePerDay * formDays

  const get24hTime = (time12h) => {
    if (!time12h) return ''
    const [time, modifier] = time12h.split(' ')
    if (!modifier) return time // Already 24h
    let [hours, minutes] = time.split(':')
    if (hours === '12' && modifier === 'AM') hours = '00'
    if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  const checkIsOverdue = (booking) => {
    if (booking.status !== 'picked') return false
    
    try {
      // 1. Get Drop Date
      const dropDateStr = booking.dropDate.split('T')[0]
      // 2. Get Drop Time in 24h format
      const dropTime24 = get24hTime(booking.dropTime)
      
      const dropDateTime = new Date(`${dropDateStr}T${dropTime24}:00`)
      const now = new Date()
      
      // Calculate difference in minutes
      const diffMs = now - dropDateTime
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      // Allow 30 mins grace period. Notification in 31st min.
      return diffMins >= 31
    } catch (err) {
      console.error("Error checking overdue status:", err)
      return false
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone?.includes(searchQuery) ||
      booking.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bikes[booking.bikeId]?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesId = !searchId || booking.id.toString().includes(searchId)

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'walkin' && booking.bookingSource === 'walk_in')
    
    const matchesOverdueFilter = !showOverdueOnly || checkIsOverdue(booking)
    
    return matchesSearch && matchesId && matchesStatus && matchesTab && matchesOverdueFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'picked': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'picked': return <Bike className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A'
    return `${formatDate(dateString)} at ${timeString || 'N/A'}`
  }

  const handleCopyAddress = (id, address) => {
    const copy = () => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000) }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).then(copy)
    } else {
      const el = document.createElement('textarea')
      el.value = address
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      copy()
    }
  }


  // Auto-polling and Sound Effect
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refreshBookings()
    }, 60000) // Poll every 60 seconds

    return () => clearInterval(pollInterval)
  }, [])

  // Check for new overdue bookings whenever bookings update
  useEffect(() => {
    if (bookings.length === 0) return

    const overdue = bookings.filter(b => checkIsOverdue(b))
    setOverdueCount(overdue.length)

    // Check if there's any NEW overdue booking we haven't notified for
    const newOverdue = overdue.find(b => !notifiedOverdueIds.has(b.id))
    
    if (newOverdue) {
      // Play sound alert
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
      audio.play().catch(e => console.log("Sound play blocked: ", e))
      
      // Update notified set
      setNotifiedOverdueIds(prev => new Set([...prev, newOverdue.id]))
    }
  }, [bookings])

  const handleWalkInSubmit = async (e) => {
    e.preventDefault()
    if (!walkInForm.bikeId) { setWalkInError('Please select a bike.'); return }
    if (!walkInForm.pickupDate || !walkInForm.dropDate) { setWalkInError('Please select pickup and drop dates.'); return }
    if (new Date(walkInForm.dropDate) < new Date(walkInForm.pickupDate)) { setWalkInError('Drop date must be after pickup date.'); return }

    setWalkInLoading(true)
    setWalkInError('')
    setWalkInSuccess(false)

    try {
      await bookingAPI.createWalkIn({
        bike_id: parseInt(walkInForm.bikeId),
        customer_id: null,
        customer_name: walkInForm.customerName,
        customer_phone: walkInForm.customerPhone || null,
        customer_email: walkInForm.customerEmail || null,
        pickup_date: new Date(walkInForm.pickupDate).toISOString(),
        pickup_time: get24hTime(walkInForm.pickupTime),
        drop_date: new Date(walkInForm.dropDate).toISOString(),
        drop_time: get24hTime(walkInForm.dropTime),
        location: walkInForm.location || 'In-Shop, Walk-In',
        total_price: formTotalPrice,
        booking_source: 'walk_in',
        mark_bike_unavailable: walkInForm.markBikeUnavailable,
      })

      setWalkInSuccess(true)
      setWalkInForm(DEFAULT_FORM)
      setShowForm(false)
      refreshBookings()
      // Refresh bike list to reflect updated availability
      const bikesData = await bikeAPI.getAll()
      const bikesMap = {}
      bikesData.forEach(b => { bikesMap[b.id] = b.name })
      setBikes(bikesMap)
      setAllBikes(bikesData)
      setTimeout(() => setWalkInSuccess(false), 5000)
    } catch (err) {
      setWalkInError(err.message || 'Failed to create booking. Please try again.')
    } finally {
      setWalkInLoading(false)
    }
  }

  const updateForm = (field, value) => setWalkInForm(prev => ({ ...prev, [field]: value }))

  const handlePickUp = async (id) => {
    try {
      await bookingAPI.pick(id)
      refreshBookings()
    } catch (err) {
      alert('Error marking as picked: ' + err.message)
    }
  }

  const handleConfirmPayment = async (id) => {
    if (!window.confirm("Are you sure you want to mark this booking as PAID?")) return
    try {
      await bookingAPI.confirmPayment(id)
      refreshBookings()
    } catch (err) {
      alert('Error confirming payment: ' + err.message)
    }
  }

  const handleReturn = async (id) => {
    try {
      await bookingAPI.return(id)
      refreshBookings()
      alert('Bike returned successfully.')
    } catch (err) {
      alert('Error marking as returned: ' + err.message)
    }
  }

  const handleUpdateLocation = async (id) => {
    if (!editingLocation || editingLocation.id !== id) return
    setIsSavingLocation(true)
    try {
      await bookingAPI.updateLocation(id, editingLocation.value)
      setEditingLocation(null)
      refreshBookings()
    } catch (err) {
      alert('Error updating location: ' + err.message)
    } finally {
      setIsSavingLocation(false)
    }
  }

  const handlePrintBill = (booking) => {
    setBookingToPrint(booking)
    setTimeout(() => {
      window.print()
      // Optional: clear state after printing
      // setBookingToPrint(null) 
    }, 100)
  }

  // Location table/card shared rendering
  const renderLocationCell = (booking, mobile = false) => {
    if (!booking.location && !editingLocation) {
      return mobile ? null : <td className="px-6 py-4"></td>
    }
    const isEditing = editingLocation?.id === booking.id
    
    if (mobile) {
      return (
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">Delivery Location</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyAddress(`mob-${booking.id}`, booking.location)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all duration-200 ${copiedId === `mob-${booking.id}` ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {copiedId === `mob-${booking.id}` ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
            </div>
            {isEditing ? (
              <div className="space-y-2 mt-2">
                <input 
                  autoFocus
                  className="w-full px-3 py-2 text-sm border-2 border-primary-500 rounded-xl outline-none"
                  value={editingLocation.value}
                  onChange={(e) => setEditingLocation({ ...editingLocation, value: e.target.value })}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateLocation(booking.id)}
                    className="flex-1 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg"
                  >
                    {isSavingLocation ? '...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setEditingLocation(null)}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2 group/loc">
                <p className="text-sm text-gray-600 mb-2 leading-relaxed flex-1">{booking.location}</p>
                <button 
                  onClick={() => setEditingLocation({ id: booking.id, value: booking.location })}
                  className="p-1.5 opacity-0 group-hover/loc:opacity-100 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 text-primary-500 rotate-45" />
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }
    return (
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <input 
              autoFocus
              className="px-2.5 py-1.5 text-xs border-2 border-primary-500 rounded-lg outline-none"
              value={editingLocation.value}
              onChange={(e) => setEditingLocation({ ...editingLocation, value: e.target.value })}
            />
            <div className="flex gap-1.5">
              <button 
                onClick={() => handleUpdateLocation(booking.id)}
                className="flex-1 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-md"
              >
                {isSavingLocation ? '...' : 'Save'}
              </button>
              <button 
                onClick={() => setEditingLocation(null)}
                className="flex-1 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="group/dt inline-block relative max-w-[160px]">
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700 truncate">{booking.location}</div>
              <button 
                onClick={() => setEditingLocation({ id: booking.id, value: booking.location })}
                className="opacity-0 group-hover/dt:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-primary-500 rotate-45" />
              </button>
            </div>
          </div>
        )}
      </td>
    )
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Bookings</h1>
          <p className="text-gray-500">Manage all bike rental bookings</p>
        </div>

        {/* Overdue Alert Bar */}
        <AnimatePresence>
          {overdueCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-red-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 animate-pulse">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-red-900 leading-none mb-1 uppercase tracking-tight">Overdue Alert!</h2>
                    <p className="text-red-700 font-bold text-sm">
                      {overdueCount} {overdueCount === 1 ? 'bike is' : 'bikes are'} past the 30-minute return deadline.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md ${
                    showOverdueOnly 
                      ? 'bg-gray-900 text-white hover:bg-black' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {showOverdueOnly ? 'Show All Bookings' : 'View Overdue Bikes'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => { setActiveTab('all') }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => { setActiveTab('walkin'); setWalkInSuccess(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'walkin' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-700'}`}
          >
            <Store className="w-4 h-4" />
            Walk-In Bookings
          </button>
          <button
            onClick={() => { setActiveTab('users'); setWalkInSuccess(false) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-700'}`}
          >
            <User className="w-4 h-4" />
            Users
          </button>
        </div>

        {/* Walk-In Form Panel */}
        <AnimatePresence>
          {activeTab === 'walkin' && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-6"
            >
              {/* Success Banner */}
              {walkInSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Walk-in booking created successfully!</p>
                    <p className="text-sm text-green-600">The bike has been marked as unavailable and the booking is confirmed.</p>
                  </div>
                </motion.div>
              )}

              {/* New Booking Toggle */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  onClick={() => setShowForm(v => !v)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">New Walk-In Booking</p>
                      <p className="text-sm text-gray-500">Create a booking for a customer at the shop</p>
                    </div>
                  </div>
                  {showForm ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={handleWalkInSubmit} className="border-t border-gray-100 p-6 space-y-6">
                        {walkInError && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{walkInError}</p>
                          </div>
                        )}

                        {/* Customer Details */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-500" />Customer Details
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                              <input
                                type="text" required
                                value={walkInForm.customerName}
                                onChange={e => updateForm('customerName', e.target.value)}
                                placeholder="e.g. Ravi Kumar"
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                              <input
                                type="tel"
                                value={walkInForm.customerPhone}
                                onChange={e => updateForm('customerPhone', e.target.value)}
                                placeholder="10-digit number"
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-gray-400">(optional)</span></label>
                              <input
                                type="email"
                                value={walkInForm.customerEmail}
                                onChange={e => updateForm('customerEmail', e.target.value)}
                                placeholder="customer@email.com"
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bike & Dates */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Bike className="w-4 h-4 text-primary-500" />Bike & Rental Period
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="sm:col-span-2 lg:col-span-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Select Bike <span className="text-red-500">*</span></label>
                              <select
                                required
                                value={walkInForm.bikeId}
                                onChange={e => updateForm('bikeId', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                              >
                                <option value="">-- Choose Bike --</option>
                                {allBikes.map(bike => (
                                  <option key={bike.id} value={bike.id} disabled={bike.status === 'unavailable'}>
                                    {bike.name} {bike.status === 'unavailable' ? '(Unavailable)' : `— ₹${bike.price_per_day}/day`}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Pickup Date <span className="text-red-500">*</span></label>
                              <input
                                type="date" required
                                value={walkInForm.pickupDate}
                                onChange={e => updateForm('pickupDate', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Pickup Time</label>
                              <select
                                value={walkInForm.pickupTime}
                                onChange={e => updateForm('pickupTime', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                {timeSlots.map(time => <option key={`p-${time}`} value={time}>{time}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Drop Date <span className="text-red-500">*</span></label>
                              <input
                                type="date" required
                                value={walkInForm.dropDate}
                                onChange={e => updateForm('dropDate', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Drop Time</label>
                              <select
                                value={walkInForm.dropTime}
                                onChange={e => updateForm('dropTime', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                {timeSlots.map(time => <option key={`d-${time}`} value={time}>{time}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Price Summary box */}
                          {selectedBike && walkInForm.pickupDate && walkInForm.dropDate && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                              className="mt-4 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-xl p-4 flex flex-wrap gap-6 items-center"
                            >
                              <div>
                                <p className="text-xs text-gray-500">Selected Bike</p>
                                <p className="font-semibold text-gray-900 text-sm">{selectedBike.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-semibold text-gray-900 text-sm">{formDays} day{formDays !== 1 ? 's' : ''}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Rate</p>
                                <p className="font-semibold text-gray-900 text-sm">₹{bikePricePerDay}/day</p>
                              </div>
                              <div className="ml-auto">
                                <p className="text-xs text-gray-500">Total Price</p>
                                <p className="text-2xl font-extrabold text-primary-600">₹{formTotalPrice}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Location */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-500" />Pickup / Delivery Location
                          </h3>
                          <input
                            type="text"
                            value={walkInForm.location}
                            onChange={e => updateForm('location', e.target.value)}
                            placeholder="e.g. In-Shop, Walk-In or customer address"
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        {/* Options */}
                        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <input
                            type="checkbox"
                            id="markUnavailable"
                            checked={walkInForm.markBikeUnavailable}
                            onChange={e => updateForm('markBikeUnavailable', e.target.checked)}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                          <label htmlFor="markUnavailable" className="text-sm text-amber-900 cursor-pointer">
                            <span className="font-semibold">Mark bike as unavailable</span> — hides it from the online booking website until you manually re-enable it
                          </label>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3 pt-2">
                          <motion.button
                            type="submit"
                            disabled={walkInLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="flex-1 sm:flex-none sm:w-64 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {walkInLoading ? (
                              <><Loader className="w-4 h-4 animate-spin" /> Creating Booking...</>
                            ) : (
                              <><Store className="w-4 h-4" /> Confirm Walk-In Booking</>
                            )}
                          </motion.button>
                          <button
                            type="button"
                            onClick={() => { setShowForm(false); setWalkInError(''); setWalkInForm(DEFAULT_FORM) }}
                            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Booking ID..."
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-bold"
              />
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, phone, email, or bike..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'users' ? (
          <div className="space-y-6">
            {customersLoading ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading customers...</p>
              </div>
            ) : (
              <>
                {/* User List - Desktop */}
                <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Contact</th>
                        <th className="px-6 py-4 text-center">Total Bookings</th>
                        <th className="px-6 py-4 text-right">Total Spent</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.filter(c => 
                        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.phone?.includes(searchQuery) ||
                        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(customer => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {customer.first_name[0]}{customer.last_name[0]}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{customer.first_name} {customer.last_name}</div>
                                <div className="text-[10px] text-gray-400">Created: {new Date(customer.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</div>
                            {customer.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                              {customer.total_bookings}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-indigo-600">
                            ₹{customer.total_spent.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleViewHistory(customer)}
                              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
                            >
                              View History
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* User List - Mobile */}
                <div className="md:hidden space-y-4">
                  {customers.filter(c => 
                    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.phone?.includes(searchQuery)
                  ).map(customer => (
                    <div key={customer.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                            {customer.first_name[0]}{customer.last_name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{customer.first_name} {customer.last_name}</h3>
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total Spent</p>
                          <p className="text-lg font-black text-indigo-600">₹{customer.total_spent.toFixed(0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="text-xs text-gray-500">
                          <span className="font-bold text-gray-700">{customer.total_bookings}</span> Bookings
                        </div>
                        <button
                          onClick={() => handleViewHistory(customer)}
                          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"
                        >
                          View History
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center text-primary-600">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading bookings...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <p className="text-red-600">Error: {error}</p>
                <button onClick={refreshBookings} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Retry</button>
              </div>
            )}

            {/* Bookings List */}
            {!loading && !error && (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bike</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Drop</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="sticky right-0 bg-gray-50 px-4 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider z-10 shadow-[-12px_0_15px_-10px_rgba(0,0,0,0.1)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredBookings.map(booking => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{booking.id}
                            {booking.bookingSource === 'walk_in' && (
                              <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">In-Shop</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-bold">{booking.customerName}</div>
                            <div className="text-[11px] text-gray-500">{booking.customerPhone}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {bikes[booking.bikeId] || `Bike #${booking.bikeId}`}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{formatDate(booking.pickupDate)}</div>
                            <div className="text-[11px] text-gray-500">{booking.pickupTime}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{formatDate(booking.dropDate)}</div>
                            <div className="text-[11px] text-gray-500">{booking.dropTime}</div>
                          </td>
                          {renderLocationCell(booking)}
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            <div>₹{booking.totalPrice}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(booking.status)} w-fit`}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </span>
                              {checkIsOverdue(booking) && (
                                <motion.span 
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-red-600 text-white border border-red-700 w-fit"
                                >
                                  OVERDUE
                                </motion.span>
                              )}
                            </div>
                          </td>
                          <td className="sticky right-0 bg-white group-hover:bg-gray-50 px-4 py-4 whitespace-nowrap text-right text-sm font-medium z-10 shadow-[-12px_0_15px_-10px_rgba(0,0,0,0.1)] transition-colors">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleConfirmPayment(booking.id)}
                                className="text-amber-600 hover:text-amber-900 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition-all flex items-center gap-1.5"
                              >
                                <IndianRupee className="w-3.5 h-3.5" /> Confirm Payment
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handlePickUp(booking.id)}
                                className="text-purple-600 hover:text-purple-900 font-bold bg-purple-50 px-3 py-1 rounded-lg border border-purple-200 transition-colors"
                              >
                                Pick Up
                              </button>
                            )}
                            {booking.status === 'picked' && (
                              <button
                                onClick={() => handleReturn(booking.id)}
                                className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 transition-colors"
                              >
                                Return
                              </button>
                            )}
                            <button
                              onClick={() => handlePrintBill(booking)}
                              className="text-gray-600 hover:text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 transition-colors flex items-center gap-1"
                              title="Print Bill"
                            >
                              <Printer className="w-4 h-4" /> Print
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                  {filteredBookings.map(booking => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-md p-5 border-2 border-transparent"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">#{booking.id}</h3>
                            {booking.bookingSource === 'walk_in' && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">In-Shop</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{bikes[booking.bikeId] || `Bike #${booking.bikeId}`}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                          {checkIsOverdue(booking) && (
                            <motion.span 
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white border border-red-700 w-fit mt-1"
                            >
                              OVERDUE
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                            {booking.customerPhone && <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{booking.customerPhone}</p>}
                            {booking.customerEmail && <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{booking.customerEmail}</p>}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-600">{formatDateTime(booking.pickupDate, booking.pickupTime)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Drop</p>
                            <p className="text-sm text-gray-600">{formatDateTime(booking.dropDate, booking.dropTime)}</p>
                          </div>
                        </div>
                        {renderLocationCell(booking, true)}
                        <div className="flex flex-col gap-2 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total Amount</span>
                            <div className="text-right">
                              <span className="text-lg font-bold text-primary-600">₹{booking.totalPrice}</span>
                          </div>
                          </div>
                          
                          {/* Mobile Actions */}
                             <div className="flex flex-wrap gap-2 mt-2">
                                {booking.status === 'pending' && (
                                  <button
                                    onClick={() => handleConfirmPayment(booking.id)}
                                    className="flex-1 min-w-[120px] py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                                  >
                                    <IndianRupee className="w-4 h-4" /> Confirm Payment
                                  </button>
                                )}
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => handlePickUp(booking.id)}
                                    className="flex-1 min-w-[120px] py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                                  >
                                    <Bike className="w-4 h-4" /> Pick Up
                                  </button>
                                )}
                                {booking.status === 'picked' && (
                                  <button
                                    onClick={() => handleReturn(booking.id)}
                                    className="flex-1 min-w-[120px] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" /> Return Bike
                                  </button>
                                )}
                                <button
                                  onClick={() => handlePrintBill(booking)}
                                  className="flex-1 min-w-[120px] py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                  <Printer className="w-4 h-4" /> Print Bill
                                </button>
                              </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer History Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner">
                      {selectedCustomer.first_name[0]}{selectedCustomer.last_name[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedCustomer.phone}</span>
                        {selectedCustomer.email && <span className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedCustomer.email}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Rentals</p>
                      <p className="text-3xl font-black text-gray-900">{selectedCustomer.total_bookings}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Spending</p>
                      <p className="text-3xl font-black text-indigo-600">₹{selectedCustomer.total_spent.toFixed(2)}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Booking History</h3>
                  
                  {historyLoading ? (
                    <div className="py-12 text-center"><Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" /><p className="text-gray-400">Fetching records...</p></div>
                  ) : customerHistory.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-100"><p className="text-gray-400 font-medium">No booking history found for this user.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {customerHistory.map(booking => (
                        <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-gray-400">#{booking.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>{booking.status}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg">{bikes[booking.bike_id] || `Bike #${booking.bike_id}`}</h4>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup</p><p className="text-xs text-gray-700 font-medium">{new Date(booking.pickup_date).toLocaleDateString()} at {booking.pickup_time}</p></div>
                              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drop-off</p><p className="text-xs text-gray-700 font-medium">{new Date(booking.drop_date).toLocaleDateString()} at {booking.drop_time}</p></div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-3 md:pt-0 md:pl-6">
                            <p className="text-xs text-gray-400 font-medium">Payment</p>
                            <p className="text-xl font-black text-gray-900">₹{booking.total_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      <PrintableBill booking={bookingToPrint} bikeName={bookingToPrint ? bikes[bookingToPrint.bikeId] : ''} />
    </AdminLayout>
  )
}

export default Bookings
