<template>
  <div class="space-y-8 p-6">
    <div class="text-center">
      <h1 class="text-surface-900 dark:text-surface-0 mb-2 text-3xl font-bold">
        UserMenu 组件演示
      </h1>
      <p class="text-surface-600 dark:text-surface-400">展示 UserMenu 组件在不同场景下的使用方式</p>
    </div>

    <!-- 场景1：侧边栏模式（垂直布局） -->
    <Card>
      <template #title>
        <div class="flex items-center space-x-2">
          <i class="pi pi-sidebar text-primary"></i>
          <span>侧边栏模式（垂直布局）</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- 展开状态 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">展开状态</h3>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <UserMenu
                layout="vertical"
                :collapsed="false"
                avatar-size="normal"
                :show-online-status="true"
                :menu-width="64"
                @menu-item-click="handleMenuClick"
                @menu-toggle="handleMenuToggle"
              />
            </div>
          </div>

          <!-- 折叠状态 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">折叠状态</h3>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <UserMenu
                layout="vertical"
                :collapsed="true"
                avatar-size="normal"
                :show-online-status="true"
                :menu-width="64"
                @menu-item-click="handleMenuClick"
                @menu-toggle="handleMenuToggle"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 场景2：顶部导航栏模式（水平布局） -->
    <Card>
      <template #title>
        <div class="flex items-center space-x-2">
          <i class="pi pi-window-maximize text-primary"></i>
          <span>顶部导航栏模式（水平布局）</span>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">水平布局</h3>
          <div class="bg-surface-50 dark:bg-surface-800 flex justify-end rounded-lg p-4">
            <UserMenu
              layout="horizontal"
              :collapsed="false"
              avatar-size="normal"
              :show-online-status="true"
              :show-menu-header="false"
              :menu-width="56"
              @menu-item-click="handleMenuClick"
              @menu-toggle="handleMenuToggle"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 场景3：自定义配置 -->
    <Card>
      <template #title>
        <div class="flex items-center space-x-2">
          <i class="pi pi-cog text-primary"></i>
          <span>自定义配置</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- 大头像，无邮箱 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold">大头像，无邮箱</h3>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <UserMenu
                layout="vertical"
                :collapsed="false"
                avatar-size="large"
                :show-email="false"
                :show-online-status="false"
                :menu-width="48"
                @menu-item-click="handleMenuClick"
                @menu-toggle="handleMenuToggle"
              />
            </div>
          </div>

          <!-- 小头像，简化菜单 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold">小头像，简化菜单</h3>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <UserMenu
                layout="horizontal"
                :collapsed="false"
                avatar-size="small"
                :show-expand-icon="false"
                :show-menu-header="false"
                :custom-menu-items="simpleMenuItems"
                :menu-width="40"
                @menu-item-click="handleMenuClick"
                @menu-toggle="handleMenuToggle"
              />
            </div>
          </div>

          <!-- 自定义菜单项 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold">自定义菜单项</h3>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
              <UserMenu
                layout="vertical"
                :collapsed="false"
                avatar-size="normal"
                :custom-menu-items="customMenuItems"
                :menu-width="52"
                @menu-item-click="handleMenuClick"
                @menu-toggle="handleMenuToggle"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 事件日志 -->
    <Card>
      <template #title>
        <div class="flex items-center space-x-2">
          <i class="pi pi-list text-primary"></i>
          <span>事件日志</span>
        </div>
      </template>
      <template #content>
        <div class="max-h-40 space-y-2 overflow-y-auto">
          <div
            v-for="(log, index) in eventLogs"
            :key="index"
            class="bg-surface-100 dark:bg-surface-700 rounded p-2 text-sm"
          >
            <span class="text-surface-500 dark:text-surface-400">{{ log.time }}</span>
            <span class="ml-2">{{ log.message }}</span>
          </div>
          <div
            v-if="eventLogs.length === 0"
            class="text-surface-500 dark:text-surface-400 py-4 text-center"
          >
            暂无事件日志
          </div>
        </div>
        <div class="mt-4">
          <Button label="清空日志" severity="secondary" size="small" @click="clearLogs" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import UserMenu from '@/layouts/components/UserMenu.vue'
import type { UserMenuItem } from '@/types/user'
import { ref } from 'vue'

// 事件日志
const eventLogs = ref<Array<{ time: string; message: string }>>([])

// 简化菜单项
const simpleMenuItems: UserMenuItem[] = [
  {
    key: 'profile',
    label: '个人资料',
    icon: 'pi pi-user',
    route: '/profile',
  },
  {
    key: 'settings',
    label: '设置',
    icon: 'pi pi-cog',
    route: '/settings',
  },
  {
    key: 'separator',
    separator: true,
  },
  {
    key: 'logout',
    label: '退出',
    icon: 'pi pi-sign-out',
    action: 'logout',
  },
]

// 自定义菜单项
const customMenuItems: UserMenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表板',
    icon: 'pi pi-chart-line',
    route: '/dashboard',
  },
  {
    key: 'projects',
    label: '项目管理',
    icon: 'pi pi-folder',
    route: '/projects',
  },
  {
    key: 'team',
    label: '团队协作',
    icon: 'pi pi-users',
    route: '/team',
  },
  {
    key: 'separator1',
    separator: true,
  },
  {
    key: 'notifications',
    label: '通知设置',
    icon: 'pi pi-bell',
    route: '/notifications',
  },
  {
    key: 'separator2',
    separator: true,
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: 'pi pi-sign-out',
    action: 'logout',
  },
]

// 事件处理
const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  eventLogs.value.unshift({ time, message })

  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleMenuClick = (item: UserMenuItem) => {
  addLog(`菜单项点击: ${item.label} (${item.key})`)
}

const handleMenuToggle = (visible: boolean) => {
  addLog(`菜单状态变化: ${visible ? '显示' : '隐藏'}`)
}

const clearLogs = () => {
  eventLogs.value = []
}
</script>
