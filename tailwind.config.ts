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
            DEFAULT: "#8B2653",
            50: "#FDF4F7",
            100: "#FBE8F0",
            200: "#F7D1E1",
            300: "#F0ABC9",
            400: "#E375A6",
            500: "#D34986",
            600: "#B82F6B",
            700: "#8B2653",
            800: "#6A1F41",
            900: "#44132B",
            950: "#2B091A",
          },
          secondary: {
            DEFAULT: "#E8C2A8",
            light: "#FAF1EB",
            dark: "#C69B7E",
          },
          vibrant: {
            rose: "#F43F5E",
            purple: "#A855F7",
            violet: "#7C3AED",
            amber: "#F59E0B",
            emerald: "#10B981",
            cyan: "#06B6D4",
            blue: "#3B82F6",
            gold: "#EAB308",
          },
          accent: "#D97706",
          gold: "#F59E0B",
          champagne: "#FDF8F3",
          cream: "#FAF6F0",
          dark: "#1A151E",
          surface: "#231B28",
          muted: "#766C7B",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(227, 117, 166, 0.3)",
        "glow-lg": "0 0 35px -5px rgba(184, 47, 107, 0.4)",
        "glow-gold": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
        "glow-purple": "0 0 25px -5px rgba(168, 85, 247, 0.35)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;