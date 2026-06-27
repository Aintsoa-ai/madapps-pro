/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0b0b12', // Very dark background
          800: '#151521', // Dark card background
          700: '#232336', // Borders / subtle hover
          600: '#383854', // Muted text/elements
          500: '#6b6b8a', // Secondary text
          400: '#9b9bb5', // Standard text
          300: '#cacade', // Light text
          200: '#e5e5f0', // Very light text
        },
        indigo: {
          400: '#a78bfa',
          500: '#8b5cf6', // Vibrant purple (Primary)
          600: '#7c3aed', // Hover purple
        },
        cyan: {
          400: '#22d3ee', // Secondary accent (Cyan)
          500: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
