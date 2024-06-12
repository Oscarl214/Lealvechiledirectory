import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');
const { addDynamicIconSelectors } = require('@iconify/tailwind');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    animation: {
      blob: 'blob 7s infinite',
    },
    keyframes: {
      blob: {
        '0%': {
          transform: ' translate(0px,0px) scale(1)',
        },
        '33%': {
          transform: ' translate(20px,-20px) scale(1.1)',
        },
        '66%': {
          transform: 'translate(-20px,20px) scale(0.9)',
        },
        '100%': {
          transform: 'translate(0px,0px) scale(1)',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    addDynamicIconSelectors(),
    nextui({
      themes: {
        light: {
          layout: {
            foreground: '#ffffff',
          }, // light theme layout tokens
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            foreground: '#000000',
          }, // dark theme colors
        },
      },
    }),
  ],
};
export default config;
