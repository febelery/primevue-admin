<template>
  <header
    class="border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 flex h-16 items-center justify-between border-b px-4"
  >
    <div class="flex items-center space-x-4">
      <!-- 面包屑导航 -->
      <div class="hidden max-w-sm items-center overflow-hidden md:flex lg:max-w-md">
        <div class="flex min-w-0 items-center space-x-2">
          <!-- 面包屑项目 -->
          <template v-for="(item, index) in displayBreadcrumbItems" :key="index">
            <!-- 分隔符（除了第一个项目） -->
            <i
              v-if="index > 0"
              class="pi pi-chevron-right text-surface-400 flex-shrink-0 text-xs"
            />

            <!-- 省略号菜单 -->
            <div v-if="item.isEllipsis" class="relative flex-shrink-0">
              <Button
                icon="pi pi-ellipsis-h"
                text
                size="small"
                class="ellipsis-button text-surface-400 hover:text-surface-600 px-1"
                @click="showEllipsisMenu = !showEllipsisMenu"
              />
              <!-- 省略号下拉菜单 -->
              <Transition name="dropdown">
                <div
                  v-if="showEllipsisMenu"
                  class="ellipsis-menu bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 absolute top-full left-0 z-50 mt-1 min-w-48 rounded-lg border py-2 shadow-lg"
                >
                  <template v-for="hiddenItem in hiddenBreadcrumbItems" :key="hiddenItem.label">
                    <router-link
                      v-if="hiddenItem.route"
                      :to="hiddenItem.route"
                      class="text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 flex items-center px-4 py-2 text-sm transition-colors"
                      @click="showEllipsisMenu = false"
                    >
                      <i v-if="hiddenItem.icon" :class="[hiddenItem.icon, 'mr-2']" />
                      {{ hiddenItem.label }}
                    </router-link>
                    <div
                      v-else
                      class="text-surface-400 dark:text-surface-500 flex cursor-default items-center px-4 py-2 text-sm"
                    >
                      <i v-if="hiddenItem.icon" :class="[hiddenItem.icon, 'mr-2']" />
                      {{ hiddenItem.label }}
                    </div>
                  </template>
                </div>
              </Transition>
            </div>

            <!-- 可点击的面包屑项（非当前页面） -->
            <router-link
              v-else-if="item.route && index < displayBreadcrumbItems.length - 1"
              :to="item.route"
              class="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 flex max-w-24 min-w-0 items-center truncate transition-colors lg:max-w-32"
              :title="item.label"
            >
              <i v-if="item.icon" :class="[item.icon, 'mr-1 flex-shrink-0']" />
              <span class="truncate">{{ item.label }}</span>
            </router-link>

            <!-- 当前页面（最后一项，不可点击） -->
            <span
              v-else
              class="text-surface-900 dark:text-surface-100 flex max-w-24 min-w-0 items-center truncate font-medium lg:max-w-32"
              :title="item.label"
            >
              <i v-if="item.icon" :class="[item.icon, 'mr-1 flex-shrink-0']" />
              <span class="truncate">{{ item.label }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- 搜索区域占位 -->
    <div class="mx-8 hidden flex-1 lg:block"></div>

    <div class="flex items-center space-x-2">
      <div class="relative">
        <Button
          ref="layoutConfigButtonRef"
          icon="pi pi-palette"
          severity="secondary"
          text
          rounded
          @click="toggleLayoutConfig"
          v-tooltip.bottom="'布局配置'"
        />

        <!-- Layout Config Dropdown -->
        <Transition name="dropdown">
          <div
            v-if="showLayoutConfig"
            ref="layoutConfigRef"
            class="absolute top-full right-0 z-50 mt-2 w-80"
          >
            <LayoutConfigurator @close="showLayoutConfig = false" />
          </div>
        </Transition>
      </div>

      <div class="relative">
        <Button
          ref="notificationButtonRef"
          icon="pi pi-bell"
          severity="secondary"
          text
          rounded
          @click="toggleNotifications"
          v-tooltip.bottom="'通知'"
        />
        <span
          v-if="notificationStore.unreadCount > 0"
          class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>

        <!-- 通知面板 -->
        <Transition name="dropdown">
          <div
            v-if="showNotifications"
            ref="notificationPanelRef"
            class="absolute top-full right-0 z-50 mt-2"
          >
            <NotificationPanel @close="showNotifications = false" />
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LayoutConfigurator from './LayoutConfigurator.vue'
import NotificationPanel from '@/components/NotificationPanel.vue'
import { useNotificationStore } from '@/stores/notification'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 通知 store
const notificationStore = useNotificationStore()

// 状态管理
const showNotifications = ref(false)
const showEllipsisMenu = ref(false)
const showLayoutConfig = ref(false)
const notificationButtonRef = ref<any>()
const notificationPanelRef = ref<HTMLElement>()
const layoutConfigRef = ref<HTMLElement>()
const layoutConfigButtonRef = ref<any>()

// 面包屑导航
const breadcrumbItems = computed(() => {
  // 基于当前路径构建面包屑
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs: any[] = []

  // 遍历路径段，为每个段构建面包屑项
  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`

    // 查找对应的路由记录
    const matchedRoute = route.matched.find((record) => {
      // 检查路由路径是否匹配当前构建的路径
      return (
        record.path === currentPath ||
        record.path.endsWith(segment) ||
        (record.name && router.resolve(currentPath).name === record.name)
      )
    })

    if (matchedRoute?.meta?.title) {
      breadcrumbs.push({
        label: matchedRoute.meta.title as string,
        icon: matchedRoute.meta.icon as string,
        route: currentPath,
      })
    }
  })

  return breadcrumbs
})

// 智能面包屑显示逻辑
const maxBreadcrumbItems = 4 // 最多显示4个项目
const displayBreadcrumbItems = computed(() => {
  const items = breadcrumbItems.value

  if (items.length <= maxBreadcrumbItems) {
    return items
  }

  // 如果超过最大数量，显示：第一个 + 省略号 + 最后两个
  const result: any[] = []
  result.push(items[0]) // 第一个
  result.push({ isEllipsis: true, label: '...' }) // 省略号

  // 最后两个
  const lastTwo = items.slice(-2)
  result.push(...lastTwo)

  return result
})

// 隐藏在省略号中的面包屑项
const hiddenBreadcrumbItems = computed(() => {
  const items = breadcrumbItems.value
  if (items.length <= maxBreadcrumbItems) {
    return []
  }

  // 返回中间被隐藏的项目（除了第一个和最后两个）
  return items.slice(1, -2)
})

// 方法

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleLayoutConfig = () => {
  showLayoutConfig.value = !showLayoutConfig.value
}

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as Element

  // 检查通知面板
  if (showNotifications.value) {
    const notificationButton = notificationButtonRef.value?.$el || notificationButtonRef.value
    const notificationPanel = notificationPanelRef.value

    if (notificationButton && notificationPanel) {
      const isClickInsideButton = notificationButton.contains(target)
      const isClickInsidePanel = notificationPanel.contains(target)

      if (!isClickInsideButton && !isClickInsidePanel) {
        showNotifications.value = false
      }
    }
  }

  // 检查布局配置菜单
  if (showLayoutConfig.value) {
    const configButton = layoutConfigButtonRef.value?.$el || layoutConfigButtonRef.value
    const configMenu = layoutConfigRef.value
    const layoutConfigurator = document.querySelector('.layout-configurator')

    if (configButton && (configMenu || layoutConfigurator)) {
      const isClickInsideButton = configButton.contains(target)
      const isClickInsideMenu = configMenu?.contains(target) || layoutConfigurator?.contains(target)

      if (!isClickInsideButton && !isClickInsideMenu) {
        showLayoutConfig.value = false
      }
    }
  }

  // 检查省略号菜单
  if (showEllipsisMenu.value) {
    const ellipsisMenu = document.querySelector('.ellipsis-menu')
    const ellipsisButton = document.querySelector('.ellipsis-button')

    if (ellipsisMenu && ellipsisButton) {
      if (!ellipsisMenu.contains(target) && !ellipsisButton.contains(target)) {
        showEllipsisMenu.value = false
      }
    }
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听路由变化关闭菜单
watch(
  () => route.path,
  () => {
    showNotifications.value = false
    showEllipsisMenu.value = false
    showLayoutConfig.value = false
  },
)
</script>
