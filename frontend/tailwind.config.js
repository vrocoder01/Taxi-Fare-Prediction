/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taxi: {
          yellow: '#FFB800',
          orange: '#FF8A00',
          amber: '#F59E0B',
          glow: 'rgba(255, 184, 0, 0.35)',
        },
        charcoal: {
          950: '#070709',
          900: '#0D0E12',
          850: '#13151B',
          800: '#1A1D24',
          700: '#262A34',
          600: '#393F4D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'taxi-glow': '0 0 25px rgba(255, 184, 0, 0.25)',
        'taxi-glow-lg': '0 0 45px rgba(255, 184, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
