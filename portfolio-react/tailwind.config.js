/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: '#f5f5f7',
        accent: '#888888',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Oswald"', 'sans-serif'],
        landing: ['"LandingFont"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
