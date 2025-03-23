/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          700: '#1A56DB',
        },
        gray: {
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#111928',
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
} 