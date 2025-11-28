import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // تغيير المسار الأساسي ليناسب Electron
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // This allows the app to run even if process.env is not fully defined in browser
    'process.env': process.env,
    // Add Electron globals
    __dirname: JSON.stringify(__dirname),
    __filename: JSON.stringify(__filename),
  },
  // Electron development server configuration
  server: {
    port: 5177,
    strictPort: true,
  }
});