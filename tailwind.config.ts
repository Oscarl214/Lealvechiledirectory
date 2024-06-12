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
    extend: {},
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
    // colors: {
    //   'primary-blue': {
    //     DEFAULT: '#2B59FF',
    //     100: '#F5F8FF',
    //   },
    //   'secondary-orange': '#f79761',
    //   'light-white': {
    //     DEFAULT: 'rgba(59,60,152,0.03)',
    //     100: 'rgba(59,60,152,0.02)',
    //   },
    //   grey: '#747A88',
    // },
  },
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
