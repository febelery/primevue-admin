import type { RouteRecordRaw } from 'vue-router'

const systemRouteFiles = import.meta.glob('./system/*.ts', { eager: true })

const systemRoutes: RouteRecordRaw[] = []

Object.keys(systemRouteFiles).forEach((key) => {
  const mod = (systemRouteFiles[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  systemRoutes.push(...modList)
})

export default [...systemRoutes]
