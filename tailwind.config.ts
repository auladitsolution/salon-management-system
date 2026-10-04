import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          primary: {
            DEFAULT: "#6D3D50",
            50: "#FAF5F7",
            100: "#F3EBF0",
            200: "#E7D6E1",
            300: "#D3B6C9",
            400: "#A96F89",
            500: "#8D4F6A",
            600: "#6D3D50",
            700: "#552F3E",
            800: "#3D222C",
            900: "#27151C",
          },
          secondary: {
            DEFAULT: "#D9B8A5",
            light: "#F5ECE6",
            dark: "#B88E75",
          },
          accent: "#C88722",
          gold: "#D4AF37",
          cream: "#FFF9F6",
          dark: "#272126",
          muted: "#756D72",
          success: "#16835D",
          warning: "#C88722",
          danger: "#DC3545",
        },
      },
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;