/* global require, module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: "#FFFFFF", dark: "#0F172A" },
        canvas: "#F6F4EF",
        warm: "#F8FAFC",
        surface: { DEFAULT: "#F8FAFC", dark: "#1E293B" },
        ink: "#172033",
        border: "#E2E8F0",
        primary: {
          DEFAULT: "#4F46E5",
          light: "rgba(79, 70, 229, 0.1)",
        },
        secondary: "#10B981",
        accent: "#264653",
        muted: "#94A3B8",
        error: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E",
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
