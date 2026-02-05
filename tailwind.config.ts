import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          text: '#37474F',
          'text-secondary': '#78909C',
          expense: '#E57373',
          income: '#81C784',
          border: '#E0E0E0',
        },
        dark: {
          bg: '#1C262B',
          card: '#263238',
          text: '#ECEFF1',
          'text-secondary': '#B0BEC5',
          expense: '#EF5350',
          income: '#66BB6A',
          border: '#37474F',
        },
      },
    },
  },
  plugins: [],
}
export default config
