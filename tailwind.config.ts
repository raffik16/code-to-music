import type { Config } from 'tailwindcss'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bright-purple': '#cd83de',
        'dark-purple': '#5a3962',
        'light-pink': '#e6acee',
      }
    }
  },
  plugins: [],
} satisfies Config