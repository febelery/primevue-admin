<template>
  <div
    class="from-surface-50 via-surface-100 to-surface-200 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800 relative flex h-screen overflow-hidden bg-gradient-to-br"
  >
    <!-- 背景装饰 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <!-- 渐变光晕 -->
      <div
        class="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full blur-3xl"
      ></div>
      <div
        class="bg-primary/3 absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full blur-3xl"
        style="animation-delay: 1s"
      ></div>

      <!-- 网格背景 -->
      <div
        class="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(var(--p-surface-900), 0.3) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        "
      ></div>
    </div>

    <AppSidebar
      v-if="isSidebarEnabled"
      :collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
      class="animate-slide-in-left relative z-10"
    />

    <div class="relative z-10 flex flex-1 flex-col overflow-hidden">
      <AppTopbar class="animate-fade-in-up z-2" />

      <!-- 内容区域 -->
      <main class="relative flex-1 overflow-auto">
        <div class="animate-fade-in-up h-full" style="animation-delay: 0.1s">
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
import { provide } from 'vue'

// 使用新的布局配置
const { layoutConfig, isSidebarCollapsed, isSidebarEnabled, toggleSidebar } = useLayout()

// 布局方法
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

// 提供布局配置和方法给子组件
provide('layoutConfig', layoutConfig.value)
provide('layoutMethods', layoutMethods)
provide('sidebarCollapsed', isSidebarCollapsed)
</script>
