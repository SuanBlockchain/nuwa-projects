/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        'logo-deep': '#0A5E5C', // Deep teal-blue at the bottom
        'logo-mid': '#16A396', // Mid teal shade
        'logo-light': '#21DDB8', // Bright mint/turquoise at the top
        'logo-accent': '#FFFFFF', // White sparkle/dots
        
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        
        // Add semantic color tokens
        primary: {
          DEFAULT: "var(--mint-9)",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "var(--mint-3)",
          foreground: "var(--mint-11)",
        },
        accent: {
          DEFAULT: "var(--mint-8)",
          foreground: "var(--mint-12)",
        },
        muted: {
          DEFAULT: "#f9fafb",
          foreground: "#6b7280",
        },
      },
      gradientColorStops: {
        'logo-gradient-from': '#0A5E5C', // Deep teal-blue
        'logo-gradient-via': '#16A396', // Mid teal
        'logo-gradient-to': '#21DDB8', // Bright mint/turquoise
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(to top, #0A5E5C, #16A396, #21DDB8)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}