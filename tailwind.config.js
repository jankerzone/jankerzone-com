/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/**/*.md',
    './docs/.vitepress/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Prevent Tailwind from resetting Vitepress default styles
  },
  plugins: [],
}
