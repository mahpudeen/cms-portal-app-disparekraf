import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import UnoCss from 'unocss/vite';
import { presetUno } from 'unocss';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
        }
      }
    }),
    vuetify({
      autoImport: true
    }),
    UnoCss({
      presets: [
        presetUno
      ]
    })
  ],
  server: {
    port: 5171,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    chunkSizeWarningLimit: 1024 * 1024, // Set the limit to 1 MB
    target: "ES2022"
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'ES2022'
    },
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue']
  }
});
