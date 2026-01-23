/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orpaynter-deep-blue': '#1E40AF',
        'orpaynter-bright-amber': '#F59E0B',
        'orpaynter-cool-gray': '#1F2937',
        'orpaynter-success-green': '#10B981',
        'orpaynter-warning-red': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
