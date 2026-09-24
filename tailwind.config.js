/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f2',
        surface: '#ffffff',
        'surface-muted': '#f0f1ee',
        primary: {
          DEFAULT: '#006B5F',
          hover: '#00574d',
        },
        text: {
          primary: '#1f2933',
          secondary: '#66727f',
        },
        border: 'rgba(30, 50, 55, 0.10)',
      },
      borderRadius: {
        sm: '14px',
        md: '20px',
        lg: '24px',
        xl: '28px',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Geist', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
