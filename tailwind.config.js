/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        // Brand primary
        primary: {
          DEFAULT: '#9fe870',
          hover: '#cdffad',
          pale: '#e2f6d5',
          neutral: '#c5edab',
        },
        // Surfaces
        surface: {
          DEFAULT: '#ffffff',
          soft: '#e8ebe6',
        },
        // Typography
        ink: {
          DEFAULT: '#0e0f0c',
          deep: '#163300',
        },
        body: '#454745',
        mute: '#868685',
        // Semantic
        positive: {
          DEFAULT: '#2ead4b',
          deep: '#054d28',
        },
        danger: {
          DEFAULT: '#d03238',
          deep: '#a72027',
        },
        warning: {
          DEFAULT: '#ffd11a',
          deep: '#b86700',
        },
        // Accents
        accent: {
          orange: '#ffc091',
          cyan: '#38c8ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-mega': ['126px', { lineHeight: '107.1px', fontWeight: '900' }],
        'display-xxl': ['96px', { lineHeight: '81.6px', fontWeight: '900' }],
        'display-xl': ['64px', { lineHeight: '54.4px', fontWeight: '900' }],
        'display-md': ['40px', { lineHeight: '34px', fontWeight: '900' }],
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
    },
  },
  plugins: [],

}
