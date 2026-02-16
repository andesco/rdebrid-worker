import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    TanStackRouterVite({
      quoteStyle: "double",
    }),
    tsconfigPaths(),
    Icons({
      compiler: "jsx",
      jsx: "react",
      iconCustomizer(_1, _2, props) {
        props.width = "1.5rem";
        props.height = "1.5rem";
        props.className = "pointer-events-none";
      },
    }),
  ],
  publicDir: "ui/public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5174",
      },
    },
  },
  build: {
    outDir: "build/client",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/ui/components/list/file-select-modal.tsx")) {
            return "file-select-modal";
          }

          if (id.includes("node_modules")) {
            if (
              id.includes("@tanstack/react-router") ||
              id.includes("@tanstack/react-query")
            ) {
              return "tanstack";
            }

            if (id.includes("@heroui/")) {
              return "heroui";
            }

            if (
              id.includes("@react-aria/") ||
              id.includes("@react-stately/") ||
              id.includes("@react-types/")
            ) {
              return "react-aria";
            }

            if (id.includes("framer-motion")) {
              return "motion";
            }
          }

          if (id.includes("~icons/") || id.includes("unplugin-icons")) {
            return "icons";
          }

          return undefined;
        },
      },
    },
  },
});
