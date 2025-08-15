import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// 菜单项类型定义
export interface MenuItem {
  key: string
  label: string
  icon?: string
  route?: string
  badge?: string | number
  badgeClass?: string
  children?: MenuItem[]
  separator?: boolean
  visible?: boolean
  order?: number
}

// 面包屑项类型定义
export interface BreadcrumbItem {
  label: string
  icon?: string
  to?: string
}

// 菜单状态管理
export interface MenuState {
  expandedKeys: Set<string>
  activeKey: string | null
  activeParentKeys: Set<string>
  floatingExpandedKeys: Set<string> // 悬浮菜单的展开状态
}

export function useMenu() {
  const router = useRouter()

  // 菜单状态
  const menuState = ref<MenuState>({
    expandedKeys: new Set(),
    activeKey: null,
    activeParentKeys: new Set(),
    floatingExpandedKeys: new Set(),
  })

  // 从路由生成菜单数据
  const menuItems = computed<MenuItem[]>(() => {
    const appLayoutRoute = router.getRoutes().find((r) => r.name === 'AppLayout')
    if (!appLayoutRoute?.children) return []

    // 递归转换路由为菜单项
    const convertRouteToMenuItem = (route: any, parentPath: string = ''): MenuItem | null => {
      if (route.meta?.hideInMenu || !route.meta?.title) return null

      const fullPath = parentPath ? `${parentPath}/${route.path}` : `/${route.path}`

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
        route: childMenuItems.length > 0 ? undefined : fullPath,
        order: route.meta.order || 999,
        children: childMenuItems,
      }

      return menuItem
    }

    const menuItems = appLayoutRoute.children
      .map((route: any) => convertRouteToMenuItem(route, ''))
      .filter((item: MenuItem | null) => item !== null)
      .sort((a: MenuItem, b: MenuItem) => (a.order || 999) - (b.order || 999))

    return menuItems as MenuItem[]
  })

  // 递归查找包含指定路由的所有父级菜单
  const findParentKeys = (
    items: MenuItem[],
    targetRoute: string,
    parentKeys: string[] = [],
  ): string[] => {
    for (const item of items) {
      const currentPath = [...parentKeys, item.key]

      if (item.route === targetRoute) {
        return parentKeys // 返回所有父级的key
      }

      if (item.children) {
        const found = findParentKeys(item.children, targetRoute, currentPath)
        if (found.length > 0) {
          return found
        }
      }
    }
    return []
  }

  // 递归查找当前激活的菜单项
  const findActiveMenuItem = (items: MenuItem[], currentRoute: string): string | null => {
    for (const item of items) {
      if (item.route === currentRoute) {
        return item.key
      }
      if (item.children) {
        const found = findActiveMenuItem(item.children, currentRoute)
        if (found) return found
      }
    }
    return null
  }

  // 更新菜单状态
  const updateMenuState = () => {
    const currentRoute = router.currentRoute.value.path
    const activeKey = findActiveMenuItem(menuItems.value, currentRoute)
    const parentKeys = findParentKeys(menuItems.value, currentRoute)

    menuState.value.activeKey = activeKey
    menuState.value.activeParentKeys = new Set(parentKeys)

    // 自动展开包含当前路由的父级菜单
    parentKeys.forEach((key) => {
      menuState.value.expandedKeys.add(key)
    })
  }

  // 切换菜单项展开状态
  const toggleExpanded = (key: string) => {
    if (menuState.value.expandedKeys.has(key)) {
      menuState.value.expandedKeys.delete(key)
    } else {
      menuState.value.expandedKeys.add(key)
    }
  }

  // 切换悬浮菜单展开状态
  const toggleFloatingExpanded = (key: string) => {
    if (menuState.value.floatingExpandedKeys.has(key)) {
      menuState.value.floatingExpandedKeys.delete(key)
    } else {
      menuState.value.floatingExpandedKeys.add(key)
    }
  }

  // 检查悬浮菜单项是否展开
  const isFloatingExpanded = (key: string) => {
    return menuState.value.floatingExpandedKeys.has(key)
  }

  // 清空悬浮菜单展开状态
  const clearFloatingExpanded = () => {
    menuState.value.floatingExpandedKeys.clear()
  }

  // 检查菜单项是否展开
  const isExpanded = (key: string) => {
    return menuState.value.expandedKeys.has(key)
  }

  // 检查菜单项是否激活
  const isActive = (key: string) => {
    return menuState.value.activeKey === key
  }

  // 检查菜单项是否为激活项的父级
  const isParentActive = (key: string) => {
    return menuState.value.activeParentKeys.has(key)
  }

  // 获取菜单项样式类
  const getMenuItemClasses = (
    item: MenuItem,
    options: {
      collapsed?: boolean
      inFloatingMenu?: boolean
      level?: number
    } = {},
  ) => {
    const { collapsed = false, inFloatingMenu = false } = options

    const classes = [
      'flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 group relative px-3 py-2',
    ]

    if (!inFloatingMenu) {
      if (isActive(item.key)) {
        classes.push('bg-primary text-primary-contrast')
      } else if (isParentActive(item.key)) {
        classes.push('text-primary hover:bg-surface-100 dark:hover:bg-surface-800')
      } else {
        classes.push(
          'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800',
        )
      }
    } else {
      if (isActive(item.key)) {
        classes.push('bg-primary/10 text-primary')
      } else {
        classes.push(
          'hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200',
        )
      }
    }

    if (collapsed && !inFloatingMenu) {
      classes.push('justify-center')
    }

    return classes
  }

  // 处理菜单项点击
  const handleMenuClick = (
    item: MenuItem,
    hasChildren: boolean | any,
    collapsed: boolean,
    isFloating: boolean = false,
  ) => {
    if (hasChildren) {
      if (isFloating) {
        toggleFloatingExpanded(item.key)
      } else if (!collapsed) {
        toggleExpanded(item.key)
      }
    } else if (item.route) {
      router.push(item.route)
      // 路由跳转后清空悬浮菜单状态
      if (isFloating) {
        clearFloatingExpanded()
      }
    }
  }

  /**
   * 寻找路由下第一个有效的可访问页面
   * @param routeRecord 路由记录
   * @returns 第一个有效页面的路径，如果没有找到则返回null
   */
  const findFirstAccessibleRoute = (routeRecord: any): string | null => {
    // 如果当前路由有component且不被隐藏，则返回当前路由
    if (routeRecord.component && !routeRecord.meta?.hideInMenu) {
      return routeRecord.path
    }

    // 如果有子路由，递归查找
    if (routeRecord.children && routeRecord.children.length > 0) {
      // 按照order排序，确保按优先级查找
      const sortedChildren = [...routeRecord.children].sort((a, b) => {
        const orderA = a.meta?.order || 999
        const orderB = b.meta?.order || 999
        return orderA - orderB
      })

      for (const child of sortedChildren) {
        // 跳过隐藏的菜单项
        if (child.meta?.hideInMenu) {
          continue
        }

        // 构建完整路径
        const childPath = child.path.startsWith('/')
          ? child.path
          : `${routeRecord.path}/${child.path}`.replace(/\/+/g, '/')

        // 如果子路由有component，直接返回
        if (child.component) {
          return childPath
        }

        // 如果子路由还有子路由，递归查找
        if (child.children && child.children.length > 0) {
          const childRecord = { ...child, path: childPath }
          const result = findFirstAccessibleRoute(childRecord)
          if (result) {
            return result
          }
        }
      }
    }

    return null
  }

  /**
   * 智能路由跳转 - 如果目标路由没有组件，自动跳转到第一个可访问的子路由
   * @param targetPath 目标路径
   */
  const navigateToRoute = async (targetPath: string) => {
    const routes = router.getRoutes()

    // 查找对应的路由记录
    const targetRoute = routes.find((r) => {
      // 去掉参数部分，比较基础路径
      const basePath = r.path.replace(/:\w+/g, '')
      const targetBasePath = targetPath.replace(/:\w+/g, '')
      return basePath === targetBasePath || r.path === targetPath
    })

    if (!targetRoute) {
      console.warn(`未找到路由记录: ${targetPath}`)
      return
    }

    // 构建一个简化的路由记录用于查找
    const routeRecord = {
      path: targetPath,
      component: targetRoute.components,
      meta: targetRoute.meta,
      children: targetRoute.children || [],
    }

    // 查找第一个可访问的路由
    const firstAccessibleRoute = findFirstAccessibleRoute(routeRecord)

    if (firstAccessibleRoute) {
      try {
        await router.push(firstAccessibleRoute)
      } catch (error) {
        console.error('路由跳转失败:', error)
        // 如果跳转失败，尝试跳转到原始路径
        await router.push(targetPath)
      }
    } else {
      // 如果没有找到可访问的路由，跳转到原始路径
      await router.push(targetPath)
    }
  }

  /**
   * 生成面包屑导航数据
   */
  const breadcrumbItems = computed((): BreadcrumbItem[] => {
    const route = router.currentRoute.value
    const breadcrumbs: BreadcrumbItem[] = []

    // 基于匹配的路由记录构建面包屑
    route.matched.forEach((record, index) => {
      // 跳过根路由和布局路由
      if (record.name === 'AppLayout' || !record.meta?.title) {
        return
      }

      // 构建路由路径
      let routePath = record.path

      // 如果路径包含参数，使用当前路由的实际路径
      if (routePath.includes(':')) {
        const pathSegments = route.path.split('/').slice(0, index + 1)
        routePath = pathSegments.join('/')
      }

      breadcrumbs.push({
        label: record.meta.title as string,
        icon: record.meta.icon as string,
        to: routePath,
      })
    })

    return breadcrumbs
  })

  // 监听路由变化
  watch(
    () => router.currentRoute.value.path,
    () => {
      updateMenuState()
    },
    { immediate: true },
  )

  return {
    menuItems,
    menuState: computed(() => menuState.value),
    toggleExpanded,
    toggleFloatingExpanded,
    isExpanded,
    isFloatingExpanded,
    isActive,
    isParentActive,
    getMenuItemClasses,
    handleMenuClick,
    updateMenuState,
    clearFloatingExpanded,

    // 面包屑
    breadcrumbItems,
    navigateToRoute,
    findFirstAccessibleRoute,
  }
}
