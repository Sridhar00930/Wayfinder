import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths, so the site works at any address
  // (for example https://your-name.github.io/wayfinder/).
  base: "./",
});
