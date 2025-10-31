/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ activates Tailwind v4 postcss engine
  },
};

export default config;
