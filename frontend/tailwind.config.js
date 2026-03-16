/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink:   '#0D0D0D',
        paper: '#F5F2EB',
        sage:  { DEFAULT: '#5C7A5C', light: '#8FA88F', dark: '#3D5C3D' },
        amber: { DEFAULT: '#C97B2E', light: '#E0A96D', dark: '#8A5420' },
        blush: '#D4857A',
        mist:  '#E8EDE8',
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(13,13,13,0.08), 0 4px 16px rgba(13,13,13,0.06)',
        'card-hover': '0 4px 12px rgba(13,13,13,0.12), 0 12px 32px rgba(13,13,13,0.1)',
        'modal':    '0 24px 80px rgba(13,13,13,0.2)',
      },
      animation: {
        'slide-up':   'slideUp 0.22s ease-out',
        'fade-in':    'fadeIn 0.18s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp:  { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
