import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)']
      },
      keyframes: {
        'expand': {
          '0%': { 
            transform: 'scale(0.7)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '0.3'
          }
        }
      },
      animation: {
        'expand-slow': 'expand 1.5s ease-out forwards',
        'expand-slower': 'expand 1.8s ease-out forwards',
        'expand-slowest': 'expand 2.1s ease-out forwards'
      }
    },
  },
  plugins: [],
};
export default config;
