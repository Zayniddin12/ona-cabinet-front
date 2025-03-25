import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import vueTypeImports from "vite-plugin-vue-type-imports";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), vueTypeImports(), eslintPlugin()],
  resolve: {
    alias: [
      {
        find: /~(.+)/,
        replacement: join(process.cwd(), "node_modules/$1"),
      },
      {
        find: /@\//,
        replacement: join(process.cwd(), "./src") + "/",
      },
    ],
  },
});
