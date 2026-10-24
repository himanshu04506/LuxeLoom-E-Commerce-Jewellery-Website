/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F7F2E7',
          200: '#EFE2C8',
          300: '#E2CB9C',
          400: '#D4AF37', // Pure Gold Accent
          500: '#C5A059', // Warm Champagne Gold
          600: '#A6823F',
          700: '#856429',
          800: '#644A1B',
          900: '#433010',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          dark: '#F4EFEA',
        },
        obsidian: {
          DEFAULT: '#18181B',
          light: '#27272A',
          dark: '#09090B',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
