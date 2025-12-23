/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f1114',   // Fond de la page
        cardBg: '#1a1c1e',   // Fond des widgets
        accentGreen: '#2ecc71',
        accentRed: '#e74c3c',
      },
      borderRadius: {
        '3xl': '24px', 
      }
    },
  },
  plugins: [],
}