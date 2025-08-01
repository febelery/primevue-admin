import type { RouteRecordRaw } from 'vue-router'

const index: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/dashboard/index.vue'),
  },
   {
    path: '/401',
    name: 'Unauthorized',
    component: () => import('@/views/errors/Unauthorized.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue'),
  },
]

export default index
