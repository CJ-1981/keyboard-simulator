/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        ink: '#20201d',
        brass: '#95771c',
        brassdark: '#5b533e',
        paper: '#f7f7f6',
        surface: '#e9e8e4',
        border: '#bfb8a6',
        muted: '#908d86',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        keycap: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
    },
  },
  plugins: [],
};
