/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Cups & Clouds — warm espresso + cloud/cream paleti (Flat 2.0)
        espresso: {
          50: '#f7f3ee',
          100: '#ece2d6',
          200: '#d9c3ac',
          300: '#c2a07d',
          400: '#a97f55',
          500: '#8c6440',
          600: '#6f4e37', // ana kahve tonu
          700: '#573d2c',
          800: '#3b2a20', // espresso koyu
          900: '#241a13',
        },
        cloud: {
          50: '#f2f8fb',
          100: '#e2eff6',
          200: '#c2dded',
          300: '#96c4de',
          400: '#5ba6cb', // gökyüzü/cloud aksan
          500: '#3a89b3',
          600: '#2f6e97',
          700: '#2a597a',
          800: '#284b65',
          900: '#254056',
        },
        cream: '#f5efe6',
        // durum renkleri
        ok: '#2e9e6b',
        warn: '#d9902a',
        bad: '#d1523f',
      },
      boxShadow: {
        flat: '0 1px 2px rgba(59,42,32,0.06), 0 8px 24px rgba(59,42,32,0.06)',
        'flat-lg': '0 2px 4px rgba(59,42,32,0.06), 0 16px 40px rgba(59,42,32,0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
