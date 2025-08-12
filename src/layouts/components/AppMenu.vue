<template>
  <div class="space-y-1">
    <AppMenuItem
      v-for="item in menuItems"
      :key="item.key"
      :item="item"
      :collapsed="collapsed"
      :level="0"
    />
  </div>
</template>

<script setup lang="ts">
import AppMenuItem from './AppMenuItem.vue'
import type { MenuItem } from '@/types/layout'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const router = useRouter()

// 从路由生成菜单数据
const menuItems = computed<MenuItem[]>(() => {
  // 获取应用布局的子路由
  const appLayoutRoute = router.getRoutes().find((r) => r.name === 'AppLayout')
  if (!appLayoutRoute?.children) return []

  // 递归转换路由为菜单项，并构建正确的完整路径
  const convertRouteToMenuItem = (route: any, parentPath: string = ''): MenuItem | null => {
    // 如果路由被标记为隐藏，则不显示在菜单中
    if (route.meta?.hideInMenu) return null

    // 如果没有标题，则不显示在菜单中
    if (!route.meta?.title) return null

    // 构建当前路由的完整路径
    const fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`

    // 处理子路由
    let childMenuItems: MenuItem[] = []
    if (route.children && route.children.length > 0) {
      childMenuItems = route.children
        .map((childRoute: any) => convertRouteToMenuItem(childRoute, fullPath))
        .filter((item: MenuItem | null) => item !== null)
        .sort((a: MenuItem, b: MenuItem) => (a.order || 999) - (b.order || 999))
    }

    const menuItem: MenuItem = {
      key: route.name as string,
      label: route.meta.title as string,
      icon: route.meta.icon as string,
      // 如果有子菜单，则不设置 route 属性，这样点击时不会跳转
      // 如果没有子菜单，则设置完整路径
      route: childMenuItems.length > 0 ? undefined : fullPath,
      order: route.meta.order || 999,
      children: childMenuItems,
    }

    return menuItem
  }

  // 转换所有子路由为菜单项
  const menuItems = appLayoutRoute.children
    .map((route: any) => convertRouteToMenuItem(route, ''))
    .filter((item: MenuItem | null) => item !== null)
    .sort((a: MenuItem, b: MenuItem) => (a.order || 999) - (b.order || 999))

  return menuItems as MenuItem[]
})
</script>
