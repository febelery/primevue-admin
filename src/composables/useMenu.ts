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

  // 监听路由变化
  watch(
    () => router.currentRoute.value.path,
    () => {
      updateMenuState()
    },
    { immediate: true },
  )

  // 监听菜单数据变化
  watch(
    menuItems,
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
  }
}
