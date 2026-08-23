import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm, natural, earthy palette - hand-crafted feel
        primary: {
          50: "#fef8ee",  // warm cream
          100: "#fdf0d8",
          200: "#fadeb0",
          300: "#f6c77e",
          400: "#f0a94a",
          500: "#e88d2a",  // warm amber - main primary
          600: "#d47420",
          700: "#b05b1d",
          800: "#8c481f",
          900: "#713d1c",
          950: "#3d1e0c",
        },
        accent: {
          50: "#f5f7f0",  // sage green tint
          100: "#e8ede0",
          200: "#d0dbc0",
          300: "#b0c49a",
          400: "#8da873",
          500: "#6d8c56",  // olive/sage - natural accent
          600: "#557042",
          700: "#435735",
          800: "#37472d",
          900: "#2f3a28",
          950: "#171e13",
        },
        earth: {
          50: "#f8f5f0",
          100: "#efe8db",
          200: "#ddcfb8",
          300: "#c9b18f",
          400: "#b8946a",
          500: "#ab7f55",
          600: "#9d6b48",
          700: "#82543b",
          800: "#6a4534",
          900: "#583a2e",
          950: "#301e17",
        },
        warm: {
          50: "#fef9f5",
          100: "#fdf2ea",
          200: "#fbe3d3",
          300: "#f7ceb1",
          400: "#f2b084",
          500: "#e8905a",
          600: "#d7723d",
          700: "#b45a2e",
          800: "#90492a",
          900: "#753d26",
          950: "#3f1d10",
        },
        night: {
          50: "#f0f1f4",
          100: "#d9dbe2",
          200: "#b3b7c4",
          300: "#868da1",
          400: "#5c657e",
          500: "#434b63",
          600: "#353c53",
          700: "#2e3347",
          800: "#282c3d",
          900: "#232734",
          950: "#13151f",
        },
      },
      fontFamily: {
        arabic: ["'Noto Kufi Arabic'", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "warm-pattern": "radial-gradient(circle at 50% 50%, rgba(232, 141, 42, 0.03) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
