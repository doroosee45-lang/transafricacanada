
import type { Config } from 'tailwindcss';

const blueScale = {
  50: '#F7FAFE',
  100: '#EDF5FC',
  200: '#DCE9F5',
  300: '#C5DCEF',
  400: '#79B5E8',
  500: '#4D91D9',
  600: '#347FC5',
  700: '#347FC5',
  800: '#172F50',
  900: '#172F50',
};

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: { ...blueScale, 950: '#172F50' },
        sky: {
          ...blueScale,
          500: '#79B5E8',
          600: '#4D91D9',
          700: '#347FC5',
        },
        cyan: {
          ...blueScale,
          500: '#79B5E8',
          600: '#4D91D9',
          700: '#347FC5',
        },
        easy: {
          gold: '#4D91D9',
          ink: '#172F50',
          cream: '#EDF5FC',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
