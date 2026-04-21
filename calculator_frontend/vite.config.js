import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PUBLIC_INTERFACE
export default defineConfig({
  /** Vite config for the calculator frontend. */
  plugins: [react()],
  server: {
    port: Number.parseInt(process.env.REACT_APP_PORT || "3000", 10),
    strictPort: true,
    host: true
  }
});
