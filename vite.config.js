import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  build: {
<<<<<<< HEAD:vite.config.js
    outDir: "build",
=======
    outDir: 'build',
>>>>>>> 9fb453dba87c7b22469efed38249f26a8d0cf652:vite.config.ts
  },
});
