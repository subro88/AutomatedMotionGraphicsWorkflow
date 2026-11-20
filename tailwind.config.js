/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#060911",
        surface: "#0c1322",
        card: "#111a2f",
        cyanGlow: "#00f2fe",
        blueGlow: "#4facfe",
      },
    },
  },
  plugins: [],
};

