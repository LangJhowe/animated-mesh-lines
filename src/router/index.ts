import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'
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
      },
      {
        path: 'demo2',
        name: 'MeshLine2',
        component: () => import('@/views/mesh-line/demo2.vue')
      },
      {
        path: 'demo3',
        name: 'MeshLine3',
        component: () => import('@/views/mesh-line/demo3.vue')
      },
      {
        path: 'demo4',
        name: 'MeshLine4',
        component: () => import('@/views/mesh-line/demo4.vue')
      },
      {
        path: 'demo5',
        name: 'MeshLine5',
        component: () => import('@/views/mesh-line/demo5.vue')
      }
    ]
  },
  {
    path: '/shader-draw-editor',
    redirect: '/shader-draw-editor/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ShaderDrawEditorDemoPage',
        component: () => import('@/views/shader-draw-editor/index.vue')
      }
    ]
  },
  {
    path: '/lab',
    redirect: '/lab/index',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Lab',
        component: () => import('@/views/lab/index.vue')
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
