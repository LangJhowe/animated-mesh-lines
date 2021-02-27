import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr)
}
export default defineConfig({
  resolve: { alias: { '@': pathResolve('./src') } },
  plugins: [vue()],
  optimizeDeps: {
    // include: ['lodash']
    exclude: ['three']
  }
})