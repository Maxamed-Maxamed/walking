/* global require, module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Tailwind default Gray scale (explicit for consistency with docs)
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        background: { DEFAULT: "#f9fafb", dark: "#030712" },
        canvas: "#f9fafb",
        warm: "#f9fafb",
        surface: { DEFAULT: "#f3f4f6", dark: "#111827" },
        ink: "#030712",
        border: "#e5e7eb",
        primary: {
          DEFAULT: "#111827",
          light: "rgba(17, 24, 39, 0.08)",
        },
        secondary: "#374151",
        accent: "#111827",
        muted: "#9ca3af",
        error: "#DC2626",
        warning: "#D97706",
        success: "#16A34A",
        onboarding: {
          headline: "#111827",
          body: "#6b7280",
          accent: "#2DD4A8",
          dot: "#e5e7eb",
        },
      },
      fontFamily: {
        display: ["Avenir Next", "Trebuchet MS", "Segoe UI"],
        body: ["Gill Sans MT", "Trebuchet MS", "Segoe UI"],
        monoWire: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
