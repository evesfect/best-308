import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'transparent': 'transparent',
        'semi-transparent': 'rgba(255, 255, 255, 0.8)',
      },
      transitionProperty: {
        'background': 'background-color',
      },
    },
  },
  plugins: [],
};

export default config;
