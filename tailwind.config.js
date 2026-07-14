/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexara: {
          navy: '#0b1329',
          dark: '#0f172a',
          medium: '#1e293b',
          light: '#38bdf8',
          accent: '#0284c7',
          slate: '#64748b',
          text: '#f8fafc',
          bg: '#090d16',
        },
        compliance: {
          success: '#10b981', // green / compliant
          warning: '#f59e0b', // amber / expiring
          danger: '#ef4444',  // red / non-compliant
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
