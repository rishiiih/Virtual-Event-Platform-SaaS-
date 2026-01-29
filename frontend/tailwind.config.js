/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        'shadow-grey': '#1A1423',
        'midnight-violet': '#372549',
        'mauve-shadow': '#774C60',
        'dusty-mauve': '#B75D69',
        'almond-silk': '#EACDC2',
        
        // Semantic naming for easier use
        primary: {
          DEFAULT: '#372549', // Midnight Violet
          light: '#774C60',   // Mauve Shadow
          dark: '#1A1423',    // Shadow Grey
        },
        accent: {
          DEFAULT: '#B75D69', // Dusty Mauve
          light: '#EACDC2',   // Almond Silk
        },
        dark: '#1A1423',
        light: '#EACDC2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(26, 20, 35, 0.08)',
        'subtle-lg': '0 4px 16px rgba(26, 20, 35, 0.12)',
      },
    },
  },
  plugins: [],
}
