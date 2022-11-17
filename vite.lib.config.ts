import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      name: 'jas-crud--vue-ts',
      formats: ['es','cjs'],
      fileName: 'jas-crud--vue-ts'
    },
    rollupOptions: {
      // Make sure that externalization of those dependencies you don't want to pack into the warehouse
      external: ['vue', 'lodash', 'xlsx', 'be-full', 'ant-design-vue', '@ant-design/icons-vue'],
      output: {
      // Provide a global variable for these externalized dependencies in the UMD construction mode
        // globals: {
        //   vue: 'Vue'
        // }
      }
    }
  },
  plugins: [vue(), dts({
    insertTypesEntry: true, copyDtsFiles: false,
    skipDiagnostics: false, logDiagnostics: true
  })],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@c": resolve(__dirname, "./src/components"),
    },
  },
})
