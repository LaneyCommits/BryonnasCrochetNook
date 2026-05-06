import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // GitHub Pages project site path; local dev keeps root path.
  base: mode === "production" ? "/BryonnasCrochetNook/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
}));
