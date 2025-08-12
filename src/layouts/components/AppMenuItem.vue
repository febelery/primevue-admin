<template>
  <!-- 分隔符 -->
  <div v-if="item.separator" class="border-surface-200 dark:border-surface-700 my-2 border-t"></div>

  <!-- 菜单项 -->
  <div v-else-if="item.visible !== false" class="relative">
    <!-- 菜单项内容 -->
    <div
      ref="menuItemRef"
      :class="menuItemClasses"
      :style="menuItemStyles"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      v-tooltip.right="collapsed && !hasChildren ? item.label : null"
    >
      <!-- 层级缩进指示器 -->
      <div v-if="!collapsed && level > 0" :style="indentStyle" class="flex-shrink-0"></div>

      <!-- 图标 -->
      <i v-if="item.icon" :class="[item.icon, 'flex-shrink-0 text-base']"></i>

      <!-- 标签 -->
      <span v-if="!collapsed" class="min-w-0 flex-1 truncate">{{ item.label }}</span>

      <!-- 徽章 -->
      <span
        v-if="!collapsed && item.badge"
        :class="[
          'inline-flex flex-shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium text-white',
          item.badgeClass || 'bg-primary',
        ]"
      >
        {{ item.badge }}
      </span>

      <!-- 展开/折叠图标 -->
      <i
        v-if="!collapsed && hasChildren"
        :class="[
          'pi flex-shrink-0 text-sm transition-transform duration-200',
          expanded ? 'pi-chevron-down' : 'pi-chevron-right',
        ]"
      ></i>
    </div>

    <!-- 子菜单 -->
    <Transition name="submenu" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-if="hasChildren && expanded && !collapsed" class="submenu-container">
        <AppMenuItem
          v-for="child in item.children"
          :key="child.key"
          :item="child"
          :collapsed="collapsed"
          :level="level + 1"
        />
      </div>
    </Transition>

    <!-- 折叠状态下的悬浮子菜单 - 使用 Teleport 渲染到 body -->
    <Teleport to="body">
      <Transition name="floating-submenu">
        <div
          v-if="collapsed && hasChildren && showFloatingSubmenu"
          ref="floatingSubmenuRef"
          :class="floatingSubmenuClasses"
          :style="floatingSubmenuPosition"
          @mouseenter="keepFloatingSubmenu = true"
          @mouseleave="hideFloatingSubmenu"
          @click.stop
        >
          <div class="p-3">
            <div
              class="text-surface-500 dark:text-surface-400 border-surface-200 dark:border-surface-700 mb-3 border-b px-2 py-1 text-xs font-semibold tracking-wider uppercase"
            >
              {{ item.label }}
            </div>
            <AppMenuItem
              v-for="child in item.children"
              :key="child.key"
              :item="child"
              :collapsed="false"
              :level="0"
              :in-floating-menu="true"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/types/layout'
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  item: MenuItem
  collapsed?: boolean
  level?: number
  inFloatingMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  level: 0,
  inFloatingMenu: false,
})

const router = useRouter()

// 状态管理
const expanded = ref(false)
const showFloatingSubmenu = ref(false)
const keepFloatingSubmenu = ref(false)
const floatingSubmenuRef = ref<HTMLElement>()
const menuItemRef = ref<HTMLElement>()

// 检查是否包含当前路由
const containsCurrentRoute = computed(() => {
  if (!hasChildren.value) return false

  const checkRoute = (items: MenuItem[]): boolean => {
    return items.some((item) => {
      if (item.route === router.currentRoute.value.path) return true
      if (item.children) return checkRoute(item.children)
      return false
    })
  }

  return checkRoute(props.item.children || [])
})

// 初始化展开状态
const initExpandedState = () => {
  if (containsCurrentRoute.value && !props.collapsed) {
    expanded.value = true
  } else {
    expanded.value = false
  }
}

// 计算属性
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

// 菜单项基础样式
const menuItemClasses = computed(() => {
  const classes = [
    'flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200 group relative px-3 py-2',
  ]

  // 基础样式
  if (!props.inFloatingMenu) {
    if (isActive.value) {
      classes.push('bg-primary text-primary-contrast')
    } else {
      classes.push(
        'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800',
      )
    }
  } else {
    classes.push(
      'hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200',
    )
  }

  // 折叠状态
  if (props.collapsed && !props.inFloatingMenu) {
    classes.push('justify-center')
  }

  return classes
})

// 菜单项内联样式
const menuItemStyles = computed(() => {
  // 在折叠状态或浮动菜单中不需要特殊样式
  if (props.collapsed || props.inFloatingMenu) {
    return {}
  }

  return {}
})

// 缩进样式
const indentStyle = computed(() => {
  const indentWidth = props.level * 16 // 每级16px缩进
  return {
    width: `${indentWidth}px`,
  }
})

const floatingSubmenuClasses = computed(() => [
  'fixed z-[9999] min-w-64 max-w-80 bg-surface-0/95 dark:bg-surface-900/95',
  'backdrop-blur-xl border border-surface-200/50 dark:border-surface-700/50',
  'rounded-xl shadow-2xl transform transition-all duration-200 origin-top-left',
])

// 计算悬浮菜单的绝对位置
const floatingSubmenuPosition = computed(() => {
  if (!menuItemRef.value) return { display: 'none' }

  const rect = menuItemRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const menuWidth = 280 // 预估菜单宽度
  const menuHeight = (props.item.children?.length || 0) * 40 + 80 // 预估菜单高度

  let left = rect.right + 8 // 菜单项右侧 + 8px 间距
  let top = rect.top

  // 右侧空间不足时，显示在左侧
  if (left + menuWidth > viewportWidth) {
    left = rect.left - menuWidth - 8
  }

  // 底部空间不足时，向上调整
  if (top + menuHeight > viewportHeight) {
    top = Math.max(8, viewportHeight - menuHeight - 8)
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    maxHeight: `${Math.min(menuHeight, viewportHeight - top - 16)}px`,
    overflowY: 'auto' as const,
  }
})

const isActive = computed(() => {
  if (props.item.route) {
    return router.currentRoute.value.path === props.item.route
  }
  return false
})

// 方法
const handleClick = () => {
  // 如果有子菜单，优先处理展开/折叠逻辑
  if (hasChildren.value) {
    if (props.collapsed) {
      // 在折叠状态下，点击切换悬浮菜单
      showFloatingSubmenu.value = !showFloatingSubmenu.value
      keepFloatingSubmenu.value = true
    } else {
      // 在展开状态下，切换子菜单展开状态
      expanded.value = !expanded.value
    }
  } else if (props.item.route) {
    // 只有在没有子菜单的情况下才进行路由跳转
    router.push(props.item.route)
  }
}

const hideFloatingSubmenu = () => {
  setTimeout(() => {
    if (!keepFloatingSubmenu.value) {
      showFloatingSubmenu.value = false
    }
    keepFloatingSubmenu.value = false
  }, 150) // 增加延迟时间，提供更好的用户体验
}

// 鼠标悬停事件
const handleMouseEnter = () => {
  if (props.collapsed && hasChildren.value) {
    showFloatingSubmenu.value = true
    keepFloatingSubmenu.value = true
  }
}

const handleMouseLeave = () => {
  if (props.collapsed && hasChildren.value) {
    keepFloatingSubmenu.value = false
    hideFloatingSubmenu()
  }
}

// 动画钩子
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  // 先设置为0高度
  element.style.height = '0px'
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s ease'

  // 强制重绘
  void element.offsetHeight

  // 然后设置为实际高度
  requestAnimationFrame(() => {
    element.style.height = element.scrollHeight + 'px'
  })
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  element.style.overflow = 'visible'
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s ease'

  // 强制重绘
  void element.offsetHeight

  // 然后设置为0
  requestAnimationFrame(() => {
    element.style.height = '0px'
  })
}

// 全局点击关闭悬浮菜单
const handleGlobalClick = (event: Event) => {
  if (!showFloatingSubmenu.value) return

  const target = event.target as Element
  const menuItem = menuItemRef.value
  const floatingMenu = floatingSubmenuRef.value

  if (menuItem && floatingMenu) {
    if (!menuItem.contains(target) && !floatingMenu.contains(target)) {
      showFloatingSubmenu.value = false
      keepFloatingSubmenu.value = false
    }
  }
}

// 窗口大小变化时重新计算位置
const handleResize = () => {
  if (showFloatingSubmenu.value) {
    // 触发重新计算位置
    showFloatingSubmenu.value = false
    nextTick(() => {
      showFloatingSubmenu.value = true
    })
  }
}

// 生命周期和监听器
onMounted(() => {
  initExpandedState()
  document.addEventListener('click', handleGlobalClick)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('resize', handleResize)
})

// 监听路由变化
watch(
  () => router.currentRoute.value.path,
  () => {
    initExpandedState()
  },
)

// 监听折叠状态变化
watch(
  () => props.collapsed,
  (newCollapsed) => {
    if (newCollapsed) {
      expanded.value = false
    } else {
      initExpandedState()
    }
  },
)
</script>

<style scoped>
.submenu-container {
  display: block;
  width: 100%;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  height: 0 !important;
  overflow: hidden;
}

.floating-submenu-enter-active,
.floating-submenu-leave-active {
  transition: all 0.2s ease;
}

.floating-submenu-enter-from,
.floating-submenu-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}
</style>
