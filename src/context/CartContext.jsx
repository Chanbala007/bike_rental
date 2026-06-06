import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bikeCart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        // Handle migration from single item to array
        let items = []
        if (Array.isArray(parsed)) {
          items = parsed
        } else if (parsed && parsed.bikeId) {
          // Old format - single item
          items = [parsed]
        }
        // Ensure all items have quantity field
        items = items.map(item => ({
          ...item,
          quantity: item.quantity || 1
        }))
        setCartItems(items)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('bikeCart', JSON.stringify(cartItems))
    } else {
      localStorage.removeItem('bikeCart')
    }
  }, [cartItems])

  const addToCart = (bike, pickupDate, pickupTime, dropDate, dropTime) => {
    const cartData = {
      id: Date.now(), // Unique ID for each cart item
      bikeId: bike.id,
      bikeName: bike.name,
      bikeImage: bike.image,
      pricePerDay: bike.price,
      engineCC: bike.engineCC,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
      quantity: 1, // Default quantity
      // Calculate days
      days: (() => {
        if (pickupDate && dropDate) {
          const pickup = new Date(pickupDate)
          const drop = new Date(dropDate)
          const diffTime = Math.abs(drop - pickup)
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
        }
        return 1
      })()
    }
    setCartItems(prev => [...prev, cartData])
    return true
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    if (newQuantity > 99) {
      return // Max quantity limit
    }
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const incrementQuantity = (itemId) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
    ))
  }

  const decrementQuantity = (itemId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (item.quantity <= 1) {
          return null // Will be filtered out
        }
        return { ...item, quantity: item.quantity - 1 }
      }
      return item
    }).filter(Boolean))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('bikeCart')
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const isBikeInCart = (bikeId) => {
    return cartItems.some(item => item.bikeId === bikeId)
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1
      return total + (item.pricePerDay * item.days * quantity)
    }, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    isBikeInCart,
    getCartCount,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

