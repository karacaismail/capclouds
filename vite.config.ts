import { defineConfig } from "vite";

// GitHub Pages: site https://karacaismail.github.io/capclouds/
export default defineConfig({
  base: "/capclouds/",
  build: {
    target: "es2020",
    outDir: "dist",
    emptyOutDir: true,
  },
});
