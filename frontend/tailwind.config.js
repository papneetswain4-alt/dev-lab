/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: {
          DEFAULT: '#080808',
          soft: '#101010',
          elevated: '#161616',
          border: 'rgba(255, 255, 255, 0.14)',
          'border-soft': 'rgba(255, 255, 255, 0.08)',
        },
        muted: '#9a9a9a',
        subtle: '#6f6f6f',
        foreground: '#ffffff',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'metal-nav': 'linear-gradient(105deg, #050505 0%, #242424 48%, #444444 100%)',
        'metal-glow': 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), transparent 70%)',
      },
    },
  },
  plugins: [],
}
