import type { Config } from "tailwindcss";
 
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        handwriting: ["'Caveat'", "cursive"],
        serifTh: ["var(--font-serif-th)", "'Noto Serif Thai'", "serif"],
        sansTh: ["var(--font-sans-th)", "'Noto Sans Thai'", "sans-serif"],
      },
      colors: {
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        gold: {
          50: "#FBF3E7",
          100: "#F3E7D3",
          200: "#E4C77E",
          300: "#D4AF5A",
          400: "#C9A227",
          500: "#B8892B",
          600: "#9C7220",
          700: "#7A5818",
        },
        wine: {
          50: "#F7E9EB",
          100: "#EACBD1",
          200: "#D4A2AC",
          300: "#A85566",
          400: "#8B3A47",
          500: "#6B2737",
          600: "#54101F",
          700: "#3D0B17",
        },
        ink: "#362A22",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "bounce-soft": "bounceSoft 2s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        bounceSoft: { "0%, 100%": { transform: "translateY(-5%)" }, "50%": { transform: "translateY(0)" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
 
export default config;
