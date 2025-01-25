/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
module.exports = {
  content: ["./webpage/**/*.{njk,scss,html,js}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: "#080F1E",
      secondary: "#EF2469",
      gray: {
        light: "#F7F7F7",
        DEFAULT: "#E5E5E5",
      },
      black: "#02021E",
      white: "#FFFFFF",
    },
    extend: {
      fontFamily: {
        primary: ["Roboto", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    container: {
      center: true,  
      padding: {
        DEFAULT: "1rem",  
        sm: "2rem",       
        lg: "4rem",      
        xl: "5rem",       
        "2xl": "6rem",    
      },
    },
  },
  plugins: [],
};
