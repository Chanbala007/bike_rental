/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f29325',
          600: '#f29325',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
      },
    },
  },
  plugins: [],
}

