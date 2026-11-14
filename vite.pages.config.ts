// Static single-page build for GitHub Pages: `bun run build:pages` -> dist-pages/.
// Separate from vite.config.ts so Lovable hosting is unaffected.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("./pages"),
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": r("./src") } },
  build: { outDir: r("./dist-pages"), emptyOutDir: true },
});
