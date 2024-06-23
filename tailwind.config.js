/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './home/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        'pacific-blue': '#1cbbb4',
      },
    },
  },
  plugins: [],
}

