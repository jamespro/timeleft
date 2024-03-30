// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: process.env.PORT || 8080,
  },
});
