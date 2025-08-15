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
      <!-- 面包屑导航组件 -->
      <Breadcrumb />
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
import Breadcrumb from './Breadcrumb.vue'
import LayoutConfigurator from './LayoutConfigurator.vue'
import NotificationPanel from './NotificationPanel.vue'
import { useNotificationStore } from '@/stores/notification'
import { ref } from 'vue'

// 通知 store
const notificationStore = useNotificationStore()

// PrimeVue Popover 引用
const ellipsisMenuRef = ref()
const layoutConfigPanelRef = ref()
const notificationPanelRef = ref()
const layoutConfigButtonRef = ref()
const notificationButtonRef = ref()

// 弹出框控制方法
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
