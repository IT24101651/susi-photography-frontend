/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        beige: '#F5F0E8',
        sand: '#E8E0D0',
        text: '#2C2C2C',
        muted: '#8A8A8A',
        accent: '#C4A882',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Lato', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        ui: ['Manrope', 'Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
