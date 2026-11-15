/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9fe',
          300: '#a0befc',
          400: '#7199f8',
          500: '#4672f3',
          600: '#2b52e7',
          700: '#203ecb',
          800: '#1e34a4',
          900: '#1d2f82',
          950: '#131e50',
        },
      },
    },
  },
  plugins: [],
}
