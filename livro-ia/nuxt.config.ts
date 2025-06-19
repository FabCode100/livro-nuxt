import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2025-01-01',
});
