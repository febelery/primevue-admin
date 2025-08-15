<template>
  <div class="hidden max-w-sm items-center overflow-hidden md:flex lg:max-w-md">
    <div class="flex min-w-0 items-center rounded-lg px-3 py-2 backdrop-blur-sm">
      <nav class="flex items-center space-x-2 text-sm">
        <!-- 首页 -->
        <router-link
          to="/"
          class="text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-200/50 dark:hover:bg-surface-700/50 flex items-center rounded-md px-2 py-1 transition-colors"
        >
          <i class="pi pi-home text-sm"></i>
        </router-link>

        <!-- 面包屑项目 -->
        <template v-for="(item, index) in breadcrumbItems" :key="index">
          <i class="pi pi-chevron-right text-surface-400 text-xs"></i>

          <!-- 可点击的面包屑项 -->
          <component
            :is="item.to && index < breadcrumbItems.length - 1 ? 'button' : 'span'"
            v-if="item.to && index < breadcrumbItems.length - 1"
            @click="handleBreadcrumbClick(item)"
            class="text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-200/50 dark:hover:bg-surface-700/50 flex max-w-24 cursor-pointer items-center truncate rounded-md px-2 py-1 transition-colors lg:max-w-32"
            :title="item.label"
          >
            <i v-if="item.icon" :class="[item.icon, 'mr-1 text-xs']"></i>
            <span class="truncate font-medium">{{ item.label }}</span>
          </component>

          <!-- 当前页面（不可点击） -->
          <span
            v-else
            class="text-surface-900 dark:text-surface-100 bg-primary/10 border-primary/20 flex max-w-24 min-w-0 items-center truncate rounded-lg border px-3 py-1.5 font-semibold lg:max-w-32"
            :title="item.label"
          >
            <i v-if="item.icon" :class="[item.icon, 'mr-1 text-xs']"></i>
            <span class="truncate">{{ item.label }}</span>
          </span>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenu, type BreadcrumbItem } from '@/composables/useMenu'

// 使用 useMenu composable 获取面包屑相关功能
const { breadcrumbItems, navigateToRoute } = useMenu()

/**
 * 处理面包屑点击事件
 * @param item 面包屑项
 */
const handleBreadcrumbClick = async (item: BreadcrumbItem) => {
  if (!item.to) return
  await navigateToRoute(item.to)
}
</script>
