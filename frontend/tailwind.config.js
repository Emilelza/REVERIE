/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0812',
        ink2: '#120f1e',
        rose: '#e8637a',
        blush: '#f0a0b0',
        gold: '#e8b86d',
        sage: '#7db8a4',
        mist: '#c4b8d8',
        cream: '#f5ede8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'card-in': 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-up': 'fadeUp 0.4s ease both',
        'spin-slow': 'spin 1.2s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        cardIn: { from: { opacity: 0, transform: 'translateY(16px) scale(0.97)' }, to: { opacity: 1, transform: 'none' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
      },
    },
  },
  plugins: [],
}