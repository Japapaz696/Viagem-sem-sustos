/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          elevated: '#FFFFFF',
        },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(37, 99, 235, 0.06)',
        'soft-md': '0 8px 30px rgba(37, 99, 235, 0.08)',
        'soft-lg': '0 12px 32px rgba(37, 99, 235, 0.12)',
        'soft-xl': '0 20px 60px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
