import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Custom domain serves from site root, so production assets must be root-relative.
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
}));
