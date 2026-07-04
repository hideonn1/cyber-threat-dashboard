import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      // 1. FUENTE NACIONAL: Alertas de la ANCI chilena
      "/api": {
        target: "https://anci.gob.cl",
        changeOrigin: true,
        secure: true,
      },

      // 2. FUENTE GLOBAL CISA: Catálogo de vulnerabilidades explotadas (Corregido el https://)
      "/global-threats": {
        target: "https://www.cisa.gov",
        changeOrigin: true,
        secure: true,
        // Reescribe la ruta para que busque directamente en la estructura interna de la CISA
        rewrite: (path) =>
          path.replace(/^\/global-threats/, "/sites/default/files/feeds"),
      },

      // 3. FUENTE NOTICIAS RSS: Convertidor internacional (Corregido rss2json y dominio base)
      "/rss2-json": {
        target: "https://api.rss2json.com",
        changeOrigin: true,
        secure: true,
        // Limpiamos el prefijo para adjuntar limpiamente el /v1/api.json en el fetch
        rewrite: (path) => path.replace(/^\/rss2-json/, ""),
      },
      // 4. TRADUCCIÓN: Google Translate (cliente gtx vía proxy)
      "/gtx": {
        target: "https://translate.googleapis.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gtx/, ""),
      },
    },
  },
});
