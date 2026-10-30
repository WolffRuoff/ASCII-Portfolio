import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from wolffruoff.github.io/ASCII-Portfolio/.
  base: "/ASCII-Portfolio/",
  plugins: [react()],
  build: { outDir: "build" },
  test: { environment: "jsdom", globals: true },
});
