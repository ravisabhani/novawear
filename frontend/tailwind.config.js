/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // warmer palette tuned for Indian fashion sites (saffron + peacock + maroon accents)
        primary: {
          // darken primary slightly to meet WCAG contrast requirements for text on primary
          DEFAULT: '#A03B00', // darker saffron — increases contrast against white
          dark: '#7A3000',
          light: '#FF9F5A',
        },
        secondary: {
          DEFAULT: '#0F766E', // deep teal/peacock
          light: '#34D399',
        },
        accent: '#7f1d1d', // deep maroon
        ink: '#0b1220',
        sand: '#fff8f2',
        night: '#0f1724',
        muted: '#6b7280',
      },
      boxShadow: {
        card: '0 20px 60px -20px rgba(15,23,42,0.3)',
        glass: '0 25px 80px -30px rgba(15, 23, 42, 0.6)',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
