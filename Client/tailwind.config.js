/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {

      },
    },
  },
  plugins: [
    require("@designbycode/tailwindcss-conic-gradient"),
  ],
}

