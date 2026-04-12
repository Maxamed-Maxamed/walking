/* global require, module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: "#FFFFFF", dark: "#0F172A" },
        canvas: "#F5F5F5",
        warm: "#FAFAFA",
        surface: { DEFAULT: "#F5F5F5", dark: "#1A1A1A" },
        ink: "#0A0A0A",
        border: "#E5E5E5",
        primary: {
          DEFAULT: "#0A0A0A",
          light: "rgba(10, 10, 10, 0.08)",
        },
        secondary: "#404040",
        accent: "#171717",
        muted: "#A3A3A3",
        error: "#DC2626",
        warning: "#D97706",
        success: "#16A34A",
        onboarding: {
          headline: "#1A1A2E",
          body: "#6B7280",
          accent: "#2DD4A8",
          dot: "#E5E7EB",
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
