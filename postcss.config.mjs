/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},  // <--- Notice this is just 'tailwindcss', NOT '@tailwindcss/postcss'
    autoprefixer: {},
  },
};

export default config;