import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        proxy: {
            "/api/v1": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    esbuild: {
        // @ts-expect-error: TypeScript hiện chưa cập nhật type cho thuộc tính drop của esbuild
        drop: ["console", "debugger"],
    },
    build: {
        outDir: "dist",
        minify: "esbuild",
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                // Tách chunk cho thư viện bên thứ 3
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
                            return "vendor-react";
                        }
                        if (id.includes("lucide-react")) {
                            return "vendor-icons";
                        }
                        if (id.includes("axios") || id.includes("zustand")) {
                            return "vendor-utils";
                        }
                        return "vendor-core";
                    }
                },
                entryFileNames: "assets/js/[name]-[hash].js",
                chunkFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
            },
        },
    },
});