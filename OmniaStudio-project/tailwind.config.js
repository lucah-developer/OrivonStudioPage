/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF2E8",
        "neutral-100": "#F7F3EE",
        "text-primary": "#0B2C4A",
        "accent-1": "#7C3AED",
        "accent-2": "#FF9A2A",
        "accent-3": "#00A78E",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        heading: ["Archivo", "Arial Narrow", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
