/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#040711',
          panel: '#090e1a',
          card: '#0f172a',
          cardHover: '#162238',
          border: '#1e293b',
          borderGlow: 'rgba(6, 182, 212, 0.4)',
          accent: '#06b6d4',
          accentBlue: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          purple: '#8b5cf6',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(6,182,212,0.06) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-glow-card': 'radial-gradient(800px circle at var(--x, 50%) var(--y, 50%), rgba(6,182,212,0.12), transparent 40%)'
      },
      boxShadow: {
        'cyber-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
        'cyber-glow-strong': '0 0 35px rgba(6, 182, 212, 0.4)',
        'cyber-card': '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.07)',
        'critical-glow': '0 0 25px rgba(239, 68, 68, 0.3)',
        'success-glow': '0 0 25px rgba(16, 185, 129, 0.3)',
        'purple-glow': '0 0 25px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.3))' },
          '100%': { filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.8))' },
        }
      }
    },
  },
  plugins: [],
}
