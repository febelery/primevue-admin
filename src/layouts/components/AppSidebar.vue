<template>
  <aside ref="sidebarRef" :class="sidebarClasses" :style="sidebarStyles">
    <!-- 侧边栏装饰背景 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <!-- 渐变装饰 -->
      <div
        class="from-primary/5 absolute top-0 right-0 left-0 h-32 bg-gradient-to-b to-transparent"
      ></div>
      <div
        class="from-primary/3 absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t to-transparent"
      ></div>

      <!-- 侧边装饰线 -->
      <div
        class="via-primary/20 absolute top-16 right-0 bottom-16 w-px bg-gradient-to-b from-transparent to-transparent"
      ></div>
    </div>

    <div
      class="border-surface-200/50 dark:border-surface-700/50 relative z-10 flex h-16 items-center border-b px-4"
      :class="collapsed ? 'justify-center' : 'justify-between'"
    >
      <div v-if="!collapsed" class="flex min-w-0 flex-1 items-center space-x-3">
        <div
          class="from-primary-400 to-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
        >
          <i class="pi pi-bolt text-primary-contrast text-lg"></i>
        </div>
        <div class="min-w-0 flex-1">
          <span
            class="text-surface-900 dark:text-surface-0 block truncate text-xl font-bold tracking-tight"
          >
            Prime Admin
          </span>
          <span class="text-surface-500 dark:text-surface-400 block text-xs font-medium">
            管理控制台
          </span>
        </div>
      </div>
      <div v-else class="flex w-full justify-center">
        <div
          class="from-primary-400 to-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg"
        >
          <i class="pi pi-bolt text-primary-contrast flex-shrink-0 text-lg"></i>
        </div>
      </div>

      <Button
        v-if="!collapsed"
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        size="small"
        class="hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200"
        @click="$emit('toggle')"
        v-tooltip.bottom="'收起侧边栏'"
      />
    </div>

    <!-- 折叠状态下的切换按钮 -->
    <div v-if="collapsed" class="relative z-10 flex justify-center px-4 pt-2 pb-2">
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        size="small"
        class="hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200"
        @click="$emit('toggle')"
        v-tooltip.right="'展开侧边栏'"
      />
    </div>

    <!-- Navigation Menu -->
    <nav class="custom-scrollbar relative z-10 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
      <AppMenu :collapsed="collapsed" />
    </nav>

    <!-- User Profile Section -->
    <div
      class="border-surface-200/50 dark:border-surface-700/50 relative z-10 flex-shrink-0 border-t backdrop-blur-sm"
    >
      <!-- 用户区域装饰 -->
      <div
        class="from-surface-100/50 dark:from-surface-800/50 absolute inset-0 bg-gradient-to-t to-transparent"
      ></div>

      <div class="relative p-3">
        <div
          class="hover:bg-surface-100/80 dark:hover:bg-surface-800/80 group flex cursor-pointer items-center rounded-xl p-3 transition-all duration-200 hover:shadow-md"
          :class="collapsed ? 'justify-center space-x-0' : 'space-x-3'"
          @click="toggleUserMenu"
        >
          <div class="relative flex-shrink-0">
            <Avatar
              :image="userStore.userAvatar"
              size="normal"
              shape="circle"
              class="ring-primary/20 group-hover:ring-primary/40 ring-2 transition-all duration-200"
            />
            <!-- 在线状态指示器 -->
            <div
              class="border-surface-0 dark:border-surface-900 absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-500"
            ></div>
          </div>

          <div v-if="!collapsed" class="min-w-0 flex-1">
            <p
              class="text-surface-900 dark:text-surface-0 group-hover:text-primary truncate text-sm font-semibold transition-colors"
            >
              {{ userStore.userName }}
            </p>
            <p class="text-surface-500 dark:text-surface-400 truncate text-xs">
              {{ userStore.user?.email }}
            </p>
          </div>

          <i
            v-if="!collapsed"
            class="pi pi-chevron-up text-surface-400 group-hover:text-primary text-xs transition-all duration-200"
          ></i>
        </div>

        <!-- User Menu Popover -->
        <Popover ref="userMenuRef">
          <div class="w-64">
            <!-- 菜单头部 -->
            <div class="border-surface-200/50 dark:border-surface-700/50 border-b px-4 py-3">
              <div class="flex items-center space-x-3">
                <Avatar
                  :image="userStore.userAvatar"
                  :label="userStore.userName.charAt(0).toUpperCase()"
                  size="large"
                  shape="circle"
                  class="bg-primary text-primary-contrast"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-surface-900 dark:text-surface-0 truncate text-sm font-semibold">
                    {{ userStore.userName }}
                  </p>
                  <p class="text-surface-500 dark:text-surface-400 truncate text-xs">
                    {{ userStore.user?.email }}
                  </p>
                </div>
              </div>
            </div>

            <div class="py-2">
              <template v-for="item in userStore.userMenuItems" :key="item.key">
                <Divider v-if="item.separator" class="my-2" />
                <a
                  v-else
                  href="#"
                  :class="[
                    'group hover:bg-surface-50 dark:hover:bg-surface-800 mx-2 flex items-center rounded-lg px-4 py-3 text-sm transition-all duration-200',
                    item.action === 'logout'
                      ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                      : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100',
                  ]"
                  @click.prevent="handleUserMenuClick(item)"
                >
                  <i
                    :class="[
                      item.icon,
                      'mr-3 text-base transition-transform duration-200 group-hover:scale-110',
                      item.action === 'logout' ? 'text-red-500' : 'text-surface-500',
                    ]"
                  ></i>
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  <i
                    class="pi pi-chevron-right ml-auto text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  ></i>
                </a>
              </template>
            </div>
          </div>
        </Popover>
      </div>
    </div>

    <div
      v-if="resizable"
      ref="resizeHandleRef"
      class="hover:bg-primary/20 absolute top-0 right-0 z-20 h-full cursor-col-resize bg-transparent transition-colors"
      :class="collapsed ? 'w-3' : 'w-2'"
      @mousedown.stop="startResize"
      @click.stop
    >
      <div
        class="bg-surface-300 dark:bg-surface-600 pointer-events-none absolute top-1/2 right-0 h-8 -translate-y-1/2 rounded-l"
        :class="collapsed ? 'w-1' : 'w-0.5'"
      ></div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import AppMenu from './AppMenu.vue'
import { useUserStore } from '@/stores/user'
import type { UserMenuItem } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  collapsed?: boolean
  width?: number
  resizable?: boolean
}

interface Emits {
  (e: 'toggle'): void
  (e: 'resize', width: number): void
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  width: 280,
  resizable: true,
})

const emit = defineEmits<Emits>()

// 用户 store
const userStore = useUserStore()

const sidebarRef = ref<HTMLElement>()
const resizeHandleRef = ref<HTMLElement>()
const userMenuRef = ref()
const isResizing = ref(false)
const resizeStartWidth = ref(0)
const hasTriggeredToggle = ref(false)

// 侧边栏样式类
const sidebarClasses = computed(() => [
  'flex flex-col transition-all duration-200 ease-in-out h-full overflow-hidden relative',
  'bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-xl',
  'border-r border-surface-200/50 dark:border-surface-700/50',
  'shadow-xl shadow-surface-900/5 dark:shadow-surface-950/20',
  {
    // Width styles
    'w-16': props.collapsed,
  },
])

// 侧边栏内联样式
const sidebarStyles = computed(() => ({
  width: props.collapsed ? '4rem' : `${props.width}px`,
}))

// 拖拽调整宽度
const startResize = (e: MouseEvent) => {
  if (!props.resizable) return

  e.preventDefault()
  e.stopPropagation()

  isResizing.value = true
  hasTriggeredToggle.value = false
  const startX = e.clientX
  resizeStartWidth.value = props.collapsed ? 280 : props.width // 如果是折叠状态，从默认宽度开始

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return

    e.preventDefault()

    const deltaX = e.clientX - startX
    const newWidth = Math.max(64, Math.min(400, resizeStartWidth.value + deltaX))

    // 平滑的临界值处理
    const collapseThreshold = 140
    const expandThreshold = 180

    if (!props.collapsed && newWidth < collapseThreshold && !hasTriggeredToggle.value) {
      // 从展开状态拖拽到很小时，折叠
      hasTriggeredToggle.value = true
      emit('toggle')
    } else if (props.collapsed && newWidth > expandThreshold && !hasTriggeredToggle.value) {
      // 从折叠状态拖拽到足够大时，展开
      hasTriggeredToggle.value = true
      emit('toggle')
      // 展开后设置宽度
      setTimeout(() => {
        emit('resize', Math.max(200, newWidth))
      }, 50)
    } else if (!props.collapsed && !hasTriggeredToggle.value) {
      // 正常调整宽度
      emit('resize', newWidth)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    isResizing.value = false
    hasTriggeredToggle.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.body.style.pointerEvents = ''
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.body.style.pointerEvents = 'none'
}

// 用户菜单相关方法
const router = useRouter()

const toggleUserMenu = (event: Event) => {
  userMenuRef.value?.toggle(event)
}

const handleUserMenuClick = async (item: UserMenuItem) => {
  userMenuRef.value?.hide() // 关闭菜单

  if (item.action === 'logout') {
    await userStore.logout()
  } else if (item.route) {
    router.push(item.route)
  }
}

onMounted(() => {
  // 初始化用户数据
  userStore.fetchCurrentUser()
})
</script>
