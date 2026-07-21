import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import os from "os";

// Fix for esbuild Windows path resolution bug
const esbuildResolveFixPlugin = {
  name: "resolve-fix",
  setup(build: any) {
    build.onResolve({ filter: /^\.\.?\// }, (args: any) => {
      const resolved = path.resolve(args.resolveDir, args.path);
      if (fs.existsSync(resolved)) {
        return { path: resolved };
      }
      if (fs.existsSync(resolved + ".js")) {
        return { path: resolved + ".js" };
      }
      if (fs.existsSync(resolved + ".mjs")) {
        return { path: resolved + ".mjs" };
      }
      return null;
    });
  },
};

// Use temp dir in user profile for vite cache (avoids permission issues)
const cacheDir = path.join(os.tmpdir(), "hos-blog-vite-cache");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: "dist" },
  cacheDir,
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildResolveFixPlugin],
    },
  },
});
