<template>
  <header
    class="bg-surface-0/80 dark:bg-surface-900/80 border-surface-200/50 dark:border-surface-700/50 relative flex h-16 items-center justify-between px-6 backdrop-blur-xl"
  >
    <!-- 顶栏装饰背景 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <!-- 渐变装饰 -->
      <div
        class="from-primary/2 to-primary/2 absolute top-0 right-0 left-0 h-full bg-gradient-to-r via-transparent"
      ></div>
      <!-- 底部装饰线 -->
      <div
        class="via-primary/30 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent"
      ></div>
    </div>
    <div class="relative flex items-center space-x-6">
      <!-- 面包屑导航 -->
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
              <router-link
                v-if="item.to && index < breadcrumbItems.length - 1"
                :to="item.to"
                class="text-surface-600 dark:text-surface-400 hover:text-primary hover:bg-surface-200/50 dark:hover:bg-surface-700/50 flex max-w-24 items-center truncate rounded-md px-2 py-1 transition-colors lg:max-w-32"
                :title="item.label"
              >
                <i v-if="item.icon" :class="[item.icon, 'mr-1 text-xs']"></i>
                <span class="truncate font-medium">{{ item.label }}</span>
              </router-link>

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
    </div>

    <div class="relative flex items-center space-x-3">
      <!-- 全屏切换 -->
      <Button
        :icon="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
        severity="secondary"
        text
        rounded
        class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200 hover:scale-105"
        @click="toggleFullscreen"
        v-tooltip.bottom="isFullscreen ? '退出全屏' : '全屏'"
      />

      <!-- 布局配置按钮 -->
      <Button
        ref="layoutConfigButtonRef"
        icon="pi pi-palette"
        severity="secondary"
        text
        rounded
        class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200 hover:scale-105"
        @click="toggleLayoutConfig"
        v-tooltip.bottom="'布局配置'"
      />

      <!-- 通知按钮 -->
      <div class="relative">
        <Button
          ref="notificationButtonRef"
          icon="pi pi-bell"
          severity="secondary"
          text
          rounded
          class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200 hover:scale-105"
          @click="toggleNotifications"
          v-tooltip.bottom="'通知'"
        />
        <!-- 通知徽章 -->
        <span
          v-if="notificationStore.unreadCount > 0"
          class="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-bold text-white shadow-lg ring-2 ring-red-500/30"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </div>

      <!-- 更多操作 -->
      <Button
        ref="ellipsisButtonRef"
        icon="pi pi-ellipsis-v"
        severity="secondary"
        text
        rounded
        class="hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary transition-all duration-200 hover:scale-105"
        @click="toggleEllipsisMenu"
        v-tooltip.bottom="'更多'"
      />
    </div>

    <!-- 更多操作菜单 -->
    <Popover ref="ellipsisMenuRef">
      <div class="w-48 space-y-1">
        <router-link
          to="/settings"
          class="hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <i class="pi pi-cog text-surface-500"></i>
          <span>系统设置</span>
        </router-link>
        <router-link
          to="/help"
          class="hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <i class="pi pi-question-circle text-surface-500"></i>
          <span>帮助中心</span>
        </router-link>
        <router-link
          to="/feedback"
          class="hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <i class="pi pi-comment text-surface-500"></i>
          <span>意见反馈</span>
        </router-link>
      </div>
    </Popover>

    <!-- 布局配置面板 -->
    <Popover ref="layoutConfigPanelRef">
      <div class="w-80">
        <LayoutConfigurator @close="layoutConfigPanelRef?.hide()" />
      </div>
    </Popover>

    <!-- 通知面板 -->
    <Popover
      ref="notificationPanelRef"
      :pt="{
        root: { class: 'shadow-2xl border-0' },
        content: { class: 'rounded-xl overflow-hidden p-0 border-0' },
      }"
    >
      <NotificationPanel @close="notificationPanelRef?.hide()" />
    </Popover>
  </header>
</template>

<script setup lang="ts">
import LayoutConfigurator from './LayoutConfigurator.vue'
import NotificationPanel from './NotificationPanel.vue'
import { useNotificationStore } from '@/stores/notification'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 通知 store
const notificationStore = useNotificationStore()

// PrimeVue Popover 引用
const ellipsisMenuRef = ref()
const layoutConfigPanelRef = ref()
const notificationPanelRef = ref()
const layoutConfigButtonRef = ref()
const notificationButtonRef = ref()

// 面包屑导航
const breadcrumbItems = computed(() => {
  const breadcrumbs: Array<{ label: string; icon?: string; to?: string }> = []

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

// 方法
const toggleNotifications = (event: Event) => {
  notificationPanelRef.value?.toggle(event)
}

const toggleLayoutConfig = (event: Event) => {
  layoutConfigPanelRef.value?.toggle(event)
}

const toggleEllipsisMenu = (event: Event) => {
  ellipsisMenuRef.value?.toggle(event)
}

// 全屏状态
const isFullscreen = ref(false)

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}
</script>
