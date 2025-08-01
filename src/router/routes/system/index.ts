import type { RouteRecordRaw } from 'vue-router'

const index: RouteRecordRaw = {
  path: '/',
  name: 'index',
  component: () => import('@/views/dashboard/index.vue'),
}

export default index
