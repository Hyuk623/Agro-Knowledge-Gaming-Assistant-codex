/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#16a34a',
          600: '#15803d'
        }
      }
    }
  },
  plugins: []
};
