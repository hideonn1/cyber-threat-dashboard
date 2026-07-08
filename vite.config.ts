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
      "/api": {
        target: "https://anci.gob.cl",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] ANCI API is unreachable: ${err.message}`);
            const response = res as import("http").ServerResponse;
            if (response && typeof response.writeHead === "function" && !response.headersSent) {
              response.writeHead(502, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ error: "ANCI API proxy error", message: err.message }));
            }
          });
        },
      },

      "/global-threats": {
        target: "https://www.cisa.gov",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        rewrite: (path) =>
          path.replace(/^\/global-threats/, "/sites/default/files/feeds"),
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] CISA API is unreachable: ${err.message}`);
            const response = res as import("http").ServerResponse;
            if (response && typeof response.writeHead === "function" && !response.headersSent) {
              response.writeHead(502, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ error: "CISA API proxy error", message: err.message }));
            }
          });
        },
      },

      "/raw-rss": {
        target: "https://feeds.feedburner.com",
        changeOrigin: true,
        secure: true,
        timeout: 5000,
        proxyTimeout: 5000,
        rewrite: (path) => path.replace(/^\/raw-rss/, ""),
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            console.warn(`[Proxy Warning] RSS Feed is unreachable: ${err.message}`);
            const response = res as import("http").ServerResponse;
            if (response && typeof response.writeHead === "function" && !response.headersSent) {
              response.writeHead(502, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ error: "RSS proxy error", message: err.message }));
            }
          });
        },
      },
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
            const response = res as import("http").ServerResponse;
            if (response && typeof response.writeHead === "function" && !response.headersSent) {
              response.writeHead(502, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ error: "Translate proxy error", message: err.message }));
            }
          });
        },
      },
    },
  },
});
