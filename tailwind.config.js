/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shibutis-primary': '#00b72e', // Exact orange from image
        'light-primary': '#a3fab9', // Exact orange from image
        'shibutis-dark': '#1a1b23',   // Exact dark background
        'shibutis-panel': '#2d2f36',  // Panel background
        'shibutis-border': '#404248', // Border color
        'shibutis-text': '#ffffff',   // Pure white text
        'shibutis-subtitle': '#a1a1aa', // Subtitle gray
        'building-teal': '#0d9488', // Building teal color
        'building-purple': '#7c3aed', // Building purple color
        'neon-cyan': '#06b6d4',    // Neon sign color
      },
      fontFamily: {
        'pixel': ['"Joystix"'],
        'body': ['"Orange Kid"']
      },
      backgroundImage: {
        'building-gradient': 'linear-gradient(45deg, #0d9488 0%, #7c3aed 100%)',
      }
    },
  },
  plugins: [],
}
