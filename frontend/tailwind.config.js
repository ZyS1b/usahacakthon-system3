/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAFBFC',
        surface: '#FFFFFF',
        'surface-glass': 'rgba(255,255,255,0.72)',
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0066D6',
          light: 'rgba(0,122,255,0.08)',
          50: 'rgba(0,122,255,0.05)',
        },
        success: {
          DEFAULT: '#34C759',
          light: 'rgba(52,199,89,0.08)',
        },
        accent: {
          DEFAULT: '#FF9500',
          light: 'rgba(255,149,0,0.08)',
        },
        danger: {
          DEFAULT: '#FF3B30',
          light: 'rgba(255,59,48,0.08)',
        },
        violet: {
          DEFAULT: '#5856D6',
          light: 'rgba(88,86,214,0.08)',
        },
        ink: '#1D1D1F',
        secondary: '#86868B',
        muted: '#AEAEB2',
        border: 'rgba(0,0,0,0.08)',
        'border-light': 'rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)',
        'card-xl': '0 12px 32px rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.04)',
        'nav': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'button': '0 4px 14px rgba(0,122,255,0.35), 0 2px 6px rgba(0,122,255,0.2)',
        'button-hover': '0 8px 24px rgba(0,122,255,0.4), 0 4px 8px rgba(0,122,255,0.25)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.8)',
        'none': 'none',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        'pill': '980px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
