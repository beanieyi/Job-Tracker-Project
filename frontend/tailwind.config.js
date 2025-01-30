/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        discord: {
          blurple: "#5865F2",
          green: "#57F287",
          yellow: "#FEE75C",
          red: "#ED4245",
          bg: "#313338",
          card: "#2B2D31",
        },
      },
    },
  },
  plugins: [],
}
