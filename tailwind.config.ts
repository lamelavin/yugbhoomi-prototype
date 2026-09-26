import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0f2f24",
          50: "#eef3f0",
          100: "#d3e2da",
          400: "#3c6b57",
          500: "#1c4636",
          600: "#163a2c",
          700: "#0f2f24",
          800: "#0b241b",
          900: "#081a14"
        },
        cream: "#f7f4ec",
        paper: "#fbf9f4",
        ink: "#1a1d1b",
        clay: "#b5482f",
        gold: "#c98a2c"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        display: ["Iowan Old Style", "Palatino Linotype", "Georgia", "Cambria", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,47,36,0.06), 0 1px 12px rgba(15,47,36,0.04)"
      }
    }
  },
  plugins: []
};
export default config;
