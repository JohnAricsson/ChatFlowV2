import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-lottie": ["lottie-react"],
          "vendor-socket": ["socket.io-client"],
          "vendor-ui": ["lucide-react", "react-hot-toast"],
        },
      },
    },
  },
});
