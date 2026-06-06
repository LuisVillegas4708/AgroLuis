/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#1B4332',  // verde campo profundo
          accent: '#52B788',   // verde lima activo
          tierra: '#D4A373',   // tierra cálida — alertas N2
          danger: '#C1121F',   // rojo urgente — alertas N3
          bg: '#F8F9FA',
          dark: '#1C1C1E',
          text: '#212529',
          muted: '#6C757D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      minHeight: {
        touch: '44px' // estándar UX táctil para uso en campo
      }
    }
  },
  plugins: []
}
