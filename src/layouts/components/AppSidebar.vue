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
      class="border-surface-200/50 dark:border-surface-700/50 relative flex h-16 items-center border-b px-4"
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
    <div v-if="collapsed" class="relative flex justify-center px-4 pt-2 pb-2">
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
    <nav class="relative flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
      <!-- 未实现 -->
    </nav>

    <div
      class="border-surface-200/50 dark:border-surface-700/50 relative flex-shrink-0 border-t backdrop-blur-sm"
    >
      <!-- 用户区域装饰 -->
      <div
        class="from-surface-100/50 dark:from-surface-800/50 absolute inset-0 bg-gradient-to-t to-transparent"
      ></div>

      <div class="relative p-3">
        <!-- 使用新的 UserMenu 组件 -->
        <UserMenu
          layout="vertical"
          :collapsed="collapsed"
          avatar-size="normal"
          :show-online-status="true"
          :menu-width="64"
          @menu-item-click="handleUserMenuClick"
          @menu-toggle="handleUserMenuToggle"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import UserMenu from '@/layouts/components/UserMenu.vue'
import { useUserStore } from '@/stores/user'
import type { UserMenuItem } from '@/types/user'
import { computed, onMounted, ref } from 'vue'

interface Props {
  collapsed?: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

defineEmits<Emits>()

// 用户 store
const userStore = useUserStore()

const sidebarRef = ref<HTMLElement>()

// 侧边栏样式类
const sidebarClasses = computed(() => [
  'flex flex-col transition-all duration-200 ease-in-out h-full overflow-hidden relative',
  'bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-xl',
  'border-r border-surface-200/50 dark:border-surface-700/50',
  'shadow-xl shadow-surface-900/5 dark:shadow-surface-950/20',
  {
    'w-16': props.collapsed,
  },
])

// 侧边栏内联样式 - 使用固定宽度
const sidebarStyles = computed(() => ({
  width: props.collapsed ? '4rem' : '280px',
}))

// 用户菜单事件处理
const handleUserMenuClick = (item: UserMenuItem) => {
  // UserMenu 组件内部已经处理了默认逻辑
  // 这里可以添加额外的处理逻辑
  console.log('用户菜单点击:', item)
}

const handleUserMenuToggle = (visible: boolean) => {
  // 处理用户菜单显示/隐藏状态变化
  console.log('用户菜单状态:', visible ? '显示' : '隐藏')
}

onMounted(() => {
  // 初始化用户数据
  userStore.fetchCurrentUser()
})
</script>
