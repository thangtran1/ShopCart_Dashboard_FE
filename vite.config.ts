import tailwindcss from "@tailwindcss/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_APP_BASE_PATH || "/";
  const isProduction = mode === "production";

  // Set default environment variables
  process.env.VITE_API_URL = process.env.VITE_API_URL || "http://localhost:5000";

  return {
    base,
    plugins: [
      react({
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy", "classProperties"],
          },
        },
      }),
      vanillaExtractPlugin({
        identifiers: ({ debugId }) => `${debugId}`,
      }),
      tailwindcss(),
      tsconfigPaths(),

      // Chỉ chạy visualizer khi build ở local để kiểm tra dung lượng
      isProduction &&
        visualizer({
          open: false, // Để false để không tự bật trình duyệt khi build trên Vercel
          filename: "stats.html",
          gzipSize: true,
          brotliSize: true,
          template: "treemap",
        }),
    ].filter(Boolean),

    server: {
      open: true,
      host: true,
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
        "/socket.io": {
          target: "http://localhost:5000",
          changeOrigin: true,
          ws: true,
          secure: false,
        },
      },
    },

    build: {
      target: "esnext",
      minify: "esbuild",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1700,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-core": ["react", "react-dom", "react-router"],
            "vendor-ui": ["antd", "@ant-design/icons", "@ant-design/cssinjs", "styled-components"],
            "vendor-charts": ["apexcharts", "react-apexcharts"],
            "vendor-utils": ["axios", "dayjs", "i18next", "zustand", "@iconify/react"],
            "vendor-excel": ["xlsx"],
            "vendor-socket": ["socket.io-client"],
          },
        },
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router",
        "antd",
        "@ant-design/icons",
        "axios",
        "dayjs",
      ],
      exclude: ["@iconify/react"],
    },

    esbuild: {
      drop: isProduction ? ["console", "debugger"] : [],
      legalComments: "none",
      target: "esnext",
    },
  };
});

    
    
