/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#010828',
        foreground: '#FFFFFF',
        'muted-foreground': '#A7A7AE',
        'neon-accent': '#6FFF00',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Condiment', 'cursive'],
      },
      animation: {
        'fade-rise': 'fade-rise 0.8s ease-out forwards',
        'fade-rise-delay': 'fade-rise 0.8s ease-out 0.2s forwards',
        'fade-rise-delay-2': 'fade-rise 0.8s ease-out 0.4s forwards',
      },
      keyframes: {
        'fade-rise': {
          '0%': {
            opacity: '0',
            transform: 'translateY(24px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
