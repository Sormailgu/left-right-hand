/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        sunshine: '#FFD93D',
        skyblue: '#6BCB77',
        mint: '#95E1D3',
        coral: '#F38181',
        chocolate: '#5D4037',
      },
      fontFamily: {
        rounded: ['Nunito', 'Quicksand', 'sans-serif'],
      },
      height: {
        'canvas-mobile': '50vh',
        'canvas-desktop': '24rem',
      },
    },
  },
  plugins: [],
}
