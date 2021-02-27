import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '/@/views/index/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index
  }
]

const router = createRouter({
  // 注意: 本地打包查看 history模式是空白的
  // history: createWebHistory(process.env.BASE_URL)
  history: createWebHashHistory(),
  routes
})
export default router
