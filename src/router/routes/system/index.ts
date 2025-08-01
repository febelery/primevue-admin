import type { RouteRecordRaw } from 'vue-router'

const index: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/401',
    name: 'Unauthorized',
    component: () => import('@/views/errors/Unauthorized.vue'),
    meta: {
      title: '禁止访问',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: {
      title: '未找到',
    },
  },
]

export default index
