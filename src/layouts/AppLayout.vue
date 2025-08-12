<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar
      v-if="layoutConfig.sidebar.enabled"
      :collapsed="isSidebarCollapsed"
      :width="sidebarWidth"
      @toggle="toggleSidebar"
      @resize="handleSidebarResize"
    />

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Topbar -->
      <AppTopbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <div class="h-full">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import { useLayout } from '@/composables/useLayout'
import { computed, provide, ref } from 'vue'

// 使用新的布局配置
const { layoutConfig, isSidebarCollapsed, toggleSidebar } = useLayout()

// 侧边栏宽度（保持向后兼容）
const sidebarWidth = ref(280)

// 处理侧边栏宽度调整
const handleSidebarResize = (width: number) => {
  sidebarWidth.value = Math.max(64, Math.min(400, width))
}

// 布局方法（保持向后兼容）
const layoutMethods = {
  toggleSidebar,
  setSidebarVariant: (variant: string) => {
    // 这里可以根据需要扩展
    console.log('setSidebarVariant:', variant)
  },
  setSidebarEnabled: (enabled: boolean) => {
    layoutConfig.value.sidebar.enabled = enabled
  },
}

// 提供布局配置和方法给子组件（保持向后兼容）
provide('layoutConfig', layoutConfig.value)
provide('layoutMethods', layoutMethods)
provide('sidebarCollapsed', isSidebarCollapsed)
provide(
  'sidebarWidth',
  computed(() => sidebarWidth.value),
)
</script>
