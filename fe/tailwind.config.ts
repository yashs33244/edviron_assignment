import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        gilroy: ['var(--font-gilroy)'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#2BE82A", // Bright neon green
          light: "#98E49B", // Lighter mint green
          foreground: "#000000", // Black text on primary
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#202020", // Dark gray
          foreground: "#FFFFFF", // White text on muted
        },
        accent: {
          DEFAULT: "#98E49B", // Light green
          foreground: "#000000", // Black text on accent
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#000000", // Pure black
          foreground: "#FFFFFF", // White text on card
        },
        // Design system colors
        "dashboard-black": "#000000", // Pure black
        "dashboard-dark": "#202020", // Dark gray
        "dashboard-green": {
          DEFAULT: "#2BE82A", // Bright neon green
          light: "#98E49B", // Lighter mint green
          lighter: "#9BE49B", // Even lighter mint green
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
        "4xl": "2rem", // 32px
        "5xl": "2.5rem", // 40px
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "pulse-green": {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(43, 232, 42, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(43, 232, 42, 0)' },
        },
        "count-up": {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "gradient-shift": {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-green": "pulse-green 2s infinite",
        "count-up": "count-up 0.5s ease-out",
        "gradient-shift": "gradient-shift 3s ease infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
