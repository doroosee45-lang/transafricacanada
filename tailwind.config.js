/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {50:'#fff8ee',100:'#fdf0e2',200:'#f0dbb3',300:'#ecd5a3',400:'#d9b465',500:'#c7983a',600:'#a77b28',700:'#8a6520',800:'#77551c',900:'#563c18',950:'#302311'},
        sky: {50:'#fff8ee',100:'#fdf0e2',200:'#f0dbb3',300:'#ecd5a3',400:'#d9b465',500:'#c7983a',600:'#a77b28',700:'#8a6520',800:'#77551c',900:'#563c18'},
        cyan: {50:'#fff8ee',100:'#fdf0e2',200:'#f0dbb3',300:'#ecd5a3',400:'#d9b465',500:'#c7983a',600:'#a77b28',700:'#8a6520',800:'#77551c',900:'#563c18'},
        easy: {gold:'#C7983A',ink:'#171614',cream:'#FDF0E2'}
      },
      fontFamily: {sans:['Open Sans','Arial','sans-serif']}
    },
  },
  plugins: [],
}