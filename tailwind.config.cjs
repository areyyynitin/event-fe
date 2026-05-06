/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        text: "#0f0d0d",
        background: "#f9f5f4",
        primary: "#c76d50",
        secondary: "#eca087",
        accent: "#fa7649",
      },
    },
  },
  plugins: [],
};
