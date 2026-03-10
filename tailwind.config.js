/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── PALETA YUNGA JUJEÑA ───────────────────────────────────────────
      colors: {
        tierra: {
          50:  '#fdf5ed',
          100: '#f8e4cc',
          200: '#f0c695',
          300: '#e6a05e',
          400: '#d97f35',
          500: '#8B5E3C',   // tierra principal
          600: '#7a5133',
          700: '#62402a',
          800: '#4a3020',
          900: '#2e1e12',
        },
        yunga: {
          50:  '#edf5ef',
          100: '#cde4d3',
          200: '#9dc9a9',
          300: '#6aaa7c',
          400: '#4a8c5c',
          500: '#3D6B4F',   // verde selva principal
          600: '#335c43',
          700: '#274836',
          800: '#1c3427',
          900: '#0f1f17',
        },
        cielo: {
          50:  '#eef4f8',
          100: '#d2e5ef',
          200: '#a5cce0',
          300: '#78b2d0',
          400: '#4f97bf',
          500: '#6B9BAF',   // cielo andino principal
          600: '#4d7f93',
          700: '#3a6272',
          800: '#284554',
          900: '#172836',
        },
        barro: {
          50:  '#f9f5f0',
          100: '#ede3d3',
          200: '#d9c5a5',
          300: '#c4a577',
          400: '#b08652',
          500: '#C4956A',   // barro / arena
          600: '#9c7550',
          700: '#7a5a3c',
          800: '#58402a',
          900: '#362718',
        },
        noche: {
          DEFAULT: '#1A2332',
          light: '#243040',
          dark: '#0f1520',
        },
        arena: {
          DEFAULT: '#F5ECD7',
          dark: '#E8D5B0',
        },
      },

      // ─── TIPOGRAFÍA ───────────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },

      // ─── SOMBRAS PERSONALIZADAS ───────────────────────────────────────
      boxShadow: {
        card:    '0 2px 16px rgba(44, 36, 22, 0.08)',
        'card-hover': '0 16px 40px rgba(44, 36, 22, 0.16)',
        header:  '0 2px 20px rgba(0, 0, 0, 0.25)',
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────────
      borderRadius: {
        card: '18px',
        btn:  '50px',
      },
    },
  },
  plugins: [],
}
