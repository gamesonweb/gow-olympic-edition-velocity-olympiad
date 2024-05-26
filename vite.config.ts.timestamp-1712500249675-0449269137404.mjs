// vite.config.ts
import {
    defineConfig
} from "file:///C:/Users/HP/Documents/Jeff/M1_MIAGE/Semestre%202/Game%20on%20Web/Velocity-Olympiad/node_modules/vite/dist/node/index.js";
import wasm
    from "file:///C:/Users/HP/Documents/Jeff/M1_MIAGE/Semestre%202/Game%20on%20Web/Velocity-Olympiad/node_modules/vite-plugin-wasm/exports/import.mjs";
import vue
    from "file:///C:/Users/HP/Documents/Jeff/M1_MIAGE/Semestre%202/Game%20on%20Web/Velocity-Olympiad/node_modules/@vitejs/plugin-vue/dist/index.mjs";

var vite_config_default = defineConfig({
    plugins: [
        wasm(),
        vue()
    ],
    server: {
        open: false,
        host: "0.0.0.0",
        port: 8086
    },
    optimizeDeps: {
        exclude: ["@babylonjs/havok"]
    }
});
export {
    vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxEb2N1bWVudHNcXFxcSmVmZlxcXFxNMV9NSUFHRVxcXFxTZW1lc3RyZSAyXFxcXEdhbWUgb24gV2ViXFxcXFZlbG9jaXR5LU9seW1waWFkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxEb2N1bWVudHNcXFxcSmVmZlxcXFxNMV9NSUFHRVxcXFxTZW1lc3RyZSAyXFxcXEdhbWUgb24gV2ViXFxcXFZlbG9jaXR5LU9seW1waWFkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IUC9Eb2N1bWVudHMvSmVmZi9NMV9NSUFHRS9TZW1lc3RyZSUyMDIvR2FtZSUyMG9uJTIwV2ViL1ZlbG9jaXR5LU9seW1waWFkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB3YXNtIGZyb20gJ3ZpdGUtcGx1Z2luLXdhc20nXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgd2FzbSgpLFxyXG4gICAgICB2dWUoKVxyXG4gICAgXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICBwb3J0OiA4MDg2LFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGV4Y2x1ZGU6IFsnQGJhYnlsb25qcy9oYXZvayddLFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOGEsU0FBUSxvQkFBbUI7QUFDemMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxJQUFJO0FBQUEsRUFDTjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxrQkFBa0I7QUFBQSxFQUNoQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
