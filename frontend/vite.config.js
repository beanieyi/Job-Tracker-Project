import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow connections from Docker
    host: true,
    // Use port 5173 (Vite's default)
    port: 5173,
    // Enable hot module replacement
    hmr: {
      clientPort: 5173,
    },
  },
  // Configure path aliases and build options as needed
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
