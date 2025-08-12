<template>
  <aside ref="sidebarRef" :class="sidebarClasses" :style="sidebarStyles">
    <!-- Sidebar Header -->
    <div
      class="flex h-16 items-center px-4"
      :class="collapsed ? 'justify-center' : 'justify-between'"
    >
      <div v-if="!collapsed" class="flex min-w-0 flex-1 items-center space-x-3">
        <div class="bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
          <i class="pi pi-bolt text-primary-contrast"></i>
        </div>
        <span class="text-surface-900 dark:text-surface-0 min-w-0 truncate text-lg font-semibold">
          Prime Admin
        </span>
      </div>
      <div v-else class="flex w-full justify-center">
        <div class="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <i class="pi pi-bolt text-primary-contrast"></i>
        </div>
      </div>

      <Button
        v-if="!collapsed"
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        size="small"
        @click="$emit('toggle')"
      />
    </div>

    <!-- 折叠状态下的切换按钮 -->
    <div v-if="collapsed" class="flex justify-center px-4 pb-2">
      <Button
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        size="small"
        @click="$emit('toggle')"
      />
    </div>

    <!-- Navigation Menu -->
    <nav class="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto px-2 pb-4">
      <AppMenu :collapsed="collapsed" />
    </nav>

    <!-- User Profile Section -->
    <div class="border-surface-200 dark:border-surface-700 relative flex-shrink-0 border-t p-3">
      <div
        class="hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-colors"
        @click="toggleUserMenu"
      >
        <Avatar :image="userStore.userAvatar" size="normal" shape="circle" class="flex-shrink-0" />
        <div v-if="!collapsed" class="min-w-0 flex-1">
          <p class="text-surface-900 dark:text-surface-0 truncate text-sm font-medium">
            {{ userStore.userName }}
          </p>
          <p class="text-surface-500 dark:text-surface-400 truncate text-xs">
            {{ userStore.user?.email }}
          </p>
        </div>
        <i
          v-if="!collapsed"
          class="pi pi-chevron-up text-surface-400 text-xs transition-transform"
          :class="showUserMenu ? 'rotate-180' : ''"
        ></i>
      </div>

      <!-- User Dropdown Menu -->
      <Transition name="dropdown">
        <div
          v-if="showUserMenu && !collapsed"
          ref="userMenuRef"
          class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 absolute right-3 bottom-full left-3 z-50 mb-2 rounded-lg border py-2 shadow-lg"
        >
          <template v-for="item in userStore.userMenuItems" :key="item.key">
            <div
              v-if="item.separator"
              class="border-surface-200 dark:border-surface-700 my-1 border-t"
            ></div>
            <a
              v-else
              href="#"
              :class="[
                'flex items-center px-4 py-2 text-sm transition-colors',
                item.action === 'logout'
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800',
              ]"
              @click.prevent="handleUserMenuClick(item)"
            >
              <i :class="[item.icon, 'mr-3']"></i>
              {{ item.label }}
            </a>
          </template>
        </div>
      </Transition>
    </div>

    <!-- Resize Handle -->
    <div
      v-if="resizable"
      ref="resizeHandleRef"
      class="hover:bg-primary/20 absolute top-0 right-0 h-full cursor-col-resize bg-transparent transition-colors"
      :class="collapsed ? 'w-2' : 'w-1'"
      @mousedown="startResize"
    >
      <div
        class="bg-surface-300 dark:bg-surface-600 absolute top-1/2 right-0 h-8 -translate-y-1/2 rounded-l"
        :class="collapsed ? 'w-2' : 'w-1'"
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
const userMenuRef = ref<HTMLElement>()
const isResizing = ref(false)
const resizeStartWidth = ref(0)
const hasTriggeredToggle = ref(false)
const showUserMenu = ref(false)

// 侧边栏样式类
const sidebarClasses = computed(() => [
  'flex flex-col transition-all duration-300 ease-in-out h-full overflow-hidden relative bg-surface-0 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700',
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

  isResizing.value = true
  hasTriggeredToggle.value = false
  const startX = e.clientX
  resizeStartWidth.value = props.collapsed ? 280 : props.width // 如果是折叠状态，从默认宽度开始

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return

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

  const handleMouseUp = () => {
    isResizing.value = false
    hasTriggeredToggle.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

// 用户菜单相关方法
const router = useRouter()

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleUserMenuClick = async (item: UserMenuItem) => {
  showUserMenu.value = false

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
