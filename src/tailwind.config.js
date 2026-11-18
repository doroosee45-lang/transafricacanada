/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8ee',
          100: '#fdf0e2',
          200: '#f0dbb3',
          300: '#ecd5a3',
          400: '#d9b465',
          500: '#c7983a',
          600: '#a77b28',
          700: '#8a6520',
          800: '#77551c',
          900: '#563c18',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}