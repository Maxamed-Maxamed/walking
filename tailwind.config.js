/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        surface: { DEFAULT: '#F8FAFC', dark: '#1E293B' },
        muted: '#94A3B8',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
};
