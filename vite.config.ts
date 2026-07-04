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
        timeout: 5000,
        proxyTimeout: 5000,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] ANCI API is unreachable: ${err.message}`);
            if (res && typeof res.writeHead === "function" && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "ANCI API proxy error", message: err.message }));
            }
          });
        },
      },

      // 2. FUENTE GLOBAL CISA: Catálogo de vulnerabilidades explotadas (Corregido el https://)
      "/global-threats": {
        target: "https://www.cisa.gov",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        // Reescribe la ruta para que busque directamente en la estructura interna de la CISA
        rewrite: (path) =>
          path.replace(/^\/global-threats/, "/sites/default/files/feeds"),
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] CISA API is unreachable: ${err.message}`);
            if (res && typeof res.writeHead === "function" && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "CISA API proxy error", message: err.message }));
            }
          });
        },
      },

      // 3. FUENTE NOTICIAS RSS: Convertidor internacional (Corregido rss2json y dominio base)
      "/rss2-json": {
        target: "https://api.rss2json.com",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        // Limpiamos el prefijo para adjuntar limpiamente el /v1/api.json en el fetch
        rewrite: (path) => path.replace(/^\/rss2-json/, ""),
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] RSS Feed Converter is unreachable: ${err.message}`);
            if (res && typeof res.writeHead === "function" && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "RSS proxy error", message: err.message }));
            }
          });
        },
      },
      // 4. TRADUCCIÓN: Google Translate (cliente gtx vía proxy)
      "/gtx": {
        target: "https://translate.googleapis.com",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        rewrite: (path) => path.replace(/^\/gtx/, ""),
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] Google Translate is unreachable: ${err.message}`);
            if (res && typeof res.writeHead === "function" && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Translate proxy error", message: err.message }));
            }
          });
        },
      },
    },
  },
});
