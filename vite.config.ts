import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr)
}
const prefix = 'monaco-editor/esm/vs'

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: pathResolve('./src') },
      { find: 'vue', replacement: 'https://cdn.jsdelivr.net/npm/vue@3.0.4/dist/vue.esm-browser.js' },
      { find: /^three$/, replacement: 'https://unpkg.com/three@0.120.1/build/three.module.js' },
      { find: /^three\/examples\/jsm\/controls\/OrbitControls$/, replacement: 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js' }

      // https://github.com/vitejs/vite/discussions/1791
      // { find: 'monaco-editor', replacement: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.22.3/min/vs/loader.js' }

    ]
  },
  plugins: [
    vue()
  ],
  optimizeDeps: {
    exclude: [
      'vue',
      'three',
      'monaco-editor'
    ]
  },
  build: { terserOptions: { compress: { drop_console: true } } }
})