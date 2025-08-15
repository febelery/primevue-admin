<template>
  <!-- 分隔符 -->
  <div v-if="item.separator" class="border-surface-200 dark:border-surface-700 my-3 border-t"></div>

  <!-- 菜单项 -->
  <div v-else-if="item.visible !== false" class="relative">
    <!-- 菜单项内容 -->
    <div
      ref="menuItemRef"
      :class="menuItemClasses"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      v-tooltip.right="collapsed && !inFloatingMenu ? item.label : null"
    >
      <!-- 层级缩进指示器 -->
      <div v-if="!collapsed && level > 0" :style="indentStyle" class="flex-shrink-0"></div>

      <!-- 图标 -->
      <i
        v-if="item.icon"
        :class="[item.icon, 'flex-shrink-0', collapsed ? 'text-lg' : 'text-base']"
      ></i>

      <!-- 标签 -->
      <span v-if="!collapsed || inFloatingMenu" class="min-w-0 flex-1 truncate">{{
        item.label
      }}</span>

      <!-- 徽章 -->
      <span
        v-if="(!collapsed || inFloatingMenu) && item.badge"
        :class="[
          'inline-flex flex-shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium text-white',
          item.badgeClass || 'bg-primary',
        ]"
      >
        {{ item.badge }}
      </span>

      <!-- 非折叠状态的展开/折叠图标 -->
      <Motion
        v-if="(!collapsed || inFloatingMenu) && hasChildren"
        :animate="{ rotate: isMenuExpanded ? 90 : 0 }"
        :transition="{ duration: 0.2, ease: 'easeInOut' }"
      >
        <i class="pi pi-chevron-right flex-shrink-0 text-sm"></i>
      </Motion>
    </div>

    <!-- 非折叠状态下的子菜单 -->
    <Motion
      v-if="hasChildren && (!collapsed || inFloatingMenu)"
      :initial="{ height: 0, opacity: 0 }"
      :animate="{ height: isMenuExpanded ? 'auto' : 0, opacity: isMenuExpanded ? 1 : 0 }"
      :transition="{
        duration: 0.3,
        ease: 'easeInOut',
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: isMenuExpanded ? 0.1 : 0 },
      }"
      class="overflow-hidden"
    >
      <div v-if="isMenuExpanded" class="space-y-2">
        <AppMenu
          v-for="child in item.children"
          :key="child.key"
          :item="child"
          :collapsed="collapsed"
          :level="level + 1"
          :in-floating-menu="inFloatingMenu"
        />
      </div>
    </Motion>

    <!-- 折叠状态下的级联菜单 -->
    <Teleport to="body">
      <div
        v-if="collapsed && !inFloatingMenu && state.showCascadeMenu"
        ref="cascadeMenuRef"
        :class="cascadeMenuClasses"
        :style="cascadeMenuPosition"
        @mouseenter="clearAllTimers"
        @mouseleave="delayHideCascadeMenu"
      >
        <!-- 级联菜单头部 -->
        <div class="border-surface-200 dark:border-surface-700 border-b px-4 py-3">
          <div class="flex items-center gap-3">
            <i v-if="item.icon" :class="[item.icon, 'text-primary text-lg']"></i>
            <span class="text-surface-900 dark:text-surface-100 text-base font-medium">{{
              item.label
            }}</span>
          </div>
        </div>

        <!-- 级联菜单内容 -->
        <div class="max-h-96 overflow-y-auto py-2">
          <template v-for="child in item.children" :key="child.key">
            <div
              ref="cascadeItemRefs"
              :data-key="child.key"
              :class="getCascadeItemClasses(child)"
              @click="handleCascadeItemClick(child)"
              @mouseenter="handleCascadeItemHover(child, $event)"
              @mouseleave="handleCascadeItemLeave"
            >
              <div class="flex items-center gap-3 px-4 py-2.5">
                <i v-if="child.icon" :class="[child.icon, 'flex-shrink-0 text-lg']"></i>
                <span class="flex-1 truncate text-base">{{ child.label }}</span>
                <span
                  v-if="child.badge"
                  :class="[
                    'inline-flex flex-shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-medium text-white',
                    child.badgeClass || 'bg-primary',
                  ]"
                >
                  {{ child.badge }}
                </span>
                <i
                  v-if="child.children?.length"
                  class="pi pi-chevron-right text-surface-400 flex-shrink-0 text-sm"
                ></i>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- 二级级联菜单 -->
    <Teleport to="body">
      <div
        v-if="
          collapsed && !inFloatingMenu && state.showSecondaryCascade && state.currentHoveredItem
        "
        ref="secondaryCascadeRef"
        :class="cascadeMenuClasses"
        :style="secondaryCascadePosition"
        @mouseenter="clearAllTimers"
        @mouseleave="delayHideCascadeMenu"
      >
        <div class="border-surface-200 dark:border-surface-700 border-b px-4 py-3">
          <div class="flex items-center gap-3">
            <i
              v-if="state.currentHoveredItem.icon"
              :class="[state.currentHoveredItem.icon, 'text-primary text-lg']"
            ></i>
            <span class="text-surface-900 dark:text-surface-100 text-base font-medium">{{
              state.currentHoveredItem.label
            }}</span>
          </div>
        </div>
        <div class="max-h-96 overflow-y-auto py-2">
          <div
            v-for="grandChild in state.currentHoveredItem.children"
            :key="grandChild.key"
            :class="getCascadeItemClasses(grandChild)"
            @click="handleCascadeItemClick(grandChild)"
          >
            <div class="flex items-center gap-3 px-4 py-2.5">
              <i v-if="grandChild.icon" :class="[grandChild.icon, 'flex-shrink-0 text-lg']"></i>
              <span class="flex-1 truncate text-base">{{ grandChild.label }}</span>
              <span
                v-if="grandChild.badge"
                :class="[
                  'inline-flex flex-shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-medium text-white',
                  grandChild.badgeClass || 'bg-primary',
                ]"
              >
                {{ grandChild.badge }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/composables/useMenu'
import { useMenu } from '@/composables/useMenu'
import { computed, reactive, ref } from 'vue'
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
const { isExpanded, isFloatingExpanded, getMenuItemClasses, handleMenuClick } = useMenu()

// 状态管理
const state = reactive({
  showCascadeMenu: false,
  showSecondaryCascade: false,
  currentHoveredItem: null as MenuItem | null,
  hoveredItemElement: null as HTMLElement | null,
  hideTimer: null as any,
  secondaryShowTimer: null as any,
  secondaryHideTimer: null as any,
})

// DOM 引用
const menuItemRef = ref<HTMLElement>()
const cascadeMenuRef = ref<HTMLElement>()
const secondaryCascadeRef = ref<HTMLElement>()
const cascadeItemRefs = ref<HTMLElement[]>([])

// 是否有子菜单
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

// 菜单是否展开
const isMenuExpanded = computed(() => {
  return props.inFloatingMenu ? isFloatingExpanded(props.item.key) : isExpanded(props.item.key)
})

// 菜单项样式
const menuItemClasses = computed(() => {
  const baseClasses = getMenuItemClasses(props.item, {
    collapsed: props.collapsed,
    inFloatingMenu: props.inFloatingMenu,
    level: props.level,
  })
  if (props.collapsed && !props.inFloatingMenu) {
    return [...baseClasses, 'justify-center py-3 px-4 my-1']
  }
  return [...baseClasses, 'py-2 px-3 my-1']
})

// 缩进样式
const indentStyle = computed(() => ({
  width: `${props.level * 20}px`, // 增加缩进宽度以提升视觉层次感
}))

// 级联菜单样式
const cascadeMenuClasses = computed(() => [
  'fixed z-[9999] min-w-72 max-w-96',
  'bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-xl',
  'border border-surface-200/50 dark:border-surface-700/50',
  'rounded-xl shadow-2xl',
  'transition-opacity duration-200',
])

// 级联菜单位置
const cascadeMenuPosition = computed(() => {
  if (!menuItemRef.value) return { display: 'none' }
  const rect = menuItemRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const menuWidth = 288 // 配合 min-w-72
  const estimatedHeight = Math.min(400, (props.item.children?.length || 0) * 48 + 80)
  let left = rect.right + 12 // 增加间距
  let top = rect.top - 12
  if (left + menuWidth > viewportWidth - 16) {
    left = rect.left - menuWidth - 12
  }
  if (top + estimatedHeight > viewportHeight - 16) {
    top = Math.max(16, viewportHeight - estimatedHeight - 16)
  }
  if (top < 16) {
    top = 16
  }
  return { left: `${left}px`, top: `${top}px` }
})

// 二级级联菜单位置
const secondaryCascadePosition = computed(() => {
  if (!state.hoveredItemElement || !state.currentHoveredItem) return { display: 'none' }
  const rect = state.hoveredItemElement.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const menuWidth = 288
  const estimatedHeight = Math.min(400, (state.currentHoveredItem.children?.length || 0) * 48 + 80)
  let left = rect.right + 12
  let top = rect.top - 12
  if (left + menuWidth > viewportWidth - 16) {
    left = rect.left - menuWidth - 12
  }
  if (top + estimatedHeight > viewportHeight - 16) {
    top = Math.max(16, viewportHeight - estimatedHeight - 16)
  }
  return { left: `${left}px`, top: `${top}px` }
})

// 计算级联菜单项样式
const getCascadeItemClasses = (item: MenuItem) => [
  'cursor-pointer transition-colors duration-150',
  'hover:bg-surface-50 dark:hover:bg-surface-800',
  'text-surface-700 dark:text-surface-300',
  { 'bg-primary/10 text-primary': item.route === router.currentRoute.value.path },
]

// 清理所有定时器
const clearAllTimers = () => {
  ;[state.hideTimer, state.secondaryShowTimer, state.secondaryHideTimer].forEach((timer) => {
    if (timer) clearTimeout(timer)
  })
  state.hideTimer = null
  state.secondaryShowTimer = null
  state.secondaryHideTimer = null
}

// 处理菜单项点击
const handleClick = () => {
  if (props.collapsed && !props.inFloatingMenu && hasChildren.value) return
  handleMenuClick(props.item, hasChildren.value, props.collapsed, props.inFloatingMenu)
}

// 处理级联菜单项点击
const handleCascadeItemClick = (item: MenuItem) => {
  if (item.route) {
    router.push(item.route)
    hideCascadeMenu()
  }
}

// 显示级联菜单
const showCascadeMenuFn = () => {
  clearAllTimers()
  state.showCascadeMenu = true
}

// 隐藏级联菜单
const hideCascadeMenu = () => {
  clearAllTimers()
  state.showCascadeMenu = false
  state.showSecondaryCascade = false
  state.currentHoveredItem = null
  state.hoveredItemElement = null
}

// 延迟隐藏级联菜单
const delayHideCascadeMenu = () => {
  state.hideTimer = setTimeout(hideCascadeMenu, 200)
}

// 处理级联菜单项悬停
const handleCascadeItemHover = (item: MenuItem, event: MouseEvent) => {
  clearAllTimers()
  if (item.children?.length) {
    state.currentHoveredItem = item
    state.hoveredItemElement = event.currentTarget as HTMLElement
    state.secondaryShowTimer = setTimeout(() => {
      state.showSecondaryCascade = true
    }, 150)
  } else {
    state.showSecondaryCascade = false
    state.currentHoveredItem = null
    state.hoveredItemElement = null
  }
}

// 处理级联菜单项离开
const handleCascadeItemLeave = () => {
  clearAllTimers()
  state.secondaryHideTimer = setTimeout(() => {
    state.showSecondaryCascade = false
    state.currentHoveredItem = null
    state.hoveredItemElement = null
  }, 100)
}

// 鼠标事件处理
const handleMouseEnter = () => {
  if (props.collapsed && !props.inFloatingMenu && hasChildren.value) {
    showCascadeMenuFn()
  }
}

const handleMouseLeave = () => {
  if (props.collapsed && !props.inFloatingMenu && hasChildren.value) {
    delayHideCascadeMenu()
  }
}
</script>
