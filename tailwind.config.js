/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // For pages directory
    './components/**/*.{js,ts,jsx,tsx}', // For components
    './src/app/**/*.{js,ts,jsx,tsx}', // Make sure to include src/app for app router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
