/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          elevated: "rgb(var(--surface-elevated) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        glow: "0 0 40px -10px rgba(99, 102, 241, 0.45)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        mesh: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4f46e5 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
