# Bike Rental Booking App

A modern, mobile-first bike rental booking web application built with React, Tailwind CSS, and Framer Motion.

## Features

- 🎨 Modern, premium UI/UX design
- 📱 Mobile-first responsive design
- ✨ Smooth animations with Framer Motion
- 🚴 Browse and book bikes
- 📍 Location selection
- 📋 Booking summary
- 👨‍💼 Admin dashboard preview

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── data/           # Dummy data
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

## Pages

1. **Home** (`/`) - Landing page with hero section
2. **Bike Listing** (`/bikes`) - Browse available bikes
3. **Bike Details** (`/bike/:id`) - View bike details and select date/time
4. **Location Selection** (`/location`) - Choose delivery location
5. **Booking Summary** (`/summary`) - Review booking and proceed to payment
6. **Admin Dashboard** (`/admin`) - View all bookings (UI only)

## Notes

- This is a UI prototype only - no backend integration
- Uses dummy JSON data for bikes and bookings
- Payment integration is not implemented
- Map integration is placeholder only

