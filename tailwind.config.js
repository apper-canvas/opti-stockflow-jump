/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0891b2',
          600: '#0e7490',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#059669',
          600: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#d97706',
          600: '#c2410c',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#dc2626',
          600: '#b91c1c',
        }
      }
    },
  },
  plugins: [],
}