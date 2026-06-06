// Dummy bike data
export const bikes = [
  {
    id: 1,
    name: "Royal Enfield Classic 350",
    price: 800,
    engineCC: "350cc",
    image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
    description: "Classic cruiser with timeless design. Perfect for long rides along the coast.",
    features: ["ABS", "Fuel Injection", "LED Lights", "Comfortable Seating"],
    status: "available"
  },
  {
    id: 2,
    name: "Yamaha MT-15",
    price: 600,
    engineCC: "155cc",
    image: "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
    description: "Sporty and agile. Great for city rides and short trips.",
    features: ["ABS", "Digital Display", "LED Headlight", "Sporty Design"],
    status: "available"
  },
  {
    id: 3,
    name: "Honda CB Shine",
    price: 400,
    engineCC: "125cc",
    image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
    description: "Reliable and fuel-efficient. Ideal for daily commuting.",
    features: ["Fuel Efficient", "Easy Handling", "Comfortable", "Low Maintenance"],
    status: "available"
  },
  {
    id: 4,
    name: "Bajaj Pulsar 200",
    price: 550,
    engineCC: "200cc",
    image: "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
    description: "Powerful and stylish. Perfect for adventure enthusiasts.",
    features: ["Powerful Engine", "Digital Console", "LED Tail Light", "Sporty Look"],
    status: "unavailable"
  },
  {
    id: 5,
    name: "TVS Apache RTR 160",
    price: 500,
    engineCC: "160cc",
    image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&h=600&fit=crop",
    description: "Racing DNA with street performance. Built for speed lovers.",
    features: ["Racing DNA", "ABS", "Digital Speedometer", "Aggressive Styling"],
    status: "available"
  },
  {
    id: 6,
    name: "Hero Splendor Plus",
    price: 350,
    engineCC: "100cc",
    image: "https://images.unsplash.com/photo-1558980664-1a0cf9a3e9a5?w=800&h=600&fit=crop",
    description: "Economical and reliable. Best for budget-conscious riders.",
    features: ["Ultra Fuel Efficient", "Low Cost", "Easy Maintenance", "Comfortable"],
    status: "available"
  }
];

// Dummy booking data for admin
export const bookings = [
  {
    id: 1,
    customerName: "Rajesh Kumar",
    bike: "Royal Enfield Classic 350",
    location: "Beach Road, Pondicherry",
    date: "2024-01-15",
    time: "10:00 AM",
    total: 800
  },
  {
    id: 2,
    customerName: "Priya Sharma",
    bike: "Yamaha MT-15",
    location: "White Town, Pondicherry",
    date: "2024-01-16",
    time: "2:00 PM",
    total: 600
  },
  {
    id: 3,
    customerName: "Amit Patel",
    bike: "Honda CB Shine",
    location: "Promenade Beach, Pondicherry",
    date: "2024-01-17",
    time: "9:00 AM",
    total: 400
  }
];

