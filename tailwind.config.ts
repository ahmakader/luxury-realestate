import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        "ink-soft": "#111110",
        "ink-raised": "#161614",
        gold: "#c9a86a",
        "gold-dim": "#9a7f4e",
        bone: "#e8e4dc",
        "bone-dim": "#a39e93",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      letterSpacing: {
        luxe: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
