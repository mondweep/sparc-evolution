/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'swarm-primary': '#6366f1',
        'swarm-secondary': '#8b5cf6',
        'swarm-accent': '#06b6d4',
        'swarm-success': '#10b981',
        'swarm-warning': '#f59e0b',
        'swarm-error': '#ef4444',
        'neural-blue': '#3b82f6',
        'neural-purple': '#8b5cf6',
        'neural-green': '#10b981'
      },
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
        'neural-flow': 'neuralFlow 4s ease-in-out infinite',
      },
      keyframes: {
        neuralFlow: {
          '0%, 100%': { transform: 'translateX(0px)', opacity: '1' },
          '50%': { transform: 'translateX(10px)', opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}