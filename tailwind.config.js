/* global require, module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F4EF',
        warm: '#FFF8F0',
        surface: { DEFAULT: '#FFFDF8', dark: '#1E293B' },
        ink: '#172033',
        border: '#D7D3C9',
        primary: '#E76F51',
        secondary: '#2A9D8F',
        accent: '#264653',
        muted: '#6B7280',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#22C55E',
      },
      fontFamily: {
        display: ['Avenir Next', 'Trebuchet MS', 'Segoe UI'],
        body: ['Gill Sans MT', 'Trebuchet MS', 'Segoe UI'],
        monoWire: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
