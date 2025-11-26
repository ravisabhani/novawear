/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
          light: '#9f7aea',
        },
        secondary: {
          DEFAULT: '#06b6d4',
          light: '#67e8f9',
        },
        accent: '#fb7185',
        ink: '#0b1220',
        sand: '#fff8f2',
        night: '#0f1724',
        muted: '#64748b',
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
