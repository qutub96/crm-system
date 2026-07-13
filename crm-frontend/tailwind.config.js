/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E1420",
          900: "#141B2A",
          800: "#1C2536",
          700: "#293349",
        },
        paper: {
          50: "#FAF8F3",
          100: "#F2EFE6",
          200: "#E6E1D3",
        },
        amber: {
          500: "#C68A2E",
          600: "#A8721F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
