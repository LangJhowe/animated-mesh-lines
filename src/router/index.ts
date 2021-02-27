import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/index/index.vue'
import Layout from '@/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Layout,
    redirect: '/mesh-line/demo1'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue')
  },
  {
    path: '/mesh-line',
    name: 'MeshLine',
    redirect: '/mesh-line/demo1',
    component: Layout,
    children: [
      {
        path: 'demo1',
        name: 'MeshLine1',
        component: () => import('@/views/mesh-line/demo1.vue')
      }
    ]
  }
]

const router = createRouter({
  // 注意: 本地打包查看 history模式是空白的 process.env.BASE_URL
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes
})
export default router
